// Logistics seam (Shiprocket). Mock in dev; real calls when configured.
const SHIPROCKET_TOKEN = process.env.SHIPROCKET_TOKEN;

export async function checkServiceability(pincode: string): Promise<boolean> {
  if (!SHIPROCKET_TOKEN) return /^\d{6}$/.test(pincode); // demo: any valid 6-digit pincode
  // TODO: real serviceability API.
  return true;
}

export async function createShipment(orderId: string): Promise<{ awb: string | null }> {
  if (!SHIPROCKET_TOKEN) { console.log(`[shipping:mock] shipment for ${orderId}`); return { awb: null }; }
  // TODO: real Shiprocket create-order + AWB.
  return { awb: null };
}
