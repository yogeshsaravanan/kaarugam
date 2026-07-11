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
             Handwoven with love in Tamil Nadu — or coloured your own way in the design studio.
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
          <div style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: ZARI, marginBottom: 4 }}>Contact us</div>
          <a
            href="https://wa.me/7708788959?text=Hi%20Kaarugam%20Silks%2C%20I%27d%20like%20to%20know%20more%20about%20your%20sarees."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "start",
              background: "rgb(35, 169, 67)е55".replace("Ae", "A5"), color: "#37c86a",
              borderRadius: 4, padding: "8px 14px", fontSize: 12.5, fontWeight: 600,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#2ba154" aria-hidden="true">
              <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.53.07-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.35A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
            Chat on WhatsApp
          </a>
          {/* <div style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: ZARI, margin: "10px 0 0" }}>Payments</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["UPI", "Visa", "Mastercard", "RuPay", "COD"].map((m) => (
              <span key={m} style={{ border: `1px solid ${IVORY}33`, borderRadius: 3, padding: "3px 9px", fontSize: 10.5, letterSpacing: "0.08em", color: `${IVORY}B0` }}>{m}</span>
            ))}
          </div> */}
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
