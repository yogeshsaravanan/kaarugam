"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { useAuth } from "./useAuth";
import { INK, PAPER, MAROON, GOLD } from "./theme";
import { outlineBtn } from "./ui";

export default function Nav() {
  const { count } = useCart();
  const { user, logout, enabled } = useAuth();
  const router = useRouter();
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: PAPER, borderBottom: `1px solid ${GOLD}55` }}>
      {/* <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}> */}

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 16px", display: "flex",
         alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <Link href="/" style={{ fontFamily: "Marcellus, serif", fontSize: 22, letterSpacing: 0.5, color: INK }}>
          Tanjai <span style={{ color: MAROON }}>Silks</span>
        </Link>
        {/* <div style={{ display: "flex", gap: 20, alignItems: "center" }}> */}
        <div className="nav-links">
          <Link href="/" style={{ fontSize: 14, color: INK }}>Shop</Link>
          <Link href="/orders" style={{ fontSize: 14, color: INK }}>Orders</Link>
          <Link href="/cart" style={{ fontSize: 14, color: INK }}>
            Cart{count > 0 && <span style={{ marginLeft: 5, background: MAROON, color: PAPER, borderRadius: 20, fontSize: 10, padding: "1px 6px" }}>{count}</span>}
          </Link>
          {enabled && (user ? (
            <button onClick={async () => { await logout(); router.push("/"); }} style={{ ...outlineBtn, padding: "6px 12px", fontSize: 12.5 }}>Log out</button>
          ) : (
            <Link href="/login" style={{ fontSize: 14, color: MAROON }}>Log in</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
