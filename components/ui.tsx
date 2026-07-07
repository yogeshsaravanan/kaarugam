"use client";
import { MAROON, PAPER } from "./theme";
export const solidBtn: React.CSSProperties = { background: MAROON, color: PAPER, border: "none", borderRadius: 9, padding: "11px 18px", fontSize: 14, cursor: "pointer" };
export const outlineBtn: React.CSSProperties = { background: "transparent", color: MAROON, border: `1.5px solid ${MAROON}`, borderRadius: 9, padding: "11px 18px", fontSize: 14, cursor: "pointer" };
export const input: React.CSSProperties = { width: "100%", border: "1px solid #D8CBB0", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, boxSizing: "border-box" };
export function Stars({ value, onChange, size = 16 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} onClick={onChange ? () => onChange(s) : undefined}
          style={{ cursor: onChange ? "pointer" : "default", color: s <= value ? "#C6952F" : "#D8CBB0", fontSize: size, lineHeight: 1 }}>★</span>
      ))}
    </span>
  );
}
