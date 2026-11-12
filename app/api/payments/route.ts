
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ==========================================
// POST: SIMULATE A BOOKING PAYMENT
// ==========================================

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
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 2. Validate booking ID
    const body = await request.json();
    const bookingId = body.booking_id;

    if (
      typeof bookingId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(bookingId)
    ) {
      return NextResponse.json(
        { success: false, message: "Valid booking ID required" },
        { status: 400 }
      );
    }

    // 3. Fetch booking from database
    const { data: booking, error: bookingError } =
      await supabaseAdmin
        .from("bookings")
        .select("id, user_id, amount, status")
        .eq("id", bookingId)
        .maybeSingle();

    if (bookingError) {
      console.error("Booking lookup error:", bookingError);

      return NextResponse.json(
        { success: false, message: "Could not retrieve booking" },
        { status: 500 }
      );
    }

    if (!booking || booking.user_id !== user.id) {
      return NextResponse.json(
        { success: false, message: "Booking not found or access denied" },
        { status: 403 }
      );
    }

    if (booking.status === "cancelled") {
      return NextResponse.json(
        { success: false, message: "Cannot pay for a cancelled booking" },
        { status: 400 }
      );
    }

    // 4. Get payment amount from database
    const amount = Number(booking.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Booking has no payable amount" },
        { status: 400 }
      );
    }

    // 5. Check for an existing successful payment
    const { data: existingPayment, error: lookupError } =
      await supabaseAdmin
        .from("transactions")
        .select("id, status")
        .eq("booking_id", bookingId)
        .eq("payer_id", user.id)
        .eq("transaction_type", "payment")
        .eq("status", "succeeded")
        .limit(1)
        .maybeSingle();

    if (lookupError) {
      console.error("Payment lookup error:", lookupError);

      return NextResponse.json(
        { success: false, message: "Could not check previous payments" },
        { status: 500 }
      );
    }

    if (existingPayment) {
      return NextResponse.json(
        {
          success: false,
          message: "A successful payment already exists",
          transaction_id: existingPayment.id,
        },
        { status: 409 }
      );
    }

    // 6. Create simulated payment
    // No real money is transferred.
    const { data: transaction, error: paymentError } =
      await supabaseAdmin
        .from("transactions")
        .insert({
          booking_id: bookingId,
          payer_id: user.id,
          transaction_type: "payment",
          amount,
          currency: "INR",
          status: "succeeded",
          payment_method: "prototype_demo",
          payment_provider: "DropNest Demo",
          provider_reference: `DEMO-${randomUUID()}`,
          idempotency_key: randomUUID(),
        })
        .select()
        .single();

    // 7. Handle duplicate payment constraint
    if (paymentError || !transaction) {
      console.error("Demo payment error:", paymentError);

      if (paymentError?.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            message: "A successful payment already exists for this booking",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, message: "Payment simulation failed" },
        { status: 500 }
      );
    }

    // 8. Return success
    return NextResponse.json(
      {
        success: true,
        demo: true,
        message: "Demo payment completed successfully. No real money was transferred.",
        transaction,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Payment API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}


// ==========================================
// GET: RETRIEVE USER TRANSACTION HISTORY
// ==========================================

export async function GET(request: NextRequest) {
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
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 2. Retrieve authenticated user's transactions
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("payer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Transaction history error:", error);

      return NextResponse.json(
        { success: false, message: "Could not retrieve transactions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: transactions.length,
      transactions,
    });

  } catch (error) {
    console.error("Payment GET error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
