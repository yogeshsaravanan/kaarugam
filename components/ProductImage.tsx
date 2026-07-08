import SareeFigure from "./SareeFigure";
import { storageUrl } from "@/lib/storage";
import type { Product } from "@/lib/types";

export default function ProductImage({
  product, height = 190, showFigure = false, width,
}: { product: Product; height?: number; showFigure?: boolean; width?: number }) {
  if (product.imagePath) {
    const w = width ?? Math.round(height * 0.62);
    return (
      // Wrapper for the Zoom Effect
      <div style={{ 
        width: w, 
        height, 
        overflow: "hidden", // Hides the scaled-up parts
        borderRadius: 10, 
        position: "relative" 
      }}>
        <img
          src={storageUrl(product.imagePath, { width: Math.max(w * 2, 400) })}
          alt={product.name}
          loading="lazy"
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover", 
            display: "block",
            transition: "transform 0.4s ease", // Smooth zoom animation
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"} // Zoom in on hover
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}  // Zoom out on leave
        />
      </div>
    );
  }
  return <SareeFigure design={product as any} showFigure={showFigure} height={height} />;
}