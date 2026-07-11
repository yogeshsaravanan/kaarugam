"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SareeFigure from "@/components/SareeFigure";
import ProductImage from "@/components/ProductImage";
import { Stars, solidBtn, outlineBtn, input } from "@/components/ui";
import { useCart } from "@/components/CartContext";
import { api } from "@/lib/api";
import { rupees } from "@/lib/money";
import type { Product, ReviewRow, Design } from "@/lib/types";
import { INK, PAPER2, MAROON, GOLD, ZARI } from "@/components/theme";

const PATTERNS: [string, string][] = [["plain", "Plain"], ["temple", "Temple border"], ["check", "Zari check"]];

export default function ProductClient({
  product, initialReviews,
}: { product: Product; initialReviews: { reviews: ReviewRow[]; average: number | null; count: number } }) {
  const { add } = useCart();
  const router = useRouter();
  const [design, setDesign] = useState<Design>({ base: product.base, border: product.border, pallu: product.pallu, pattern: product.pattern, text: "", textColor: "#FBF3E7" });
  const [angle, setAngle] = useState(0);
  const [reviews, setReviews] = useState(initialReviews);
  const [rv, setRv] = useState({ name: "", rating: 5, text: "" });
  const [err, setErr] = useState("");
  const [added, setAdded] = useState(false);

  const buy = (goCheckout: boolean) => {
    add(product, design);
    if (goCheckout) { router.push("/checkout"); return; }
    setAdded(true);
    setTimeout(() => setAdded(false), 3500);
  };

  const submitReview = async () => {
    if (!rv.text.trim()) return;
    try {
      await api.addReview({ productId: product.id, ...rv });
      setReviews((r) => ({ reviews: [{ ...rv, name: rv.name || "Guest", created_at: "" }, ...r.reviews], average: r.average, count: r.count + 1 }));
      setRv({ name: "", rating: 5, text: "" });
    } catch (e: any) { setErr(e.message); }
  };

  const ColorRow = ({ label, k }: { label: string; k: keyof Design }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12.5, opacity: 0.7 }}>{label}</span>
      <input type="color" value={design[k] as string} onChange={(e) => setDesign({ ...design, [k]: e.target.value })} style={{ width: 40, height: 28, border: "none", background: "none", cursor: "pointer" }} />
    </div>
  );

  return (
    <div className="product-layout" style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 18px" }}>
      <div>
        {product.imagePath ? (
          <div style={{ background: PAPER2, borderRadius: 14, padding: 16, display: "flex", justifyContent: "center" }}>
            <ProductImage product={product} height={420} width={300} />
          </div>
        ) : (
          <>
            <div style={{ background: PAPER2, borderRadius: 14, padding: "20px 0" }}>
              <SareeFigure design={design} angle={angle} height={380} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 12 }}>
              {[["-25", "⟲ Left"], ["0", "Front"], ["25", "Right ⟳"]].map(([a, label]) => (
                <button key={a} onClick={() => setAngle(Number(a))} style={{ ...outlineBtn, padding: "6px 14px", fontSize: 12.5, ...(angle === Number(a) ? { background: MAROON, color: "#fff" } : {}) }}>{label}</button>
              ))}
            </div>
          </>
        )}
      </div>

      <div>
        <div style={{ fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "#A87B22", marginBottom: 8 }}>
          <Link href="/" style={{ color: "#A87B22" }}>Collection</Link>
          <span style={{ opacity: 0.5 }}> / </span>{product.category}
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 30, margin: 0, lineHeight: 1.15 }}>{product.name}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <Stars value={Math.round(reviews.average ?? 0)} />
          <span style={{ fontSize: 12.5, opacity: 0.7 }}>{reviews.count ? `${reviews.average?.toFixed(1)} (${reviews.count})` : "No ratings yet"}</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <span style={{ fontSize: 25, color: MAROON, fontWeight: 700 }}>{rupees(product.price)}</span>
          <div style={{ fontSize: 11.5, color: "#7A6A52", marginTop: 2 }}>Inclusive of all taxes</div>
        </div>
        <p style={{ fontSize: 13.5, opacity: 0.8, lineHeight: 1.7 }}>{product.blurb}</p>

        <div style={{ border: `1px solid ${ZARI}33`, background: "#FDF9F1", borderRadius: 4, padding: "4px 16px", margin: "14px 0 4px" }}>
          {[["Fabric", "Kanchipuram silk weave"], ["Inclusions", "Unstitched blouse piece"], ["Dispatch", "Ships in 3–5 business days"]].map(([k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: i ? `1px solid ${ZARI}22` : "none", fontSize: 12.5 }}>
              <span style={{ color: "#8A6E3A", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 10.5 }}>{k}</span>
              <span style={{ color: "#3D2A18", textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, margin: "18px 0 8px", flexWrap: "wrap" }}>
          <button onClick={() => buy(false)} style={{ ...outlineBtn, flex: 1, minWidth: 150 }}>Add to cart</button>
          <button onClick={() => buy(true)} style={{ ...solidBtn, flex: 1, minWidth: 150 }}>Buy now</button>
        </div>
        <div aria-live="polite" style={{ minHeight: 22, marginBottom: 12 }}>
          {added && (
            <span style={{ fontSize: 13, color: "#3E6B48" }}>
              Added to cart · <Link href="/cart" style={{ color: MAROON, textDecoration: "underline" }}>View cart</Link>
            </span>
          )}
        </div>

        <div style={{ background: "#fff", border: `1px solid ${GOLD}33`, borderRadius: 14, padding: 18 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#A87B22" }}>Make it yours</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, marginTop: 3 }}>Design studio</div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            <ColorRow label="Saree colour" k="base" />
            <ColorRow label="Border colour" k="border" />
            <ColorRow label="Pallu colour" k="pallu" />
            <div>
              <div style={{ fontSize: 12.5, opacity: 0.7, marginBottom: 6 }}>Pattern</div>
              <div style={{ display: "flex", gap: 8 }}>
                {PATTERNS.map(([id, label]) => (
                  <button key={id} onClick={() => setDesign({ ...design, pattern: id })}
                    style={{ fontSize: 12, padding: "6px 10px", borderRadius: 8, border: `1px solid ${design.pattern === id ? MAROON : "#D8CBB0"}`, background: design.pattern === id ? `${MAROON}14` : "transparent", cursor: "pointer" }}>{label}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12.5, opacity: 0.7, marginBottom: 6 }}>Text on pallu</div>
              <input value={design.text || ""} maxLength={16} onChange={(e) => setDesign({ ...design, text: e.target.value })} placeholder="a name or short message" style={input} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 26 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 12 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19 }}>Ratings &amp; reviews</div>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${ZARI}44, transparent)` }} />
          </div>
          <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
            {reviews.reviews.length === 0 && <div style={{ fontSize: 13, opacity: 0.6 }}>Be the first to review this saree.</div>}
            {reviews.reviews.map((r, i) => (
              <div key={i} style={{ border: `1px solid ${GOLD}33`, borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span><Stars value={r.rating} size={13} />
                </div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{r.text}</div>
              </div>
            ))}
          </div>
          <div style={{ border: `1px solid ${GOLD}33`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12.5, marginBottom: 8, opacity: 0.7 }}>Write a review</div>
            <Stars value={rv.rating} onChange={(n) => setRv({ ...rv, rating: n })} size={20} />
            <input value={rv.name} onChange={(e) => setRv({ ...rv, name: e.target.value })} placeholder="Your name" style={{ ...input, marginTop: 8 }} />
            <textarea value={rv.text} onChange={(e) => setRv({ ...rv, text: e.target.value })} placeholder="Share how the saree looked and felt..." rows={3} style={{ ...input, marginTop: 8, resize: "vertical" }} />
            {err && <div style={{ color: MAROON, fontSize: 12, marginTop: 6 }}>{err}</div>}
            <button onClick={submitReview} style={{ ...solidBtn, marginTop: 8, width: "100%" }}>Post review</button>
          </div>
        </div>
      </div>
    </div>
  );
}
