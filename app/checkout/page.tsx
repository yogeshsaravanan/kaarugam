"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { api } from "@/lib/api";
import { solidBtn, input } from "@/components/ui";
import RazorpayScript from "@/components/RazorpayScript";
import { rupees } from "@/lib/money";
import { INK, GOLD, MAROON, TEAL, PAPER } from "@/components/theme";

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
      <div style={{ fontFamily: "Marcellus, serif", fontSize: 28, marginBottom: 30 }}>Checkout</div>
      
      {/* Added className="checkout-grid" here */}
      <div className="checkout-grid" style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        
        {/* Left Column: Form */}
        <div className="checkout-form-col" style={{ flex: 1 }}>
          <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: INK, marginBottom: 6, display: "block" }}>Full Name *</label>
              <input placeholder="As on ID" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={input} />
      </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: INK, marginBottom: 6, display: "block" }}>Phone Number *</label>
              <input placeholder="10-digit number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={input} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: INK, marginBottom: 6, display: "block" }}>Email (for receipt)</label>
              <input placeholder="optional" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={input} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: INK, marginBottom: 6, display: "block" }}>Delivery Address *</label>
              <textarea placeholder="Full address with Pincode" rows={4} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ ...input, resize: "vertical" }} />
            </div>
          </div>
          
          <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 10 }}>Payment method</div>
          <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${method === "online" ? MAROON : "#D8CBB0"}`, borderRadius: 8, padding: "14px", cursor: "pointer", background: method === "online" ? `${MAROON}08` : "transparent" }}>
              <input type="radio" checked={method === "online"} onChange={() => setMethod("online")} />
              <div>
                <div style={{ fontSize: 14, color: INK }}>Pay online (UPI / Card / Netbanking)</div>
                <div style={{ fontSize: 11, color: TEAL, marginTop: 2 }}>Secure & instant confirmation</div>
              </div>
            </label>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, border: `1px solid ${method === "cod" ? MAROON : "#D8CBB0"}`, borderRadius: 8, padding: "14px", cursor: "pointer", background: method === "cod" ? `${MAROON}08` : "transparent" }}>
              <input type="radio" checked={method === "cod"} onChange={() => setMethod("cod")} style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 14, color: INK }}>Cash on delivery</div>
                {/* <div style={{ fontSize: 11, color: "#B45309", marginTop: 2 }}>Note: COD orders may require phone verification. ₹500 extra fee applies for orders above ₹10,000.</div> */}
              </div>
          </label>
          </div>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="checkout-summary-col" style={{ width: 340, flexShrink: 0, position: "sticky", top: 90, background: PAPER, border: `1px solid ${GOLD}33`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontFamily: "Marcellus, serif", fontSize: 18, marginBottom: 16, color: INK }}>Order Summary</div>
          
          <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16 }}>
            {items.map((c) => (
              <div key={c.lineId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${GOLD}15` }}>
                <div style={{ paddingRight: 10 }}>
                  <div style={{ fontWeight: 500, color: INK }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Qty: {c.qty}</div>
                </div>
                <div style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{rupees(c.price * c.qty)}</div>
              </div>
        ))}
      </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, marginTop: 10, paddingTop: 12, borderTop: `2px solid ${INK}15` }}>
            <span>Total</span>
            <span style={{ color: MAROON }}>{rupees(total)}</span>
          </div>

          {err && <div style={{ color: MAROON, fontSize: 12, marginTop: 14, background: `${MAROON}10`, padding: 10, borderRadius: 6 }}>{err}</div>}
          
          <button disabled={!canPay || busy} onClick={pay} style={{ ...solidBtn, width: "100%", marginTop: 18, padding: "14px", fontSize: 14, opacity: canPay && !busy ? 1 : 0.5 }}>
            {busy ? "Processing…" : method === "cod" ? `Place COD Order` : `Pay ${rupees(total)}`}
          </button>
          <div style={{ fontSize: 10, color: "#888", marginTop: 10, textAlign: "center" }}>Amount is verified securely on our servers.</div>
        </div>

      </div>

      {/* MAGIC HAPPENS HERE: Next.js scoped responsive styles */}
      <style jsx>{`
        @media (max-width: 760px) {
          .checkout-grid {
            flex-direction: column !important;
            gap: 24px !important;
          }
          .checkout-summary-col {
            width: 100% !important;
            position: relative !important; /* Unsticks it on mobile so it flows naturally */
            top: auto !important;
            order: -1; /* Moves summary to the TOP on mobile (better UX) */
          }
        }
      `}</style>
    </div>
  );
}
