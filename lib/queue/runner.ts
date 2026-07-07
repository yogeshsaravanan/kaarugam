import { sendOrderConfirmation } from "@/lib/notify";
import { createShipment } from "@/lib/shipping";

export async function runJob(job: any): Promise<void> {
  switch (job.type) {
    case "order.confirmation": return void (await sendOrderConfirmation(job.orderId));
    case "shipment.create":    return void (await createShipment(job.orderId));
    default: console.warn("[queue] unknown job", job);
  }
}
