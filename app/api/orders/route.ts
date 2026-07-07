import { NextRequest, NextResponse } from "next/server";
import { listOrders } from "@/lib/services/order-service";
import { getSessionUser } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  const guestId = req.headers.get("x-guest-id") || "anon";
  const orders = await listOrders(user?.id ?? null, guestId);
  return NextResponse.json(orders);
}
