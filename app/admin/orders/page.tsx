"use client";
import { useEffect, useState } from "react";
import { outlineBtn } from "@/components/ui";
import { rupees } from "@/lib/money";
import { MAROON, GOLD, TEAL, INK } from "@/components/theme";

const STAGES = ["Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const load = () => fetch("/api/admin/orders").then((r) => r.json()).then((d) => setOrders(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);
  const advance = async (id: string) => { await fetch(`/api/orders/${id}/advance`, { method: "POST" }); load(); };

  return (
    <div>
      <div style={{ fontFamily: "Marcellus, serif", fontSize: 20, marginBottom: 14 }}>All orders</div>
      <div style={{ display: "grid", gap: 12 }}>
        {orders.length === 0 && <div style={{ fontSize: 14, opacity: 0.6 }}>No orders yet.</div>}
        {orders.map((o) => (
          <div key={o.id} style={{ border: `1px solid ${GOLD}33`, borderRadius: 12, padding: 14, background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{o.id}</span>
                <span style={{ fontSize: 12, opacity: 0.6, marginLeft: 8 }}>{o.customer_name || "—"} · {o.customer_phone || "—"}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: MAROON, fontWeight: 700 }}>{rupees(o.amount)}</span>
                <span style={{ fontSize: 11, marginLeft: 8, color: o.status === "paid" ? TEAL : "#B26B00" }}>{o.status}</span>
              </div>
            </div>
            <div style={{ fontSize: 12.5, opacity: 0.75, margin: "8px 0" }}>{o.items.map((i: any) => `${i.name} × ${i.qty}`).join(", ")}</div>
            {(o.status === "paid" || o.status === "confirmed") && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: INK }}>Stage: <b>{STAGES[o.stage]}</b></span>
                {o.stage < 4 && <button onClick={() => advance(o.id)} style={{ ...outlineBtn, padding: "5px 12px", fontSize: 12.5 }}>Mark {STAGES[o.stage + 1]}</button>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
