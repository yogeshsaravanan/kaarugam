import { NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/auth/guards";
import { listAllOrders } from "@/lib/services/admin-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await listAllOrders());
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e instanceof AuthError ? e.status : 500 });
  }
}
