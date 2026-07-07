"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import HeroWoman from "@/components/HeroWoman";
import type { Product } from "@/lib/types";
import { rupees } from "@/lib/money";
import { CATEGORIES } from "@/lib/seed";
import { INK, PAPER, MAROON } from "@/components/theme";

const CHAMPAGNE = "#EAD9AC";
const ZARI = "#C9A227";
const IVORY = "#FBF6EC";

export default function HomeGrid({ products, hero = true }: { products: Product[]; hero?: boolean }) {
  const [category, setCategory] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);
  const shown = category === "All" ? products : products.filter((p) => p.category === category);

  const goToGrid = (cat?: string) => {
    if (cat) setCategory(cat);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {hero && (
        <section
          style={{
            background: `radial-gradient(120% 130% at 28% 12%, #6B1430 0%, #4A0D20 48%, #241109 100%)`,
            color: IVORY,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              maxWidth: 1100, margin: "0 auto", padding: "56px 22px 0",
              display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 380px", paddingBottom: 64 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: ZARI, marginBottom: 18 }}>
                Kanchipuram heritage weaves
              </div>
              <h1
                style={{
                  fontFamily: "Marcellus, serif", fontWeight: 400, margin: 0,
                  fontSize: "clamp(38px, 5.2vw, 60px)", lineHeight: 1.06, letterSpacing: "0.01em",
                }}
              >
                The silk of
                <br />
                Kanchipuram
              </h1>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500,
                  fontSize: "clamp(19px, 2.2vw, 24px)", color: CHAMPAGNE, margin: "16px 0 0", lineHeight: 1.4,
                }}
              >
                Woven for the moments that matter.
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: `${IVORY}B0`, maxWidth: 440, margin: "18px 0 30px" }}>
                Temple-border silks in vermilion, emerald and bridal crimson — or open the design
                studio and colour the body, border and pallu your own way.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button
                  onClick={() => goToGrid()}
                  style={{
                    background: `linear-gradient(180deg, #E3C568, ${ZARI})`, color: "#2A1503",
                    border: "none", borderRadius: 3, padding: "14px 26px",
                    fontSize: 12.5, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Explore the collection
                </button>
                <button
                  onClick={() => goToGrid("Marriage")}
                  style={{
                    background: "transparent", color: CHAMPAGNE, border: `1px solid ${ZARI}88`,
                    borderRadius: 3, padding: "14px 26px",
                    fontSize: 12.5, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer",
                  }}
                >
                  The bridal edit
                </button>
              </div>
              <div style={{ marginTop: 34, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: `${CHAMPAGNE}99` }}>
                Custom colours &nbsp;·&nbsp; Temple zari borders &nbsp;·&nbsp; Secure checkout
              </div>
            </div>

            <div style={{ flex: "0 1 340px", display: "flex", justifyContent: "center", minWidth: 280 }}>
              <HeroWoman height={470} />
            </div>
          </div>
        </section>
      )}

      <div ref={gridRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 20px 30px", scrollMarginTop: 70 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Marcellus, serif", fontWeight: 400, fontSize: 27, margin: 0, color: INK }}>
            The collection
          </h2>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${ZARI}66, transparent)` }} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          {["All", ...CATEGORIES].map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  border: `1px solid ${active ? MAROON : `${ZARI}55`}`,
                  background: active ? MAROON : "transparent",
                  color: active ? PAPER : "#6B5232",
                  borderRadius: 999, padding: "8px 18px",
                  fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                }}
              >
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
                <div style={{ fontFamily: "Marcellus, serif", fontSize: 17.5, marginTop: 4, color: INK }}>{s.name}</div>
                <div style={{ fontSize: 15, color: MAROON, marginTop: 8, fontWeight: 600, letterSpacing: "0.02em" }}>{rupees(s.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
