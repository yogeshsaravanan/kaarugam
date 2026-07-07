"use client";
// Client-side calls to our OWN Next API routes (not Supabase directly for writes).
function guestId(): string {
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem("guestId");
  if (!id) { id = "g_" + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("guestId", id); }
  return id;
}

async function req(path: string, opts: RequestInit = {}) {
  const res = await fetch("/api" + path, {
    ...opts,
    headers: { "Content-Type": "application/json", "x-guest-id": guestId(), ...(opts.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  checkout: (body: any) => req("/payments/checkout", { method: "POST", body: JSON.stringify(body) }),
  verify: (body: any) => req("/payments/verify", { method: "POST", body: JSON.stringify(body) }),
  orders: () => req("/orders"),
  advanceOrder: (id: string) => req(`/orders/${id}/advance`, { method: "POST" }),
  addReview: (body: any) => req("/reviews", { method: "POST", body: JSON.stringify(body) }),
};
