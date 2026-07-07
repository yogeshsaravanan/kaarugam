export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// When Supabase isn't configured, the app runs in catalogue "demo mode":
// product pages render from the bundled seed; auth/orders require real config.
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const hasServiceRole = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
