import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/auth/guards";
import { createServiceClient } from "@/lib/supabase/server";
import { IMAGE_BUCKET } from "@/lib/storage";

export const runtime = "nodejs";

// Admin asks for a one-time signed upload URL. The browser then uploads the file
// DIRECTLY to Supabase Storage with the returned token — the file never passes
// through this serverless function.
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const sb = createServiceClient();
    if (!sb) return NextResponse.json({ error: "Storage not configured" }, { status: 503 });

    const { filename } = await req.json().catch(() => ({}));
    const ext = String(filename || "").split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
      return NextResponse.json({ error: "Only JPG, PNG or WebP allowed" }, { status: 400 });
    }
    const path = `products/${crypto.randomUUID()}.${ext}`;

    const { data, error } = await sb.storage.from(IMAGE_BUCKET).createSignedUploadUrl(path);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ path, token: data.token, bucket: IMAGE_BUCKET });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e instanceof AuthError ? e.status : 500 });
  }
}
