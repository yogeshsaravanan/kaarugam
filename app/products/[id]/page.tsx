import { notFound } from "next/navigation";
import { getProduct, reviewsSummary } from "@/lib/services/catalog-service";
import { allProductIds } from "@/lib/repositories/product-repo";
import ProductClient from "./ProductClient";

export const revalidate = 60;
export function generateStaticParams() {
  return allProductIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const p = await getProduct(params.id);
  return { title: p ? `${p.name} — Tanjai Silks` : "Saree — Tanjai Silks" };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();
  const reviews = await reviewsSummary(params.id);
  return <ProductClient product={product} initialReviews={reviews} />;
}
