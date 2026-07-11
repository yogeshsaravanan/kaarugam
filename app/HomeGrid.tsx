"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/types";
import { rupees } from "@/lib/money";
import { CATEGORIES } from "@/lib/seed";
import { INK, PAPER, MAROON } from "@/components/theme";

const serif = "'Cormorant Garamond', 'EB Garamond', serif";
const GOLD_TXT = "#E0C070";
const GOLD_SOLID = "#C9A227";
const GOLD_LINE = "#D8B55D";
const CREAM = "#FFF5E0";
const MUTED = "#C9BBA8";
const ZARI = "#C9A227";

const TRUST = [
  {
    title: "Pure Silk", sub: "100% Certified",
    icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: "Handwoven Heritage", sub: "Zari Borders",
    icon: <><path d="M12 2L4 9v11a2 2 0 002 2h12a2 2 0 002-2V9L12 2z" /><path d="M9 22V9h6v13" strokeLinecap="round" strokeLinejoin="round" /></>,
  },
  {
    title: "Secure Checkout", sub: "Safe & Trusted",
    icon: <><path d="M12 2a9 9 0 019 9c0 5-9 9-9 9s-9-4-9-9a9 9 0 019-9z" /><path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></>,
  },
];

export default function HomeGrid({ products, hero = true }: { products: Product[]; hero?: boolean }) {
  const [category, setCategory] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const shown = category === "All" ? products : products.filter((p) => p.category === category);

  const goToGrid = (cat?: string) => {
    if (cat) setCategory(cat);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // The design studio lives on every product page — open it on the first saree.
  const openStudio = () => {
    if (products[0]) router.push(`/products/${products[0].id}`);
    else goToGrid();
  };

  return (
    <div>
      {hero && (
        <section className="hero-photo" style={{ position: "relative", overflow: "hidden" }}>
          <Image
            src="/hero/design-banner.jpg"
            alt="Kanjeevaram silk saree draped over a carved wooden chair beside brass lamps"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "72% center" }}
          />
          {/* scrim: keeps text readable over the photo at every width */}
          <div className="hero-scrim" aria-hidden="true" />

          <div className="hero-content">
            {/* copy stack — sits in the image's dark left field */}
            <div className="hero-copy">
              <span style={{ color: GOLD_TXT, textTransform: "uppercase", letterSpacing: "0.25em", fontSize: 12, lineHeight: 1.2 }}>
                Heritage in every thread
              </span>
              <span style={{ fontFamily: serif, color: GOLD_LINE, fontSize: 24, fontWeight: 300, display: "block", marginTop: 2 }}>
                {/* K <span style={{ fontSize: 16 }}>•</span> */}
              </span>

              <h1 style={{
                fontFamily: serif, color: CREAM, fontWeight: 500,
                fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.01em",
                margin: "18px 0 12px",
              }}>
                The Silks of <br />Tamil Nadu
              </h1>

              <p style={{ fontFamily: serif, fontStyle: "italic", color: GOLD_TXT, fontSize: "clamp(18px, 2.2vw, 22px)", fontWeight: 500, margin: "0 0 16px" }}>
                Woven for the moments that matter.
              </p>

              <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.75, fontWeight: 300, maxWidth: 400, margin: "0 0 30px" }}>
                Temple-border silks in vermilion, emerald and bridal crimson — or open the design
                studio and colour the body, border and pallu your own way.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button onClick={() => goToGrid()} className="hero-btn"
                  style={{ background: GOLD_SOLID, color: "#3A091A", border: "none" }}>
                  Explore collection <span style={{ fontSize: 17, lineHeight: 1 }}>→</span>
                </button>
                {/* <button onClick={openStudio} className="hero-btn"
                  style={{ background: "transparent", color: GOLD_LINE, border: `1px solid ${GOLD_LINE}` }}>
                  Design your saree
                </button> */}
              </div>
            </div>

            {/* trust row pinned to the hero's base */}
            <div className="hero-trust" style={{ borderTop: "1px solid rgba(216,181,93,0.18)" }}>
              {TRUST.map((t) => (
                <div key={t.title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD_LINE} strokeWidth="1" aria-hidden="true">{t.icon}</svg>
                  <div style={{ display: "grid", gap: 2 }}>
                    <span style={{ color: GOLD_TXT, textTransform: "uppercase", letterSpacing: "0.15em", fontSize: 11 }}>{t.title}</span>
                    <span style={{ color: MUTED, fontSize: 11.5 }}>{t.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div ref={gridRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 20px 30px", scrollMarginTop: 70 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 24 }}>
          <h2 style={{ fontFamily: serif, fontWeight: 600, fontSize: 28, margin: 0, color: INK }}>
            The collection
          </h2>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${ZARI}66, transparent)` }} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          {["All", ...CATEGORIES].map((c) => {
            const active = category === c;
            return (
              <button key={c} onClick={() => setCategory(c)}
                style={{
                  border: `1px solid ${active ? MAROON : `${ZARI}55`}`,
                  background: active ? MAROON : "transparent",
                  color: active ? PAPER : "#6B5232",
                  borderRadius: 999, padding: "8px 18px",
                  fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                }}>
                {c}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 22 }}>
          {shown.map((s) => (
            <Link key={s.id} href={`/products/${s.id}`} className="lux-card"
              style={{ background: "#FFFDF8", border: `1px solid ${ZARI}2E`, borderRadius: 4, overflow: "hidden", display: "block" }}>
              <div style={{ background: "#F6EDDC", display: "flex", justifyContent: "center", padding: "16px 0 10px", borderBottom: `1px solid ${ZARI}22` }}>
                <ProductImage product={s} height={200} />
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ fontSize: 10, color: "#A87B22", textTransform: "uppercase", letterSpacing: "0.18em" }}>{s.category}</div>
                <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 19, marginTop: 4, color: INK }}>{s.name}</div>
                <div className="clamp2" style={{ fontSize: 12, lineHeight: 1.5, color: "#6D5842", marginTop: 4 }}>{s.blurb}</div>
                <div style={{ fontSize: 15, color: MAROON, marginTop: 8, fontWeight: 600, letterSpacing: "0.02em" }}>{rupees(s.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
