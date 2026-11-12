
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function PATCH(request: NextRequest) {
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
    const { booking_id, status } = body;

    if (
      typeof booking_id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(booking_id)
    ) {
      return NextResponse.json(
        { success: false, message: "Valid booking ID required" },
        { status: 400 }
      );
    }

    if (!["in_progress", "completed"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc(
      "update_booking_status",
      {
        p_booking_id: booking_id,
        p_new_status: status,
      }
    );

    if (error) {
      console.error("Status update error:", error);

      return NextResponse.json(
        { success: false, message: "Could not update booking status" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking status updated",
      result: data,
    });

  } catch (error) {
    console.error("Status API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
