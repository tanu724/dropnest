
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateOTP, hashOTP } from "@/lib/otp";

const purposes = [
  "pickup",
  "delivery",
  "storage_checkin",
  "storage_checkout",
];

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { booking_id, purpose } = body;

    if (
      typeof booking_id !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(booking_id) ||
      !purposes.includes(purpose)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid booking ID or OTP purpose" },
        { status: 400 }
      );
    }

    // Confirm that the requester owns or provides this booking.
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

    // Prevent transport OTP purposes on storage bookings and vice versa.
    const isStoragePurpose = purpose.startsWith("storage_");

    if (
      (booking.service_type === "storage") !== isStoragePurpose
    ) {
      return NextResponse.json(
        { success: false, message: "OTP purpose does not match booking type" },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const otpHash = hashOTP(otp);

    const { error: insertError } = await supabaseAdmin
      .from("otp_verifications")
      .insert({
        booking_id,
        user_id: user.id,
        purpose,
        otp_hash: otpHash,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        attempts: 0,
        max_attempts: 5,
      });

    if (insertError) {
      console.error("OTP insert error:", insertError);

      return NextResponse.json(
        { success: false, message: "Could not generate OTP" },
        { status: 500 }
      );
    }

    // Prototype only: return OTP to the authorized requester.
    // A real deployment should deliver it to the intended recipient.
    return NextResponse.json({
      success: true,
      message: "OTP generated. Valid for 5 minutes.",
      otp,
      expires_in_seconds: 300,
    });

  } catch (error) {
    console.error("OTP generation error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
