import * as productRepo from "../repositories/product-repo";
import * as orderRepo from "../repositories/order-repo";

export const listProducts = productRepo.adminListProducts;
export const upsertProduct = productRepo.upsertProduct;
export const deleteProduct = productRepo.deleteProduct;
export const listAllOrders = orderRepo.listAllOrders;

export async function dashboardStats() {
  const [products, orders] = await Promise.all([listProducts(), listAllOrders()]);
  const revenue = orders.filter((o) => o.status === "paid").reduce((a, o) => a + o.amount, 0);
  const lowStock = products.filter((p) => (p.stock ?? 0) <= 3).length;
  return { products: products.length, orders: orders.length, revenue, lowStock };
}
