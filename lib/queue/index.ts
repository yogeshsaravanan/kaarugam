// Job queue seam. With QStash configured, jobs are published for async, retried
// processing. Without it, jobs run inline (dev) so nothing is lost locally.
type Job =
  | { type: "order.confirmation"; orderId: string }
  | { type: "shipment.create"; orderId: string };

const QSTASH_TOKEN = process.env.QSTASH_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";

export async function enqueue(job: Job): Promise<void> {
  if (QSTASH_TOKEN && APP_URL) {
    await fetch(`https://qstash.upstash.io/v2/publish/${APP_URL}/api/jobs`, {
      method: "POST",
      headers: { Authorization: `Bearer ${QSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(job),
    }).catch((e) => console.error("[queue] publish failed", e));
    return;
  }
  // Dev fallback: run inline so the flow completes end-to-end.
  const { runJob } = await import("./runner");
  await runJob(job).catch((e) => console.error("[queue] inline job failed", e));
}
