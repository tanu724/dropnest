
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ==========================================
// AUTHENTICATE REQUEST
// ==========================================

async function authenticate(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return { user: null, error: "Authentication required" };
  }

  const token = authorization.substring(7);
  const supabase = createSupabaseServerClient(token);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: "Invalid or expired token" };
  }

  return { user, error: null };
}

// ==========================================
// POST: CREATE TRANSPORT OR STORAGE BOOKING
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticate(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: authError },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const {
      service_type,
      pickup_address,
      destination_address,
      booking_date,
      amount,
      notes,
      details,
    } = body;

    // Validate service
    if (!["transport", "storage"].includes(service_type)) {
      return NextResponse.json(
        { success: false, message: "Invalid service type" },
        { status: 400 }
      );
    }

    // Validate addresses
    if (
      typeof pickup_address !== "string" ||
      !pickup_address.trim() ||
      typeof destination_address !== "string" ||
      !destination_address.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Pickup and destination addresses are required",
        },
        { status: 400 }
      );
    }

    if (pickup_address.length > 500 || destination_address.length > 500) {
      return NextResponse.json(
        { success: false, message: "Address is too long" },
        { status: 400 }
      );
    }

    // Validate amount
    const bookingAmount = amount === undefined ? 0 : Number(amount);

    if (
      !Number.isFinite(bookingAmount) ||
      bookingAmount < 0 ||
      bookingAmount > 10000000
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid booking amount" },
        { status: 400 }
      );
    }

    // Validate date
    if (
      booking_date !== undefined &&
      booking_date !== null &&
      (typeof booking_date !== "string" ||
        Number.isNaN(Date.parse(booking_date)))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid booking date" },
        { status: 400 }
      );
    }

    // Validate notes
    if (
      notes !== undefined &&
      notes !== null &&
      typeof notes !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid notes" },
        { status: 400 }
      );
    }

    if (typeof notes === "string" && notes.length > 2000) {
      return NextResponse.json(
        { success: false, message: "Notes are too long" },
        { status: 400 }
      );
    }

    // Validate service details
    if (!details || typeof details !== "object" || Array.isArray(details)) {
      return NextResponse.json(
        { success: false, message: "Service details are required" },
        { status: 400 }
      );
    }

    // ==========================================
    // CREATE BOOKING USING SERVER ADMIN CLIENT
    // ==========================================

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert({
        user_id: user.id,
        service_type,
        pickup_address: pickup_address.trim(),
        destination_address: destination_address.trim(),
        booking_date: booking_date || null,
        amount: bookingAmount,
        notes: notes?.trim() || null,
        status: "pending",
        provider_id: null,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error("Booking creation error:", bookingError);

      return NextResponse.json(
        { success: false, message: "Could not create booking" },
        { status: 500 }
      );
    }

    // ==========================================
    // SAVE TRANSPORT DETAILS
    // ==========================================

    if (service_type === "transport") {
      const { error: detailsError } = await supabaseAdmin
        .from("transport_details")
        .insert({
          booking_id: booking.id,
          vehicle_type: details.vehicle_type || null,
          goods_description: details.goods_description || null,
          goods_weight: details.goods_weight ?? null,
          pickup_contact: details.pickup_contact || null,
          delivery_contact: details.delivery_contact || null,
        });

      if (detailsError) {
        console.error("Transport details error:", detailsError);

        // Admin client can remove the incomplete booking.
        const { error: cleanupError } = await supabaseAdmin
          .from("bookings")
          .delete()
          .eq("id", booking.id);

        if (cleanupError) {
          console.error("Booking cleanup error:", cleanupError);
        }

        return NextResponse.json(
          { success: false, message: "Could not save transport details" },
          { status: 500 }
        );
      }
    }

    // ==========================================
    // SAVE STORAGE DETAILS
    // ==========================================

    if (service_type === "storage") {
      const { error: detailsError } = await supabaseAdmin
        .from("storage_details")
        .insert({
          booking_id: booking.id,
          storage_location: details.storage_location || null,
          goods_description: details.goods_description || null,
          goods_weight: details.goods_weight ?? null,
          storage_start: details.storage_start || null,
          storage_end: details.storage_end || null,
          special_instructions: details.special_instructions || null,
        });

      if (detailsError) {
        console.error("Storage details error:", detailsError);

        const { error: cleanupError } = await supabaseAdmin
          .from("bookings")
          .delete()
          .eq("id", booking.id);

        if (cleanupError) {
          console.error("Booking cleanup error:", cleanupError);
        }

        return NextResponse.json(
          { success: false, message: "Could not save storage details" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking POST error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// ==========================================
// GET: RETRIEVE LOGGED-IN USER'S BOOKINGS
// ==========================================

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticate(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: authError },
        { status: 401 }
      );
    }

    // User-token client applies the user's RLS permissions.
    const token = request.headers.get("authorization")!.substring(7);
    const supabase = createSupabaseServerClient(token);

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        *,
        transport_details (*),
        storage_details (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Booking retrieval error:", error);

      return NextResponse.json(
        { success: false, message: "Could not retrieve bookings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: bookings?.length ?? 0,
      bookings: bookings ?? [],
    });
  } catch (error) {
    console.error("Booking GET error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
