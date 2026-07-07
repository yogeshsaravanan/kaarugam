"use client";
import Link from "next/link";
import Image from "next/image"; // Ensure Next.js Image is imported
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { useAuth } from "./useAuth";
import { INK, PAPER, MAROON, GOLD } from "./theme";
import { outlineBtn } from "./ui";

export default function Nav() {
  const { count } = useCart();
  const { user, logout, enabled } = useAuth();
  const router = useRouter();

  // Define a shared logo dimension for a perfect circle
  const logoSize = 60; // Adjust as needed

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: PAPER, borderBottom: `1px solid ${GOLD}55` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        
        {/* Logo and Brand Name with circular container */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: INK }}>
          
          {/* 1. Add this wrapper div to create the circle */}
          <div style={{
            width: `${logoSize}px`,
            height: `${logoSize}px`,
            borderRadius: "50%", // This creates the circular mask
            overflow: "hidden", // Important: Clips the square image content to the circle
            display: "flex", // Centers the image inside the circle
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${MAROON}`, // Optional: Adds a matching border for definition
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)" // Optional: Adds a subtle shadow
          }}>
            <Image 
              src="/logo.png" // Path to your compressed logo in the public folder
              alt="Kaarugam Silks Logo"
              width={logoSize + 10} // Make the image slightly larger to ensure full coverage
              height={logoSize + 10}
              priority // For performance
              style={{ objectFit: "cover" }} // This crops the image to fill the container
            />
          </div>

          <span style={{ fontFamily: "Marcellus, serif", fontSize: 22, letterSpacing: 0.5 }}>
            Kaarugam <span style={{ color: MAROON }}>Silks</span>
          </span>
        </Link>

        <div className="nav-links" style={{ display: "flex", gap: 20, alignItems: "center" }}>
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