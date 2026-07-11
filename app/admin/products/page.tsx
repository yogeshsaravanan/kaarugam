"use client";
import { useEffect, useState } from "react";
import { solidBtn, outlineBtn, input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { storageUrl } from "@/lib/storage";
import { MAROON, GOLD, TEAL } from "@/components/theme";

const blank = { id: "", name: "", category: "Traditional", price: 0, base: "#8C1F3B", border: "#C6952F", pallu: "#6E1730", pattern: "temple", blurb: "", stock: 25, active: true };
const CATS = ["Traditional", "Modern", "Marriage", "Casual & Others"];

export default function AdminProducts() {
  const [rows, setRows] = useState<any[]>([]);
  const [edit, setEdit] = useState<any | null>(null);
  const [msg, setMsg] = useState("");
  const load = () => fetch("/api/admin/products").then((r) => r.json()).then((d) => setRows(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    setMsg("");
    const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(edit) });
    const d = await res.json();
    if (!res.ok) { setMsg(d.error || "Save failed"); return; }
    setEdit(null); setMsg("Saved."); load();
  };

  const [uploading, setUploading] = useState(false);
  async function uploadImage(file: File) {
    setUploading(true); setMsg("");
    try {
      const res = await fetch("/api/admin/upload-url", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Could not start upload");
      const supabase = createClient();
      if (!supabase) throw new Error("Image upload needs Supabase configured.");
      const { error } = await supabase.storage.from(d.bucket).uploadToSignedUrl(d.path, d.token, file);
      if (error) throw error;
      setEdit((e: any) => ({ ...e, imagePath: d.path }));
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>Products</div>
        <button onClick={() => setEdit({ ...blank, id: "new-" + Date.now().toString(36).slice(-4) })} style={solidBtn}>+ Add saree</button>
      </div>
      {msg && <div style={{ fontSize: 13, color: TEAL, marginBottom: 10 }}>{msg}</div>}

      <div style={{ display: "grid", gap: 8 }}>
        {rows.map((p) => (
          <div key={p.id} className="admin-prod-row" style={{ border: `1px solid ${GOLD}33`, borderRadius: 10, padding: "10px 12px", background: "#fff" }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, background: p.base, border: "1px solid #0002" }} />
            <span className="grow-sm" style={{ flex: 1, fontSize: 14 }}>{p.name}</span>
            <span style={{ fontSize: 12, opacity: 0.6, width: 120 }}>{p.category}</span>
            <span style={{ fontSize: 13, color: MAROON, width: 90 }}>₹{(p.price / 100).toLocaleString("en-IN")}</span>
            <span style={{ fontSize: 12, width: 70, color: (p.stock ?? 0) <= 3 ? "#B26B00" : "#333" }}>stock {p.stock}</span>
            <button onClick={() => setEdit({ ...p })} style={{ ...outlineBtn, padding: "5px 12px", fontSize: 12.5 }}>Edit</button>
          </div>
        ))}
      </div>

      {edit && (
        <div style={{ position: "fixed", inset: 0, background: "#0007", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setEdit(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: 18, width: 420, maxWidth: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginBottom: 12 }}>Edit saree</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 64, height: 84, borderRadius: 8, background: "#F3E7D3", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
                {edit.imagePath
                  ? <img src={storageUrl(edit.imagePath)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: 10, color: "#9a7", textAlign: "center" }}>SVG<br/>fallback</span>}
              </div>
              <div>
                <label style={{ ...outlineBtn, padding: "7px 12px", fontSize: 12.5, display: "inline-block", cursor: "pointer" }}>
                  {uploading ? "Uploading…" : edit.imagePath ? "Replace photo" : "Upload photo"}
                  <input type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
                    onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                </label>
                {edit.imagePath && (
                  <div onClick={() => setEdit({ ...edit, imagePath: null })} style={{ fontSize: 11.5, color: MAROON, cursor: "pointer", marginTop: 6, textDecoration: "underline" }}>
                    Remove photo (use SVG)
                  </div>
                )}
                <div style={{ fontSize: 11, opacity: 0.55, marginTop: 6, maxWidth: 220 }}>JPG/PNG/WebP. No photo → the SVG saree shows instead.</div>
              </div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <label style={{ fontSize: 12, opacity: 0.7 }}>ID<input value={edit.id} onChange={(e) => setEdit({ ...edit, id: e.target.value })} style={input} /></label>
              <label style={{ fontSize: 12, opacity: 0.7 }}>Name<input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} style={input} /></label>
              <label style={{ fontSize: 12, opacity: 0.7 }}>Category
                <select value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} style={input as any}>
                  {CATS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label style={{ fontSize: 12, opacity: 0.7 }}>Price (paise)<input type="number" value={edit.price} onChange={(e) => setEdit({ ...edit, price: Number(e.target.value) })} style={input} /></label>
              <label style={{ fontSize: 12, opacity: 0.7 }}>Stock<input type="number" value={edit.stock} onChange={(e) => setEdit({ ...edit, stock: Number(e.target.value) })} style={input} /></label>
              <div style={{ display: "flex", gap: 10 }}>
                {(["base", "border", "pallu"] as const).map((k) => (
                  <label key={k} style={{ fontSize: 12, opacity: 0.7, flex: 1 }}>{k}
                    <input type="color" value={edit[k]} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} style={{ width: "100%", height: 30, border: "none", background: "none" }} />
                  </label>
                ))}
              </div>
              <label style={{ fontSize: 12, opacity: 0.7 }}>Pattern
                <select value={edit.pattern} onChange={(e) => setEdit({ ...edit, pattern: e.target.value })} style={input as any}>
                  {["plain", "temple", "check"].map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label style={{ fontSize: 12, opacity: 0.7 }}>Blurb<textarea value={edit.blurb} onChange={(e) => setEdit({ ...edit, blurb: e.target.value })} rows={2} style={{ ...input, resize: "vertical" }} /></label>
              <label style={{ fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Active (visible in shop)
              </label>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={save} style={{ ...solidBtn, flex: 1 }}>Save</button>
              <button onClick={() => setEdit(null)} style={{ ...outlineBtn, flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
