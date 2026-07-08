import Link from "next/link";
import { INK, PAPER, MAROON, GOLD, TEAL } from "./theme";

export default function Footer() {
  const linkStyle = { color: `${INK}CC`, fontSize: 13.5, textDecoration: "none", display: "block", marginBottom: 8 };
  
  return (
    <footer style={{ background: INK, color: `${PAPER}CC`, padding: "50px 20px 30px", marginTop: 60 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
        
        {/* Brand Column */}
        <div>
          <div style={{ fontFamily: "Marcellus, serif", fontSize: 22, color: PAPER, marginBottom: 12 }}>
            Kaarugam <span style={{ color: GOLD }}>Silks</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 280 }}>
            Bringing the timeless heritage of Kanchipuram temple silks directly to your doorstep. Handwoven with love in Tamil Nadu.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.1, color: GOLD, marginBottom: 16 }}>Shop</div>
          <Link href="/" style={linkStyle}>All Sarees</Link>
          <Link href="/category/Marriage" style={linkStyle}>Bridal Collection</Link>
          <Link href="/category/Traditional" style={linkStyle}>Traditional Silks</Link>
        </div>

        {/* Policies */}
        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.1, color: GOLD, marginBottom: 16 }}>Help & Policies</div>
          <Link href="/orders" style={linkStyle}>Track Order</Link>
          <div style={linkStyle}>Return Policy</div>
          <div style={linkStyle}>Shipping Information</div>
          <div style={linkStyle}>Privacy Policy</div>
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.1, color: GOLD, marginBottom: 16 }}>Contact Us</div>
          <div style={{ fontSize: 13, marginBottom: 10 }}>Need help choosing the perfect weave?</div>
          <a 
            href="https://wa.me/7708788959"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 8, 
              background: TEAL, 
              color: "#fff", 
              padding: "10px 16px", 
              borderRadius: 6, 
              fontSize: 13, 
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            💬 Chat on WhatsApp
          </a>
        </div>

      </div>

      {/* Copyright */}
      <div style={{ maxWidth: 1100, margin: "40px auto 0", paddingTop: 20, borderTop: `1px solid #ffffff15`, textAlign: "center", fontSize: 12, color: "#ffffff66" }}>
        © {new Date().getFullYear()} Kaarugam Silks. All rights reserved.
      </div>
    </footer>
  );
}