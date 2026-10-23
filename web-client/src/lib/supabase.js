import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.VITE_SUPABASE_ANON_KEY
)?.trim();

function isValidSupabaseUrl(value) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return ['https:', 'http:'].includes(parsed.protocol) && Boolean(parsed.host) && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

export const supabaseConfigError = !url || !key
  ? ''
  : !isValidSupabaseUrl(url)
    ? 'The Supabase URL is invalid. Copy the Project URL from Supabase API settings; it should start with https://.'
    : '';

export const supabase = url && key && !supabaseConfigError
  ? createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  })
  : null;

export const supabaseConfigured = Boolean(supabase);
