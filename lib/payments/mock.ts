import crypto from "crypto";
import type { GatewayOrder, PaymentGateway } from "./gateway";

// No keys required — the whole flow runs with no real charge.
export class MockGateway implements PaymentGateway {
  live = false;
  async createOrder(amountPaise: number, _receipt: string): Promise<GatewayOrder> {
    return { provider: "mock", gatewayOrderId: "mock_" + crypto.randomUUID(), keyId: null };
  }
  verifyCheckoutSignature(): boolean { return true; }
  verifyWebhook(): boolean { return true; }
}
