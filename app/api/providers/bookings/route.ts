
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ==========================================
// GET: FETCH AVAILABLE PROVIDER REQUESTS
// ==========================================

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate provider
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
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 2. Get provider's services using authenticated client
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("services")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Provider profile error:", profileError);

      return NextResponse.json(
        { success: false, message: "Provider profile not found" },
        { status: 404 }
      );
    }

    const services: string[] = profile.services || [];

    if (services.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No provider services selected",
        count: 0,
        bookings: [],
      });
    }

    // 3. Fetch matching bookings using admin client.
    // The server has already authenticated the provider.
    // Explicit filters restrict results to eligible requests.

    const { data: bookings, error: bookingError } =
      await supabaseAdmin
        .from("bookings")
        .select(`
          *,
          transport_details (*),
          storage_details (*)
        `)
        .eq("status", "pending")
        .is("provider_id", null)
        .neq("user_id", user.id)
        .in("service_type", services)
        .order("created_at", { ascending: false });

    if (bookingError) {
      console.error("Provider booking retrieval error:", bookingError);

      return NextResponse.json(
        { success: false, message: "Could not retrieve booking requests" },
        { status: 500 }
      );
    }

    // 4. Get requests previously rejected by this provider
    const { data: rejected, error: rejectionError } =
      await supabaseAdmin
        .from("provider_booking_rejections")
        .select("booking_id")
        .eq("provider_id", user.id);

    if (rejectionError) {
      console.error("Rejection lookup error:", rejectionError);

      return NextResponse.json(
        { success: false, message: "Could not filter rejected requests" },
        { status: 500 }
      );
    }

    // 5. Remove previously rejected requests
    const rejectedIds = new Set(
      (rejected || []).map((item) => item.booking_id)
    );

    const availableBookings = (bookings || []).filter(
      (booking) => !rejectedIds.has(booking.id)
    );

    // 6. Return available requests
    return NextResponse.json({
      success: true,
      count: availableBookings.length,
      bookings: availableBookings,
    });

  } catch (error) {
    console.error("Provider bookings API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
