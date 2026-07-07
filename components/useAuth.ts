"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    supabase.auth.getUser().then(({ data }) => { setUser(data.user ?? null); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []); // eslint-disable-line

  return {
    user, ready, enabled: !!supabase,
    login: (email: string, password: string) => supabase!.auth.signInWithPassword({ email, password }),
    register: (email: string, password: string) => supabase!.auth.signUp({ email, password }),
    logout: () => supabase!.auth.signOut(),
  };
}
