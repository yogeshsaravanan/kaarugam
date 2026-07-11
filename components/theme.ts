export const INK = "#241109";
export const PAPER = "#FBF3E7";
export const PAPER2 = "#F3E7D3";
export const IVORY = "#FBF6EC";
export const CARD = "#FFFDF8";
export const MAROON = "#8C1F3B";
export const MAROON_D = "#6E1730";
export const GOLD = "#C6952F";
export const GOLD_D = "#A87B22";
export const ZARI = "#C9A227";
export const CHAMPAGNE = "#EAD9AC";
export const TEAL = "#1E6E6A";
export const SKIN = "#E7B98F";

export function shade(hex: string, amt: number): string {
  let h = (hex || "#000000").replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + (amt < 0 ? c : 255 - c) * amt)));
  return `#${((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1)}`;
}
