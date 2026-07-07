// Rate-limit seam. Upstash when configured; allow-all in dev.
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;

export async function limit(_key: string): Promise<{ ok: boolean }> {
  if (!REDIS_URL) return { ok: true };
  // TODO: real Upstash Ratelimit sliding-window check.
  return { ok: true };
}
