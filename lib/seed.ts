import type { Product } from "./types";

// Canonical catalogue. Also the source for supabase/migrations seed and the
// demo-mode fallback when Supabase isn't configured. Prices in paise.
export const PRODUCTS: Product[] = [
  { id: "t1", name: "Kanjeevaram Vermilion", category: "Traditional", price: 1850000, base: "#8C1F3B", border: "#C6952F", pallu: "#6E1730", pattern: "temple", blurb: "Classic Kanjeevaram weave in deep vermilion with a wide gold zari border." },
  { id: "t2", name: "Temple Mustard Silk", category: "Traditional", price: 1520000, base: "#C08A2E", border: "#5B2A1A", pallu: "#7A3A20", pattern: "temple", blurb: "Mustard-gold body with a hand-woven maroon temple border." },
  { id: "t3", name: "Emerald Zari Silk", category: "Traditional", price: 2100000, base: "#1E6E6A", border: "#C6952F", pallu: "#12433F", pattern: "check", blurb: "Deep emerald silk lifted by a fine checked zari grid." },
  { id: "m1", name: "Powder Blush Silk", category: "Modern", price: 980000, base: "#E3B7B0", border: "#C6952F", pallu: "#C98E86", pattern: "plain", blurb: "Lightweight modern silk in soft blush with a slim gold edge." },
  { id: "m2", name: "Lilac Ombre Silk", category: "Modern", price: 1140000, base: "#B7A0D8", border: "#8C6FB3", pallu: "#9A7FC2", pattern: "plain", blurb: "Contemporary ombre drape, lilac fading into deep violet." },
  { id: "m3", name: "Champagne Shimmer Silk", category: "Modern", price: 1320000, base: "#E7D9B8", border: "#A87B22", pallu: "#D8C398", pattern: "check", blurb: "Understated champagne silk with a whisper of zari shimmer." },
  { id: "w1", name: "Bridal Crimson Kanjeevaram", category: "Marriage", price: 4250000, base: "#A3183F", border: "#C6952F", pallu: "#7A0F2C", pattern: "temple", blurb: "Heavy bridal Kanjeevaram in crimson, dense gold zari throughout." },
  { id: "w2", name: "Magenta Zari Bridal Silk", category: "Marriage", price: 3890000, base: "#B32268", border: "#C6952F", pallu: "#831A4B", pattern: "temple", blurb: "Rich magenta bridal silk with a broad temple-motif pallu." },
  { id: "w3", name: "Maroon Temple Bridal Silk", category: "Marriage", price: 4590000, base: "#6E1730", border: "#C6952F", pallu: "#4E0F22", pattern: "temple", blurb: "The classic wedding maroon, woven dense with temple zari." },
  { id: "o1", name: "Mint Zari Casual Silk", category: "Casual & Others", price: 640000, base: "#A7CFC2", border: "#C6952F", pallu: "#84B3A4", pattern: "plain", blurb: "Easy everyday silk in cool mint with a fine gold line." },
  { id: "o2", name: "Ivory Thread Casual Silk", category: "Casual & Others", price: 710000, base: "#F1E7D3", border: "#8C1F3B", pallu: "#E3D3B4", pattern: "check", blurb: "Soft ivory silk, small maroon thread checks throughout." },
  { id: "o3", name: "Teal Zari Office Silk", category: "Casual & Others", price: 830000, base: "#1E6E6A", border: "#E7D9B8", pallu: "#15514E", pattern: "plain", blurb: "Office-friendly teal silk with a slim ivory-gold border." },
];

export const CATEGORIES: string[] = ["Traditional", "Modern", "Marriage", "Casual & Others"];

export const SEED_REVIEWS: Record<string, { name: string; rating: number; text: string }[]> = {
  t1: [{ name: "Radha K.", rating: 5, text: "The zari border is even richer in person. Draped beautifully for my sister's function." }],
  w1: [{ name: "Meena S.", rating: 5, text: "Wore this for my wedding reception, got so many compliments on the pallu." }],
  m1: [{ name: "Anjali P.", rating: 4, text: "Lovely light silk, great for a day event. Wish the blush was a touch deeper." }],
};
