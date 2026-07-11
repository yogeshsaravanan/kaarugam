"use client";
import { MAROON, PAPER, ZARI, INK } from "./theme";

export const solidBtn: React.CSSProperties = {
  background: MAROON, color: PAPER, border: "none", borderRadius: 3,
  padding: "13px 22px", fontSize: 12.5, letterSpacing: "0.12em",
  textTransform: "uppercase", fontWeight: 600, cursor: "pointer",
};
export const outlineBtn: React.CSSProperties = {
  background: "transparent", color: MAROON, border: `1px solid ${MAROON}`,
  borderRadius: 3, padding: "13px 22px", fontSize: 12.5, letterSpacing: "0.12em",
  textTransform: "uppercase", fontWeight: 500, cursor: "pointer",
};
export const goldBtn: React.CSSProperties = {
  background: `linear-gradient(180deg, #E3C568, ${ZARI})`, color: "#2A1503",
  border: "none", borderRadius: 3, padding: "13px 22px", fontSize: 12.5,
  letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer",
};
export const input: React.CSSProperties = {
  width: "100%", border: "1px solid #DCCBA8", borderRadius: 3, background: "#FFFDF8",
  padding: "12px 13px", fontSize: 13.5, boxSizing: "border-box", color: INK,
};

export function PageHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: "#A87B22", marginBottom: 6 }}>{eyebrow}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 27, margin: 0, color: INK }}>{title}</h1>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${ZARI}55, transparent)` }} />
      </div>
    </div>
  );
}

export function Stars({ value, onChange, size = 16 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} onClick={onChange ? () => onChange(s) : undefined}
          style={{ cursor: onChange ? "pointer" : "default", color: s <= value ? ZARI : "#DDD0B4", fontSize: size, lineHeight: 1 }}>★</span>
      ))}
    </span>
  );
}
