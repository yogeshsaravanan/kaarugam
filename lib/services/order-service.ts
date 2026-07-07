import crypto from "crypto";
import * as orderRepo from "../repositories/order-repo";
import { getProduct, reserveStock, releaseStock } from "../repositories/product-repo";
import { getGateway } from "../payments/gateway";
import { enqueue } from "../queue";

export const STAGES = ["Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];

export class DomainError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

interface CartItemIn { productId: string; qty: number; design?: any }
interface Customer { name?: string; phone?: string; email?: string; address?: string }

// AUTHORITATIVE pricing — the client's amount is never trusted.
async function priceCart(items: CartItemIn[]) {
  if (!items?.length) throw new DomainError("Empty cart");
  let amount = 0;
  const priced: { p: any; qty: number; design: any }[] = [];
  for (const it of items) {
    const p = await getProduct(it.productId);
    if (!p) throw new DomainError(`Unknown product ${it.productId}`);
    const qty = Math.max(1, Math.min(10, Number(it.qty) || 1));
    amount += p.price * qty;
    priced.push({ p, qty, design: it.design ?? null });
  }
  return { amount, priced };
}

export async function checkout(
  items: CartItemIn[],
  customer: Customer,
  method: string,
  userId: string | null,
  guestId: string
) {
  const { amount, priced } = await priceCart(items);
  const orderId = "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  const cod = method === "cod";

  // Reserve inventory atomically FIRST — rolls back entirely if any line is short,
  // so two buyers can't take the last piece.
  const stockItems = priced.map(({ p, qty }) => ({ productId: p.id, qty }));
  await reserveStock(stockItems);

  const gateway = getGateway();
  let provider = "cod", gatewayOrderId: string | null = null, keyId: string | null = null;
  try {
    if (!cod) {
      const gw = await gateway.createOrder(amount, orderId);
      provider = gw.provider; gatewayOrderId = gw.gatewayOrderId; keyId = gw.keyId;
    }
  } catch (e) {
    await releaseStock(stockItems); // don't hold stock if gateway failed
    throw e;
  }

  await orderRepo.createOrder(
    {
      id: orderId, user_id: userId, guest_id: guestId, amount, currency: "INR",
      status: cod ? "confirmed" : "created", stage: 0,
      payment_ref: gatewayOrderId, provider,
      customer_name: customer.name ?? null, customer_phone: customer.phone ?? null,
      customer_email: customer.email ?? null, address: customer.address ?? null,
    },
    priced.map(({ p, qty, design }) => ({
      order_id: orderId, product_id: p.id, name: p.name, price: p.price, qty, design,
    }))
  );

  if (cod) {
    // COD is placed immediately (unpaid) — start fulfilment now.
    await enqueue({ type: "order.confirmation", orderId });
    await enqueue({ type: "shipment.create", orderId });
  }

  return { orderId, amount, currency: "INR", provider, gatewayOrderId, keyId, live: gateway.live, cod };
}

// Release the stock held by an order's line items (used on payment failure).
async function releaseReserved(orderId: string) {
  const order = await orderRepo.getOrder(orderId);
  if (!order) return;
  const sb = (await import("../supabase/server")).createServiceClient();
  if (!sb) return;
  const { data } = await sb.from("order_items").select("product_id, qty").eq("order_id", orderId);
  await releaseStock((data ?? []).map((i: any) => ({ productId: i.product_id, qty: i.qty })));
}

export async function verifyPayment(orderId: string, paymentId: string | null, signature: string | null) {
  const order = await orderRepo.getOrder(orderId);
  if (!order) throw new DomainError("Order not found", 404);
  const gateway = getGateway();
  const ok =
    order.provider === "mock" ||
    gateway.verifyCheckoutSignature(order.payment_ref ?? "", paymentId ?? "", signature ?? "");
  if (!ok) {
    await orderRepo.updateOrder(orderId, { status: "failed" });
    await releaseReserved(orderId); // give the held stock back
    throw new DomainError("Signature verification failed");
  }
  await orderRepo.updateOrder(orderId, { status: "paid", stage: 0, payment_id: paymentId ?? "mock_pay" });
  await enqueue({ type: "order.confirmation", orderId });
  await enqueue({ type: "shipment.create", orderId });
  return { ok: true, orderId, status: "paid" };
}

export async function handleWebhook(rawBody: string, signature: string | null) {
  const gateway = getGateway();
  if (!gateway.verifyWebhook(rawBody, signature)) throw new DomainError("Invalid webhook signature");
  const event = JSON.parse(rawBody);
  if (event.event === "payment.captured") {
    const entity = event?.payload?.payment?.entity ?? {};
    if (entity.order_id) await orderRepo.markPaidIfUnpaid(entity.order_id, entity.id ?? null);
  }
  return { received: true };
}

export const listOrders = orderRepo.listOrdersForOwner;

export async function advance(orderId: string) {
  const order = await orderRepo.getOrder(orderId);
  if (!order) throw new DomainError("Order not found", 404);
  if (!["paid", "confirmed"].includes(order.status)) throw new DomainError("Order not confirmed");
  const stage = Math.min(4, order.stage + 1);
  await orderRepo.updateOrder(orderId, { stage });
  return { ok: true, stage, label: STAGES[stage] };
}
