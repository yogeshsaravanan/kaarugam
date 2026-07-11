import Link from "next/link";
import { INK, CHAMPAGNE, ZARI, IVORY } from "./theme";
import { CATEGORIES } from "@/lib/seed";

export default function Footer() {
  return (
    <footer style={{ background: "#180B05", color: `${IVORY}CC`, marginTop: 56 }}>
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${ZARI}88, transparent)` }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 20px 26px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 30 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 23, color: IVORY }}>
            Kaarugam <span style={{ color: ZARI }}>Silks</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: `${IVORY}99`, margin: "10px 0 0", maxWidth: 260 }}>
            Kanchipuram temple silks, handwoven with love in Tamil Nadu — or coloured your own way in the design studio.
          </p>
        </div>
        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: ZARI, marginBottom: 4 }}>Shop</div>
          <Link href="/" style={{ fontSize: 13, color: `${IVORY}B8` }}>All collections</Link>
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/category/${encodeURIComponent(c)}`} style={{ fontSize: 13, color: `${IVORY}B8` }}>{c}</Link>
          ))}
        </div>
        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: ZARI, marginBottom: 4 }}>Help</div>
          <Link href="/orders" style={{ fontSize: 13, color: `${IVORY}B8` }}>Track an order</Link>
          <Link href="/cart" style={{ fontSize: 13, color: `${IVORY}B8` }}>Cart</Link>
          <Link href="/login" style={{ fontSize: 13, color: `${IVORY}B8` }}>Account</Link>
        </div>
        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: ZARI, marginBottom: 4 }}>Payments</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["UPI", "Visa", "Mastercard", "RuPay", "COD"].map((m) => (
              <span key={m} style={{ border: `1px solid ${IVORY}33`, borderRadius: 3, padding: "3px 9px", fontSize: 10.5, letterSpacing: "0.08em", color: `${IVORY}B0` }}>{m}</span>
            ))}
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: CHAMPAGNE, margin: "12px 0 0" }}>
            Woven for the moments that matter.
          </p>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "0 20px 22px", fontSize: 10.5, letterSpacing: "0.1em", color: `${IVORY}55` }}>
        © 2026 Kaarugam Silks · Demo boutique — photo try-on coming soon
      </div>
    </footer>
  );
}
