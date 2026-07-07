import { SUPABASE_URL } from "./supabase/config";

export const IMAGE_BUCKET = "saree-images";

// Public delivery URL for a stored object path.
// Plain public URL works on every tier. Passing a width uses Supabase's image
// render endpoint (resize + optimise) — available on paid tiers; falls back
// harmlessly to the original if transforms aren't enabled.
export function storageUrl(path: string, opts: { width?: number; quality?: number } = {}): string {
  if (!SUPABASE_URL || !path) return path;
  if (opts.width) {
    const q = new URLSearchParams({ width: String(opts.width), quality: String(opts.quality ?? 75), resize: "cover" });
    return `${SUPABASE_URL}/storage/v1/render/image/public/${IMAGE_BUCKET}/${path}?${q.toString()}`;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}
