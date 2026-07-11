"use client";
import { useMemo } from "react";
import type { Design } from "@/lib/types";
import { SKIN, shade } from "./theme";

let _uid = 0;

export default function SareeFigure({
  design, angle = 0, showFigure = true, height = 360,
}: { design: Design; angle?: number; showFigure?: boolean; height?: number }) {
  const { base, border, pallu, pattern, text, textColor } = design;
  const uid = useMemo(() => "sf" + _uid++, []);
  const baseL = shade(base, 0.28), baseD = shade(base, -0.22);
  const palluL = shade(pallu, 0.22), palluD = shade(pallu, -0.2);

  const motifs: JSX.Element[] = [];
  if (pattern === "temple") {
    for (let i = 0; i < 12; i++) {
      const x = 52 + i * 9.5;
      motifs.push(<polygon key={"t" + i} points={`${x},396 ${x + 4.5},381 ${x + 9},396`} fill={`url(#${uid}-zari)`} />);
    }
  }
  const weave: JSX.Element[] = [];
  if (pattern === "check") {
    for (let i = 0; i < 7; i++) {
      const y = 150 + i * 36;
      weave.push(<path key={"h" + i} d={`M60,${y} Q110,${y + 6} 162,${y}`} stroke={border} strokeWidth="1" opacity="0.4" fill="none" />);
    }
    for (let i = 0; i < 7; i++) {
      const x = 64 + i * 16;
      weave.push(<line key={"v" + i} x1={x} y1="146" x2={x} y2="392" stroke={border} strokeWidth="1" opacity="0.4" />);
    }
  }

  return (
    <div style={{ perspective: "1000px", width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `rotateY(${angle}deg)`, transition: "transform 0.55s cubic-bezier(.4,.1,.2,1)" }}>
        <svg width={height * 0.58} height={height} viewBox="0 0 220 420">
          <defs>
            <linearGradient id={`${uid}-silk`} x1="0" y1="0" x2="1" y2="0.15">
              <stop offset="0" stopColor={baseD} /><stop offset="0.42" stopColor={baseL} />
              <stop offset="0.6" stopColor={base} /><stop offset="1" stopColor={baseD} />
            </linearGradient>
            <linearGradient id={`${uid}-pallu`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={palluL} /><stop offset="0.5" stopColor={pallu} /><stop offset="1" stopColor={palluD} />
            </linearGradient>
            <linearGradient id={`${uid}-zari`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={shade(border, 0.45)} /><stop offset="0.5" stopColor={border} /><stop offset="1" stopColor={shade(border, -0.3)} />
            </linearGradient>
            <radialGradient id={`${uid}-sheen`} cx="0.4" cy="0.25" r="0.9">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" /><stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="110" cy="408" rx="60" ry="8" fill="#00000016" />
          {showFigure && (
            <>
              <ellipse cx="110" cy="36" rx="23" ry="26" fill={SKIN} />
              <path d="M87,30 Q110,4 133,30 Q134,14 110,10 Q86,14 87,30" fill="#241109" />
              <rect x="101" y="58" width="18" height="16" rx="5" fill={SKIN} />
              <path d="M74,96 Q60,150 66,210 Q72,214 78,210 Q74,150 88,104 Z" fill={SKIN} />
              <path d="M146,96 Q160,150 154,210 Q148,214 142,210 Q146,150 132,104 Z" fill={SKIN} />
            </>
          )}
          <path d="M70,90 Q110,72 150,90 L170,392 Q110,414 50,392 Z" fill={`url(#${uid}-silk)`} />
          {[92, 100, 108, 116, 124].map((x, i) => (
            <path key={i} d={`M${x},150 Q${x + 2},270 ${x + 4},392`} stroke={baseD} strokeOpacity="0.4" strokeWidth="1.6" fill="none" />
          ))}
          {weave}
          <path d="M50,374 Q110,396 170,374 L170,392 Q110,414 50,392 Z" fill={`url(#${uid}-zari)`} />
          {motifs}
          <path d="M70,90 L50,392" stroke={`url(#${uid}-zari)`} strokeWidth="4" fill="none" opacity="0.9" />
          <path d="M86,64 Q110,58 134,64 L132,102 Q110,108 88,102 Z" fill={`url(#${uid}-pallu)`} />
          <path d="M132,66 L150,74 Q182,180 176,338 L146,356 Q150,190 120,86 Z" fill={`url(#${uid}-pallu)`} />
          <path d="M132,66 L150,74 L156,90 L124,86 Z" fill={`url(#${uid}-zari)`} />
          <path d="M146,356 L176,338 L176,352 L150,368 Z" fill={`url(#${uid}-zari)`} />
          <path d="M70,90 Q110,72 150,90 L170,392 Q110,414 50,392 Z" fill={`url(#${uid}-sheen)`} />
          {text ? (
            <text x="150" y="215" fill={textColor || "#FBF3E7"} fontSize="12" fontFamily="'Cormorant Garamond', serif" transform="rotate(72 150 215)" opacity="0.95">
              {text.slice(0, 16)}
            </text>
          ) : null}
        </svg>
      </div>
    </div>
  );
}
