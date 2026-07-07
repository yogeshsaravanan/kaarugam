import crypto from "crypto";
import type { GatewayOrder, PaymentGateway } from "./gateway";

export class RazorpayGateway implements PaymentGateway {
  live = true;
  constructor(private keyId: string, private keySecret: string, private webhookSecret: string) {}

  async createOrder(amountPaise: number, receipt: string): Promise<GatewayOrder> {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64"),
      },
      body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, payment_capture: 1 }),
    });
    if (!res.ok) throw new Error("Razorpay order creation failed");
    const order = await res.json();
    return { provider: "razorpay", gatewayOrderId: order.id, keyId: this.keyId };
  }

  verifyCheckoutSignature(gatewayOrderId: string, paymentId: string, signature: string): boolean {
    if (!(gatewayOrderId && paymentId && signature)) return false;
    const expected = crypto.createHmac("sha256", this.keySecret)
      .update(`${gatewayOrderId}|${paymentId}`).digest("hex");
    return safeEqual(expected, signature);
  }

  verifyWebhook(rawBody: string, signature: string | null): boolean {
    if (!(this.webhookSecret && signature)) return false;
    const expected = crypto.createHmac("sha256", this.webhookSecret).update(rawBody).digest("hex");
    return safeEqual(expected, signature);
  }
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a), bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}
