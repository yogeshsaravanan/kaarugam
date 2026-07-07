import { NextRequest, NextResponse } from "next/server";
import { advance, DomainError } from "@/lib/services/order-service";

export const runtime = "nodejs";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json(await advance(params.id));
  } catch (e: any) {
    const status = e instanceof DomainError ? e.status : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
