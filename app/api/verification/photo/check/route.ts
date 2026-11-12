
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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
    const photoId = body.photo_id;

    if (
      typeof photoId !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(photoId)
    ) {
      return NextResponse.json(
        { success: false, message: "Valid photo ID required" },
        { status: 400 }
      );
    }

    const { data: photo, error } = await supabaseAdmin
      .from("photo_seals")
      .select("*")
      .eq("id", photoId)
      .maybeSingle();

    if (error || !photo) {
      return NextResponse.json(
        { success: false, message: "Photo record not found" },
        { status: 404 }
      );
    }

    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .select("user_id, provider_id")
      .eq("id", photo.booking_id)
      .maybeSingle();

    if (
      !booking ||
      (booking.user_id !== user.id && booking.provider_id !== user.id)
    ) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    const { data: file, error: downloadError } = await supabaseAdmin.storage
      .from("dropnest-photos")
      .download(photo.photo_path);

    if (downloadError || !file) {
      return NextResponse.json(
        { success: false, message: "Original photo unavailable" },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const currentHash = createHash("sha256")
      .update(buffer)
      .digest("hex");

    const integrityVerified = currentHash === photo.sha256_hash;

    return NextResponse.json({
      success: true,
      integrity_verified: integrityVerified,
      message: integrityVerified
        ? "Photo integrity verified. Original file matches its recorded hash."
        : "Photo integrity check failed. The file does not match its recorded hash.",
      photo_id: photo.id,
      original_hash: photo.sha256_hash,
      current_hash: currentHash,
    });

  } catch (error) {
    console.error("Photo verification error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
