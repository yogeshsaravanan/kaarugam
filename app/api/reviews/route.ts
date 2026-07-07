import { NextRequest, NextResponse } from "next/server";
import { addReview } from "@/lib/services/catalog-service";
import { getSessionUser } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const parsed = reviewSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid review" }, { status: 400 });
    const { productId, name, rating, text } = parsed.data;
    const user = await getSessionUser();
    await addReview(productId, user?.id ?? null, name || user?.email?.split("@")[0] || "Guest", rating, text);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
