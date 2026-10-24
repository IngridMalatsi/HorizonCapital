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
    const isLocalDevelopmentUrl = import.meta.env.DEV
      && parsed.protocol === 'http:'
      && ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
    return (parsed.protocol === 'https:' || isLocalDevelopmentUrl)
      && Boolean(parsed.host)
      && !parsed.username
      && !parsed.password;
  } catch {
    return false;
  }
}

export const supabaseConfigError = !url || !key
  ? ''
  : !isValidSupabaseUrl(url)
    ? 'Use an HTTPS Supabase Project URL. HTTP is allowed only for localhost during development.'
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
