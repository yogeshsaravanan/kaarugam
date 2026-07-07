import { NextRequest, NextResponse } from "next/server";
import { handleWebhook, DomainError } from "@/lib/services/order-service";

// Authoritative, server-to-server. Reads the RAW body for HMAC verification.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    return NextResponse.json(await handleWebhook(raw, signature));
  } catch (e: any) {
    const status = e instanceof DomainError ? e.status : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
