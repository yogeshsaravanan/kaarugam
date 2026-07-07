"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { api } from "@/lib/api";
import { solidBtn, input } from "@/components/ui";
import RazorpayScript from "@/components/RazorpayScript";
import { rupees } from "@/lib/money";
import { INK, GOLD, MAROON, TEAL } from "@/components/theme";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [method, setMethod] = useState("online");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const canPay = form.name.trim() && form.phone.trim() && form.address.trim() && items.length > 0;

  async function finish(orderId: string, paymentId: string, signature: string) {
    await api.verify({ orderId, paymentId, signature });
    clear(); router.push("/orders");
  }

  async function pay() {
    setErr(""); setBusy(true);
    try {
      const order = await api.checkout({ items: items.map((i) => ({ productId: i.productId, qty: i.qty, design: i.design })), customer: form, method });
      if (order.cod) { clear(); router.push("/orders"); return; }
      if (order.provider === "razorpay" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay({
          key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.gatewayOrderId,
          name: "Kaarugam Silks", description: order.orderId, prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: MAROON },
          handler: (r: any) => finish(order.orderId, r.razorpay_payment_id, r.razorpay_signature).catch((e) => setErr(e.message)),
          modal: { ondismiss: () => setBusy(false) },
        });
        rzp.open(); return;
      }
      await finish(order.orderId, "mock_pay", "mock_sig");
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "26px 18px" }}>
      <RazorpayScript />
      <div style={{ fontFamily: "Marcellus, serif", fontSize: 26, marginBottom: 18 }}>Checkout</div>
      <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={input} />
        <input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={input} />
        <input placeholder="Email (for receipt)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={input} />
        <textarea placeholder="Delivery address" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ ...input, resize: "vertical" }} />
      </div>
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>Payment method</div>
      <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        {[["online", "Pay online (UPI / Card / Netbanking)"], ["cod", "Cash on delivery"]].map(([k, label]) => (
          <label key={k} style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${method === k ? MAROON : "#D8CBB0"}`, borderRadius: 8, padding: "10px 12px", cursor: "pointer" }}>
            <input type="radio" checked={method === k} onChange={() => setMethod(k)} /><span style={{ fontSize: 13.5 }}>{label}</span>
          </label>
        ))}
      </div>
      <div style={{ border: `1px solid ${GOLD}33`, borderRadius: 10, padding: 14, marginBottom: 20 }}>
        {items.map((c) => (
          <div key={c.lineId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
            <span>{c.name} × {c.qty}</span><span>{rupees(c.price * c.qty)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, marginTop: 8 }}><span>Total</span><span>{rupees(total)}</span></div>
      </div>
      {err && <div style={{ color: MAROON, fontSize: 13, marginBottom: 10 }}>{err}</div>}
      <button disabled={!canPay || busy} onClick={pay} style={{ ...solidBtn, width: "100%", opacity: canPay && !busy ? 1 : 0.5 }}>
        {busy ? "Processing…" : method === "cod" ? `Place order · ${rupees(total)}` : `Pay ${rupees(total)}`}
      </button>
      <div style={{ fontSize: 11, color: TEAL, marginTop: 10, textAlign: "center" }}>Amount is verified on the server. In mock mode no real charge is made.</div>
    </div>
  );
}
