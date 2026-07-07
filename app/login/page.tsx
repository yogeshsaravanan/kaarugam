"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/useAuth";
import { solidBtn, input } from "@/components/ui";
import { MAROON, TEAL } from "@/components/theme";

export default function LoginPage() {
  const { login, register, enabled } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  if (!enabled) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "40px 18px", fontSize: 14, opacity: 0.75 }}>
        Accounts are disabled in demo mode. Add your Supabase keys to <code>.env.local</code> to enable sign-in.
        You can still browse, customise, and place guest orders.
      </div>
    );
  }

  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      const { error } = mode === "login"
        ? await login(form.email, form.password)
        : await register(form.email, form.password);
      if (error) throw new Error(error.message);
      router.push("/");
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <div style={{ maxWidth: 380, margin: "0 auto", padding: "34px 18px" }}>
      <div style={{ fontFamily: "Marcellus, serif", fontSize: 26, marginBottom: 6 }}>{mode === "login" ? "Welcome back" : "Create account"}</div>
      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={input} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={input} />
      </div>
      {err && <div style={{ color: MAROON, fontSize: 13, marginTop: 10 }}>{err}</div>}
      <button disabled={busy} onClick={submit} style={{ ...solidBtn, width: "100%", marginTop: 14, opacity: busy ? 0.6 : 1 }}>
        {busy ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
      </button>
      <div style={{ textAlign: "center", marginTop: 14, fontSize: 13 }}>
        {mode === "login" ? "New here? " : "Have an account? "}
        <span onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); }} style={{ color: TEAL, cursor: "pointer" }}>
          {mode === "login" ? "Create an account" : "Log in"}
        </span>
      </div>
    </div>
  );
}
