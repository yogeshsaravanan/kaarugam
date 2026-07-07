"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { CartLine, Design, Product } from "@/lib/types";

interface CartCtx {
  items: CartLine[];
  add: (p: Product, design?: Design) => void;
  setQty: (lineId: string, d: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  count: number;
  total: number;
}
const Ctx = createContext<CartCtx | null>(null);
export const useCart = () => useContext(Ctx)!;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("cart") || "[]")); } catch {}
  }, []);
  useEffect(() => { localStorage.setItem("cart", JSON.stringify(items)); }, [items]);

  const add = (p: Product, design?: Design) =>
    setItems((prev) => [...prev, {
      lineId: p.id + "-" + Date.now(), productId: p.id, name: p.name, price: p.price, qty: 1,
      design: design || { base: p.base, border: p.border, pallu: p.pallu, pattern: p.pattern },
    }]);
  const setQty = (lineId: string, d: number) =>
    setItems((prev) => prev.map((i) => i.lineId === lineId ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const remove = (lineId: string) => setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  const clear = () => setItems([]);
  const count = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce((a, i) => a + i.price * i.qty, 0);

  return <Ctx.Provider value={{ items, add, setQty, remove, clear, count, total }}>{children}</Ctx.Provider>;
}
