
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const bookingId = body.booking_id;

    if (
      typeof bookingId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookingId)
    ) {
      return NextResponse.json(
        { success: false, message: "Valid booking ID is required" },
        { status: 400 }
      );
    }

    // Database function atomically assigns the provider
    const { data, error } = await supabase.rpc(
      "accept_booking",
      { p_booking_id: bookingId }
    );

    if (error) {
      console.error("Booking acceptance error:", error);

      return NextResponse.json(
        { success: false, message: "Booking unavailable or acceptance failed" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking accepted successfully",
      result: data,
    });

  } catch (error) {
    console.error("Accept API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
