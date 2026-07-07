import SareeFigure from "./SareeFigure";
import { storageUrl } from "@/lib/storage";
import type { Product } from "@/lib/types";

// Real photo when the admin has uploaded one; otherwise the SVG saree as a
// graceful fallback (so products without a photo still render).
export default function ProductImage({
  product, height = 190, showFigure = false, width,
}: { product: Product; height?: number; showFigure?: boolean; width?: number }) {
  if (product.imagePath) {
    const w = width ?? Math.round(height * 0.62);
    return (
      <img
        src={storageUrl(product.imagePath, { width: Math.max(w * 2, 400) })}
        alt={product.name}
        loading="lazy"
        style={{ width: w, height, objectFit: "cover", borderRadius: 10, display: "block" }}
      />
    );
  }
  return <SareeFigure design={product as any} showFigure={showFigure} height={height} />;
}
