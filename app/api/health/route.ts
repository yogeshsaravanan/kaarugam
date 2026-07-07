import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { getGateway } from "@/lib/payments/gateway";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    supabase: hasSupabase ? "configured" : "demo-mode",
    paymentMode: getGateway().live ? "razorpay" : "mock",
  });
}
