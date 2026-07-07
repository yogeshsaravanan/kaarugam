"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { outlineBtn } from "@/components/ui";
import { rupees } from "@/lib/money";
import type { Order } from "@/lib/types";
import { INK, MAROON, GOLD, TEAL } from "@/components/theme";

const STAGES = ["Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const load = () => api.orders().then(setOrders).catch((e) => setErr(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const advance = async (id: string) => { await api.advanceOrder(id); load(); };

  if (loading) return <div style={{ padding: 30, opacity: 0.6 }}>Loading orders…</div>;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "26px 18px" }}>
      <div style={{ fontFamily: "Marcellus, serif", fontSize: 26, marginBottom: 18 }}>Your orders</div>
      {err && <div style={{ color: MAROON, fontSize: 13, marginBottom: 12 }}>{err}</div>}
      {orders.length === 0 ? (
        <div style={{ fontSize: 14, opacity: 0.65 }}>No orders yet. <Link href="/" style={{ color: MAROON }}>Start shopping →</Link></div>
      ) : (
        <div style={{ display: "grid", gap: 18 }}>
          {orders.map((o) => {
            const paid = o.status === "paid";
            return (
              <div key={o.id} style={{ border: `1px solid ${GOLD}33`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{o.id}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>{o.created_at ? new Date(o.created_at).toLocaleString() : ""}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: MAROON }}>{rupees(o.amount)}</div>
                    <div style={{ fontSize: 11, color: paid ? TEAL : "#B26B00" }}>{paid ? "Paid" : o.status}</div>
                  </div>
                </div>
                {paid && (
                  <>
                    <div style={{ display: "flex", gap: 6, margin: "16px 0 8px" }}>
                      {STAGES.map((s, i) => (
                        <div key={s} style={{ flex: 1 }}>
                          <div style={{ height: 6, borderRadius: 4, background: i <= o.stage ? MAROON : "#EAE0CC" }} />
                          <div style={{ fontSize: 10, marginTop: 4, color: i <= o.stage ? INK : "#999", textAlign: "center" }}>{s}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 12.5, color: TEAL, marginBottom: 10 }}>
                      {o.stage < 4 ? `Current status: ${STAGES[o.stage]}` : "Delivered — thank you for shopping with us."}
                    </div>
                  </>
                )}
                <div style={{ fontSize: 12.5, opacity: 0.7, marginBottom: 10 }}>{o.items.map((it) => `${it.name} × ${it.qty}`).join(", ")}</div>
                {paid && o.stage < 4 && (
                  <button onClick={() => advance(o.id)} style={{ ...outlineBtn, padding: "7px 14px", fontSize: 12.5 }}>Simulate: mark as {STAGES[o.stage + 1]}</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
