import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Anon client — safe for both server components and the browser (RLS enforced). */
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});
