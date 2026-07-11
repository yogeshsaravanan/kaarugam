"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/useAuth";
import { api } from "@/lib/api";
import { solidBtn, input, PageHeading } from "@/components/ui";
import RazorpayScript from "@/components/RazorpayScript";
import { rupees } from "@/lib/money";
import { INK, MAROON, ZARI } from "@/components/theme";

const label: React.CSSProperties = {
  fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "#A87B22", margin: "18px 0 10px",
};

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user, ready, enabled } = useAuth();
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

  // Orders require an account (issue #1): gate checkout behind sign-in when auth is enabled.
  if (enabled && ready && !user) {
    return (
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "40px 18px" }}>
        <PageHeading eyebrow="Almost there" title="Sign in to continue" />
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#5A4632" }}>
          Orders are tied to your account so you can track them anywhere.
          Your cart is saved — sign in or create an account to place the order.
        </p>
        <Link href="/login">
          <button style={{ ...solidBtn, width: "100%", marginTop: 14 }}>Sign in / Create account</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: "26px 18px" }}>
      <RazorpayScript />
      <PageHeading eyebrow="Secure checkout" title="Checkout" />

      <div className="checkout-layout">
        {/* left: contact / address / payment */}
        <div>
          <div style={label}>Contact information</div>
          <div style={{ display: "grid", gap: 10 }}>
            <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={input} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={input} />
              <input placeholder="Email (for receipt)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={input} />
            </div>
          </div>

          <div style={label}>Delivery address</div>
          <textarea placeholder="Full address with pincode" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ ...input, resize: "vertical" }} />

          <div style={label}>Payment method</div>
          <div style={{ display: "grid", gap: 8 }}>
            {[["online", "Pay online", "UPI / Card / Netbanking"], ["cod", "Cash on delivery", "Pay when it arrives"]].map(([k, title, sub]) => (
              <label key={k} style={{
                display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                border: `1px solid ${method === k ? MAROON : "#DCCBA8"}`,
                background: method === k ? "#FBF1E9" : "#FFFDF8", borderRadius: 4, padding: "12px 14px",
              }}>
                <input type="radio" checked={method === k} onChange={() => setMethod(k)} />
                <span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: INK, display: "block" }}>{title}</span>
                  <span style={{ fontSize: 11.5, color: "#7A6A52" }}>{sub}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* right: order summary card */}
        <div style={{ border: `1px solid ${ZARI}44`, background: "#FDF9F1", borderRadius: 6, padding: "20px 20px 18px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 21, color: INK, marginBottom: 14 }}>Order summary</div>
          {items.map((c) => (
            <div key={c.lineId} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, padding: "7px 0", borderBottom: `1px solid ${ZARI}22` }}>
              <span style={{ color: "#3D2A18" }}>{c.name} × {c.qty}</span>
              <span style={{ whiteSpace: "nowrap" }}>{rupees(c.price * c.qty)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "10px 0 2px", color: "#7A6A52" }}>
            <span>Shipping</span><span>Free above ₹10,000</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16.5, fontWeight: 700, color: INK, padding: "12px 0 4px", borderTop: `1px solid ${ZARI}44`, marginTop: 10 }}>
            <span>Total</span><span>{rupees(total)}</span>
          </div>
          {err && <div style={{ color: MAROON, fontSize: 13, margin: "8px 0" }}>{err}</div>}
          <button disabled={!canPay || busy} onClick={pay} style={{ ...solidBtn, width: "100%", marginTop: 12, opacity: canPay && !busy ? 1 : 0.5 }}>
            {busy ? "Processing…" : method === "cod" ? `Place order · ${rupees(total)}` : `Pay ${rupees(total)}`}
          </button>
          <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8A6E3A", textAlign: "center", marginTop: 12 }}>
            Amount verified on our servers · Secure payment
          </div>
        </div>
      </div>
    </div>
  );
}
