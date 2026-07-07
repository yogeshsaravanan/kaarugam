import { listProducts } from "@/lib/services/catalog-service";
import HomeGrid from "../../HomeGrid";
import { CATEGORIES } from "@/lib/seed";

export const revalidate = 60;
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: encodeURIComponent(c) }));
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = decodeURIComponent(params.slug);
  const products = await listProducts(category);
  return <HomeGrid products={products} />;
}
