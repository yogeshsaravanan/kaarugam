"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SareeFigure from "@/components/SareeFigure";
import ProductImage from "@/components/ProductImage";
import { Stars, solidBtn, outlineBtn, input } from "@/components/ui";
import { useCart } from "@/components/CartContext";
import { api } from "@/lib/api";
import { rupees } from "@/lib/money";
import type { Product, ReviewRow, Design } from "@/lib/types";
import { INK, PAPER2, MAROON, GOLD, TEAL } from "@/components/theme";

const PATTERNS: [string, string][] = [["plain", "Plain"], ["temple", "Temple border"], ["check", "Zari check"]];

// Premium Trust Badges Data
const TRUST_DETAILS = [
  { label: "Fabric", value: "100% Pure Kanchipuram Silk" },
  { label: "Weight", value: "Approx 850 grams" },
  { label: "Inclusions", value: "Unstitched Blouse Piece (0.8m)" },
  { label: "Dispatch", value: "Ships in 3-5 Business Days" },
];

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

  const buy = (goCheckout: boolean) => { add(product, design); router.push(goCheckout ? "/checkout" : "/cart"); };

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
        <div style={{ fontSize: 12, color: TEAL, textTransform: "uppercase", letterSpacing: 0.6 }}>{product.category}</div>
        <div style={{ fontFamily: "Marcellus, serif", fontSize: 28 }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <Stars value={Math.round(reviews.average ?? 0)} />
          <span style={{ fontSize: 12.5, opacity: 0.7 }}>{reviews.count ? `${reviews.average?.toFixed(1)} (${reviews.count})` : "No ratings yet"}</span>
        </div>
        <div style={{ fontSize: 24, color: MAROON, fontWeight: 700, marginTop: 10 }}>{rupees(product.price)}</div>
        
        <p style={{ fontSize: 13.5, opacity: 0.8, lineHeight: 1.7, margin: "12px 0 16px" }}>{product.blurb}</p>

        {/* --- NEW: TRUST ELEMENTS --- */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", padding: "14px", background: `${MAROON}08`, border: `1px solid ${MAROON}15`, borderRadius: 8, marginBottom: 20 }}>
          {TRUST_DETAILS.map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.1, color: MAROON, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 12.5, color: INK, marginTop: 2 }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <button onClick={() => buy(false)} style={{ ...outlineBtn, flex: 1 }}>Add to cart</button>
          <button onClick={() => buy(true)} style={{ ...solidBtn, flex: 1 }}>Buy now</button>
        </div>

        <div style={{ background: "#fff", border: `1px solid ${GOLD}33`, borderRadius: 14, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontFamily: "Marcellus, serif", fontSize: 18 }}>Design studio</div>
            <span style={{ fontSize: 11, color: TEAL, background: `${TEAL}15`, padding: "2px 8px", borderRadius: 20 }}>Optional</span>
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
          <div style={{ fontFamily: "Marcellus, serif", fontSize: 18, marginBottom: 10 }}>Ratings & reviews</div>
          <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
            {reviews.reviews.length === 0 && <div style={{ fontSize: 13, opacity: 0.6 }}>Be the first to review this saree.</div>}
            {reviews.reviews.map((r, i) => (
              <div key={i} style={{ border: `1px solid ${GOLD}33`, borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span><Stars value={r.rating} size={13} />
                </div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4, lineHeight: 1.5 }}>{r.text}</div>
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