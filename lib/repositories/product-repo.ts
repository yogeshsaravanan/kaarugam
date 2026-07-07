import { PRODUCTS } from "../seed";
import { createServiceClient } from "../supabase/server";
import { hasServiceRole } from "../supabase/config";
import type { Product } from "../types";

// Reads fall back to the bundled seed when Supabase isn't configured (demo mode).
export async function listProducts(category?: string | null): Promise<Product[]> {
  if (!hasServiceRole) {
    const all = PRODUCTS;
    return category && category !== "All" ? all.filter((p) => p.category === category) : all;
  }
  const sb = createServiceClient()!;
  let q = sb.from("products").select("*").eq("active", true);
  if (category && category !== "All") q = q.eq("category", category);
  const { data, error } = await q.order("price_paise", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!hasServiceRole) return PRODUCTS.find((p) => p.id === id) ?? null;
  const sb = createServiceClient()!;
  const { data, error } = await sb.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToProduct(data) : null;
}

export function allProductIds(): string[] {
  return PRODUCTS.map((p) => p.id);
}

// ---- Admin ----
export async function adminListProducts(): Promise<Product[]> {
  const sb = createServiceClient();
  if (!sb) return PRODUCTS;
  const { data, error } = await sb.from("products").select("*").order("category");
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToProduct);
}

export async function upsertProduct(p: any): Promise<void> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Supabase not configured.");
  const { error } = await sb.from("products").upsert({
    id: p.id, name: p.name, category: p.category, price_paise: p.price,
    base: p.base, border: p.border, pallu: p.pallu, pattern: p.pattern,
    blurb: p.blurb, stock: p.stock, active: p.active, image_path: p.imagePath ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string): Promise<void> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Supabase not configured.");
  const { error } = await sb.from("products").update({ active: false }).eq("id", id);
  if (error) throw new Error(error.message);
}

// ---- Atomic inventory (calls the DB functions from 0002) ----
export async function reserveStock(items: { productId: string; qty: number }[]): Promise<void> {
  const sb = createServiceClient();
  if (!sb) return; // demo mode: no stock enforcement
  const { error } = await sb.rpc("reserve_stock", { items });
  if (error) {
    if (error.message.includes("OUT_OF_STOCK")) {
      const id = error.message.split("OUT_OF_STOCK:")[1] || "";
      throw new OutOfStockError(id.trim());
    }
    throw new Error(error.message);
  }
}

export async function releaseStock(items: { productId: string; qty: number }[]): Promise<void> {
  const sb = createServiceClient();
  if (!sb) return;
  await sb.rpc("release_stock", { items });
}

export class OutOfStockError extends Error {
  constructor(public productId: string) { super(`Out of stock: ${productId}`); }
}

function rowToProduct(r: any): Product {
  return {
    id: r.id, name: r.name, category: r.category, price: r.price_paise ?? r.price,
    base: r.base, border: r.border, pallu: r.pallu, pattern: r.pattern,
    blurb: r.blurb, stock: r.stock, imagePath: r.image_path ?? null,
  };
}
