import { SEED_REVIEWS } from "../seed";
import { createServiceClient } from "../supabase/server";
import { hasServiceRole } from "../supabase/config";
import type { ReviewRow } from "../types";

export async function listReviews(productId: string): Promise<ReviewRow[]> {
  if (!hasServiceRole) {
    return (SEED_REVIEWS[productId] ?? []).map((r) => ({ ...r, created_at: "" }));
  }
  const sb = createServiceClient()!;
  const { data, error } = await sb
    .from("reviews")
    .select("name, rating, text, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addReview(
  productId: string,
  userId: string | null,
  name: string,
  rating: number,
  text: string
): Promise<void> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Reviews require Supabase to be configured.");
  const { error } = await sb.from("reviews").insert({
    product_id: productId, user_id: userId, name: name.slice(0, 40), rating, text: text.slice(0, 800),
  });
  if (error) throw new Error(error.message);
}
