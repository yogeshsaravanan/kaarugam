import { listProducts } from "@/lib/services/catalog-service";
import HomeGrid from "./HomeGrid";

export const revalidate = 60; // ISR

export default async function HomePage() {
  const products = await listProducts();
  return <HomeGrid products={products} />;
}
