'use client';

import { createClient } from '@supabase/supabase-js';

/**
 * Browser client for the admin area — keeps the auth session in localStorage.
 * RLS: writes require the signed-in email to be in `admin_emails`.
 */
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, autoRefreshToken: true } }
);
