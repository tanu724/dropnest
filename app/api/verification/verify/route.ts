
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyOTPHash } from "@/lib/otp";

const validPurposes = [
  "pickup",
  "delivery",
  "storage_checkin",
  "storage_checkout",
];

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);
    const supabase = createSupabaseServerClient(token);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // 2. Validate request
    const body = await request.json();
    const { booking_id, purpose, otp } = body;

    if (
      typeof booking_id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(booking_id) ||
      typeof purpose !== "string" ||
      !validPurposes.includes(purpose) ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid verification details" },
        { status: 400 }
      );
    }

    // 3. Confirm booking access and service type
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("id, user_id, provider_id, service_type")
      .eq("id", booking_id)
      .maybeSingle();

    if (
      bookingError ||
      !booking ||
      (booking.user_id !== user.id && booking.provider_id !== user.id)
    ) {
      return NextResponse.json(
        { success: false, message: "Booking not found or access denied" },
        { status: 403 }
      );
    }

    const isStoragePurpose = purpose.startsWith("storage_");

    if (
      (booking.service_type === "storage") !== isStoragePurpose
    ) {
      return NextResponse.json(
        { success: false, message: "OTP purpose does not match booking type" },
        { status: 400 }
      );
    }

    // 4. Find the newest unverified OTP
    const { data: record, error } = await supabaseAdmin
      .from("otp_verifications")
      .select("*")
      .eq("booking_id", booking_id)
      .eq("purpose", purpose)
      .is("verified_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !record) {
      return NextResponse.json(
        { success: false, message: "No active OTP found" },
        { status: 404 }
      );
    }

    // 5. Check expiry
    if (new Date(record.expires_at).getTime() <= Date.now()) {
      return NextResponse.json(
        { success: false, message: "OTP has expired" },
        { status: 400 }
      );
    }

    // 6. Check attempt limit
    if (record.attempts >= record.max_attempts) {
      return NextResponse.json(
        { success: false, message: "Maximum OTP attempts exceeded" },
        { status: 429 }
      );
    }

    // 7. Atomically claim one verification attempt
    const { data: claimedAttempt, error: attemptError } =
      await supabaseAdmin
        .from("otp_verifications")
        .update({ attempts: record.attempts + 1 })
        .eq("id", record.id)
        .eq("attempts", record.attempts)
        .is("verified_at", null)
        .gt("expires_at", new Date().toISOString())
        .lt("attempts", record.max_attempts)
        .select("id")
        .maybeSingle();

    if (attemptError || !claimedAttempt) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP expired, already used, or another verification attempt is processing",
        },
        { status: 409 }
      );
    }

    // 8. Verify submitted OTP
    if (!verifyOTPHash(otp, record.otp_hash)) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect OTP",
          attempts_remaining: record.max_attempts - record.attempts - 1,
        },
        { status: 400 }
      );
    }

    // 9. Mark OTP as verified
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("otp_verifications")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", record.id)
      .is("verified_at", null)
      .select("id")
      .maybeSingle();

    if (updateError || !updated) {
      return NextResponse.json(
        { success: false, message: "OTP already used or verification failed" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("OTP verification error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
