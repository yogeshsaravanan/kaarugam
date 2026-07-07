import { createServiceClient, getSessionUser } from "@/lib/supabase/server";

export class AuthError extends Error {
  constructor(message: string, public status = 401) { super(message); }
}

export async function getRole(userId: string): Promise<string> {
  const sb = createServiceClient();
  if (!sb) return "customer";
  const { data } = await sb.from("profiles").select("role").eq("id", userId).maybeSingle();
  return data?.role ?? "customer";
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) throw new AuthError("Authentication required", 401);
  const role = await getRole(user.id);
  if (role !== "admin") throw new AuthError("Admin access required", 403);
  return user;
}
