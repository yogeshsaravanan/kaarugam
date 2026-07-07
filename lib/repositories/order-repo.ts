import { createServiceClient } from "../supabase/server";
import type { Order } from "../types";

// All order writes go through the SERVICE ROLE client (bypasses RLS) — this is
// the server-only money path. Clients can never insert/update orders.
export async function createOrder(order: any, items: any[]): Promise<void> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Orders require Supabase (service role) to be configured.");
  const { error: e1 } = await sb.from("orders").insert(order);
  if (e1) throw new Error(e1.message);
  const { error: e2 } = await sb.from("order_items").insert(items);
  if (e2) throw new Error(e2.message);
}

export async function getOrder(id: string): Promise<any | null> {
  const sb = createServiceClient();
  if (!sb) return null;
  const { data } = await sb.from("orders").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function getOrderByPaymentRef(ref: string): Promise<any | null> {
  const sb = createServiceClient();
  if (!sb) return null;
  const { data } = await sb.from("orders").select("*").eq("payment_ref", ref).maybeSingle();
  return data ?? null;
}

export async function updateOrder(id: string, patch: Record<string, any>): Promise<void> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Supabase not configured.");
  const { error } = await sb.from("orders").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function markPaidIfUnpaid(ref: string, paymentId: string | null): Promise<void> {
  const sb = createServiceClient();
  if (!sb) return;
  // Idempotent: only flips a not-yet-paid order.
  await sb.from("orders").update({ status: "paid", payment_id: paymentId })
    .eq("payment_ref", ref).neq("status", "paid");
}

// Read a user's orders with items. Uses service role but filters by owner
// explicitly (the caller has already authenticated the user).
export async function listOrdersForOwner(userId: string | null, guestId: string): Promise<Order[]> {
  const sb = createServiceClient();
  if (!sb) return [];
  let q = sb.from("orders").select("*, order_items(*)");
  q = userId ? q.eq("user_id", userId) : q.eq("guest_id", guestId);
  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((o: any) => ({
    id: o.id, amount: o.amount, currency: o.currency, status: o.status,
    stage: o.stage, provider: o.provider, created_at: o.created_at,
    items: (o.order_items ?? []).map((i: any) => ({
      product_id: i.product_id, name: i.name, price: i.price, qty: i.qty,
      design: i.design ?? null,
    })),
  }));
}

export async function listAllOrders(): Promise<any[]> {
  const sb = createServiceClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((o: any) => ({
    id: o.id, amount: o.amount, currency: o.currency, status: o.status, stage: o.stage,
    provider: o.provider, created_at: o.created_at,
    customer_name: o.customer_name, customer_phone: o.customer_phone, address: o.address,
    items: (o.order_items ?? []).map((i: any) => ({
      product_id: i.product_id, name: i.name, price: i.price, qty: i.qty, design: i.design ?? null,
    })),
  }));
}
