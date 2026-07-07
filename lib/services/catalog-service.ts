import * as productRepo from "../repositories/product-repo";
import * as reviewRepo from "../repositories/review-repo";

export const listProducts = (category?: string | null) => productRepo.listProducts(category);
export const getProduct = (id: string) => productRepo.getProduct(id);

export async function reviewsSummary(productId: string) {
  const reviews = await reviewRepo.listReviews(productId);
  const average = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : null;
  return { reviews, average, count: reviews.length };
}

export const addReview = reviewRepo.addReview;
