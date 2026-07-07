"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, hasSupabase } from "./config";

// Anon key only. Every query is constrained by RLS.
export function createClient() {
  if (!hasSupabase) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
