import { NextRequest, NextResponse } from "next/server";
import { verifyPayment, DomainError } from "@/lib/services/order-service";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await req.json();
    return NextResponse.json(await verifyPayment(orderId, paymentId, signature));
  } catch (e: any) {
    const status = e instanceof DomainError ? e.status : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
