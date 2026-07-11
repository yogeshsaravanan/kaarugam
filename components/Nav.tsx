"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { useAuth } from "./useAuth";
import { INK, IVORY, MAROON, ZARI } from "./theme";

const LOGO_SIZE = 44;

export default function Nav() {
  const { count } = useCart();
  const { user, logout, enabled } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const link = (href: string, label: string, badge?: number) => {
    const active = path === href;
    return (
      <Link href={href} style={{
        fontSize: 13.5, letterSpacing: "0.02em",
        color: active ? MAROON : INK, fontWeight: active ? 600 : 500,
        paddingBottom: 3, borderBottom: active ? `1px solid ${ZARI}` : "1px solid transparent",
      }}>
        {label}
        {badge ? (
          <span style={{ marginLeft: 6, background: MAROON, color: IVORY, borderRadius: 20, fontSize: 9.5, padding: "1px 6px", letterSpacing: 0 }}>{badge}</span>
        ) : null}
      </Link>
    );
  };

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
      {/* announcement bar */}
      {/* <div style={{ background: MAROON, color: IVORY, textAlign: "center", fontSize: 11.5, letterSpacing: "0.06em", padding: "7px 12px" }}>
        Free shipping on all orders above ₹10,000
      </div> */}

      {/* main bar */}
      <div style={{ background: IVORY, borderBottom: `1px solid ${ZARI}44` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>

          {/* logo + wordmark */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: INK }}>
            <div style={{
              width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: "50%", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1.5px solid ${ZARI}`, flex: "0 0 auto",
            }}>
              <Image
                src="/logo.png"
                alt="Kaarugam Silks"
                width={LOGO_SIZE + 8}
                height={LOGO_SIZE + 8}
                priority
                style={{ objectFit: "cover" }}
              />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 24, letterSpacing: "0.06em" }}>
              Kaarugam <span style={{ color: MAROON }}>Silks</span>
            </span>
          </Link>

          {/* links */}
          <div className="nav-links">
            {link("/", "Shop")}
            {link("/orders", "Orders")}
            {link("/cart", "Cart", count)}
            {enabled && (user ? (
              <button onClick={async () => { await logout(); router.push("/"); }}
                style={{ background: "transparent", border: `1px solid ${MAROON}55`, borderRadius: 3, color: MAROON, padding: "6px 12px", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>
                Log out
              </button>
            ) : link("/login", "Log in"))}
          </div>
        </div>
      </div>
    </div>
  );
}