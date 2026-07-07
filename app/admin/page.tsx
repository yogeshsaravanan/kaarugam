import { dashboardStats } from "@/lib/services/admin-service";
import { rupees } from "@/lib/money";
import { MAROON, TEAL, GOLD, INK } from "@/components/theme";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const s = await dashboardStats();
  const card = (label: string, value: string, tint = INK) => (
    <div style={{ border: `1px solid ${GOLD}33`, borderRadius: 12, padding: 16, background: "#fff" }}>
      <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: tint, marginTop: 4 }}>{value}</div>
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 14 }}>
      {card("Products", String(s.products))}
      {card("Orders", String(s.orders))}
      {card("Revenue (paid)", rupees(s.revenue), MAROON)}
      {card("Low stock (≤3)", String(s.lowStock), s.lowStock > 0 ? "#B26B00" : TEAL)}
    </div>
  );
}
