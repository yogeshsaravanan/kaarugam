import { NextRequest, NextResponse } from "next/server";
import { checkout, DomainError } from "@/lib/services/order-service";
import { getSessionUser } from "@/lib/supabase/server";
import { checkoutSchema } from "@/lib/validation";
import { OutOfStockError } from "@/lib/repositories/product-repo";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const parsed = checkoutSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid request" }, { status: 400 });
    }
    const { items, customer, method } = parsed.data;
    const user = await getSessionUser();
    const guestId = req.headers.get("x-guest-id") || "anon";
    const result = await checkout(items as any, customer, method, user?.id ?? null, guestId);
    return NextResponse.json(result);
  } catch (e: any) {
    if (e instanceof OutOfStockError) return NextResponse.json({ error: "Sorry, an item just went out of stock." }, { status: 409 });
    const status = e instanceof DomainError ? e.status : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
