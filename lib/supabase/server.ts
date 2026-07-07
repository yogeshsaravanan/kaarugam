import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createRawClient } from "@supabase/supabase-js";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
  hasServiceRole,
  hasSupabase,
} from "./config";

// RLS-aware server client bound to the user's session cookies. Reads only.
export function createSessionClient() {
  if (!hasSupabase) return null;
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list: { name: string; value: string; options?: any }[]) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* called from a Server Component render — ignore */
        }
      },
    },
  });
}

// TRUSTED client. Service role key bypasses RLS. Use ONLY on the server for
// order writes / payment state. Never import this into a client component.
export function createServiceClient() {
  if (!hasServiceRole) return null;
  return createRawClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getSessionUser() {
  const supabase = createSessionClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
