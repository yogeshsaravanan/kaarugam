// SMS/email seam. Mock logs in dev; wire Twilio/MSG91 + Resend when configured.
const SMS_KEY = process.env.SMS_API_KEY;

export async function sendSms(to: string, body: string): Promise<void> {
  if (!SMS_KEY) { console.log(`[sms:mock] → ${to}: ${body}`); return; }
  // TODO: real Twilio/MSG91 call here.
}

export async function sendOrderConfirmation(orderId: string): Promise<void> {
  // In real life: look up the order, format, send SMS + email.
  console.log(`[notify] confirmation for ${orderId}`);
}
