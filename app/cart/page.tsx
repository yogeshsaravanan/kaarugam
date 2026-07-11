"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SareeFigure from "@/components/SareeFigure";
import { useCart } from "@/components/CartContext";
import { solidBtn, PageHeading } from "@/components/ui";
import { rupees } from "@/lib/money";
import { INK, PAPER2, MAROON, GOLD } from "@/components/theme";

export default function CartPage() {
  const { items, setQty, remove, total } = useCart();
  const router = useRouter();
  const qtyBtn: React.CSSProperties = { width: 26, height: 26, borderRadius: 6, border: "1px solid #D8CBB0", background: "#fff", cursor: "pointer" };
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "26px 18px" }}>
      <PageHeading eyebrow="Your selection" title="Cart" />
      {items.length === 0 ? (
        <div style={{ fontSize: 14, opacity: 0.65 }}>Nothing here yet. <Link href="/" style={{ color: MAROON, textDecoration: "underline" }}>Explore the collection</Link> to find your silk.</div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 14 }}>
            {items.map((c) => (
              <div key={c.lineId} className="cart-line" style={{ border: `1px solid ${GOLD}33`, borderRadius: 12, padding: 12 }}>
                <div style={{ background: PAPER2, borderRadius: 8 }}><SareeFigure design={c.design} showFigure={false} height={100} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: MAROON, marginTop: 4 }}>{rupees(c.price)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                    <button onClick={() => setQty(c.lineId, -1)} style={qtyBtn}>−</button>
                    <span style={{ fontSize: 13 }}>{c.qty}</span>
                    <button onClick={() => setQty(c.lineId, 1)} style={qtyBtn}>+</button>
                    <span onClick={() => remove(c.lineId)} style={{ marginLeft: 12, fontSize: 12, color: MAROON, cursor: "pointer", textDecoration: "underline" }}>Remove</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontSize: 16, fontWeight: 600 }}>
            <span>Total</span><span>{rupees(total)}</span>
          </div>
          <button onClick={() => router.push("/checkout")} style={{ ...solidBtn, width: "100%", marginTop: 16 }}>Proceed to checkout</button>
        </>
      )}
    </div>
  );
}
