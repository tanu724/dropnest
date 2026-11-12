
import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const allowedPhotoTypes = [
  "before",
  "during",
  "after",
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

    // 2. Read multipart form data
    const formData = await request.formData();

    const bookingId = formData.get("booking_id");
    const photoType = formData.get("photo_type");
    const file = formData.get("photo");

    if (
      typeof bookingId !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(bookingId) ||
      typeof photoType !== "string" ||
      !allowedPhotoTypes.includes(photoType) ||
      !(file instanceof File)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid upload details" },
        { status: 400 }
      );
    }

    // 3. Validate image
    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024 || file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Upload a non-empty JPEG, PNG or WebP image under 5 MB",
        },
        { status: 400 }
      );
    }

    // 4. Check booking ownership or provider assignment
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("id, user_id, provider_id")
      .eq("id", bookingId)
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

    // 5. Calculate SHA-256 from actual file bytes
    const buffer = Buffer.from(await file.arrayBuffer());

    const sha256Hash = createHash("sha256")
      .update(buffer)
      .digest("hex");

    // 6. Upload to private Supabase Storage
    const extension = file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : "webp";

    const filePath = `${bookingId}/${user.id}/${randomUUID()}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("dropnest-photos")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Photo upload error:", uploadError);

      return NextResponse.json(
        { success: false, message: "Could not upload photo" },
        { status: 500 }
      );
    }

    // 7. Save photo metadata and hash
    const { data: photo, error: insertError } = await supabaseAdmin
      .from("photo_seals")
      .insert({
        booking_id: bookingId,
        uploaded_by: user.id,
        photo_path: filePath,
        sha256_hash: sha256Hash,
        photo_type: photoType,
      })
      .select("id, booking_id, photo_type, created_at")
      .single();

    if (insertError || !photo) {
      console.error("Photo metadata error:", insertError);

      await supabaseAdmin.storage
        .from("dropnest-photos")
        .remove([filePath]);

      return NextResponse.json(
        { success: false, message: "Could not save photo verification record" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Photo uploaded and sealed successfully",
        photo,
        sha256_hash: sha256Hash,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Photo upload API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
