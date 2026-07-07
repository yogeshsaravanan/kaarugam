export interface GatewayOrder {
  provider: string;
  gatewayOrderId: string | null;
  keyId: string | null;
}

export interface PaymentGateway {
  live: boolean;
  createOrder(amountPaise: number, receipt: string): Promise<GatewayOrder>;
  verifyCheckoutSignature(gatewayOrderId: string, paymentId: string, signature: string): boolean;
  verifyWebhook(rawBody: string, signature: string | null): boolean;
}

import { MockGateway } from "./mock";
import { RazorpayGateway } from "./razorpay";

let _gw: PaymentGateway | null = null;
export function getGateway(): PaymentGateway {
  if (_gw) return _gw;
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  _gw = id && secret
    ? new RazorpayGateway(id, secret, process.env.RAZORPAY_WEBHOOK_SECRET || "")
    : new MockGateway();
  return _gw;
}
