import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/supabase/server";
import { getRole } from "@/lib/auth/guards";
import { MAROON, GOLD, INK } from "@/components/theme";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const role = await getRole(user.id);
  if (role !== "admin") redirect("/");

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 18px" }}>
      <div style={{ display: "flex", gap: 18, alignItems: "center", borderBottom: `1px solid ${GOLD}44`, paddingBottom: 12, marginBottom: 20 }}>
        <span style={{ fontFamily: "Marcellus, serif", fontSize: 20, color: MAROON }}>Admin</span>
        <Link href="/admin" style={{ fontSize: 14, color: INK }}>Dashboard</Link>
        <Link href="/admin/products" style={{ fontSize: 14, color: INK }}>Products</Link>
        <Link href="/admin/orders" style={{ fontSize: 14, color: INK }}>Orders</Link>
        <Link href="/" style={{ fontSize: 13, color: MAROON, marginLeft: "auto" }}>← Storefront</Link>
      </div>
      {children}
    </div>
  );
}
