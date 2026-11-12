
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authentication token required" },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);
    const supabase = createSupabaseServerClient(token);

    // Verify the user's access token
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

    // Fetch the authenticated user's profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, services, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { success: false, message: "Could not fetch profile" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error("Profile API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
