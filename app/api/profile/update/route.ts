
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
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { full_name, phone, services } = body;

    const updates: {
      updated_at: string;
      full_name?: string;
      phone?: string | null;
      services?: string[];
    } = {
      updated_at: new Date().toISOString(),
    };

    if (full_name !== undefined) {
      if (
        typeof full_name !== "string" ||
        full_name.trim().length < 2 ||
        full_name.trim().length > 100
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid full name" },
          { status: 400 }
        );
      }

      updates.full_name = full_name.trim();
    }

    if (phone !== undefined) {
      if (
        phone !== null &&
        (typeof phone !== "string" || phone.length > 20)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid phone number" },
          { status: 400 }
        );
      }

      updates.phone = phone;
    }

    if (services !== undefined) {
      if (
        !Array.isArray(services) ||
        !services.every(
          (service) => ["transport", "storage"].includes(service)
        ) ||
        new Set(services).size !== services.length
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid services selection" },
          { status: 400 }
        );
      }

      updates.services = services;
    }

    if (Object.keys(updates).length === 1) {
      return NextResponse.json(
        { success: false, message: "No profile updates provided" },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select("id, full_name, email, phone, services, updated_at")
      .single();

    if (error) {
      console.error("Profile update error:", error);

      return NextResponse.json(
        { success: false, message: "Could not update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });

  } catch (error) {
    console.error("Profile update API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
