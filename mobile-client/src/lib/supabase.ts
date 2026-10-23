import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const key = (
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
)?.trim();

function isValidSupabaseUrl(value: string | undefined): value is string {
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

const secureStorage = {
  getItem: (storageKey: string) => SecureStore.getItemAsync(storageKey),
  setItem: (storageKey: string, value: string) => SecureStore.setItemAsync(storageKey, value),
  removeItem: (storageKey: string) => SecureStore.deleteItemAsync(storageKey),
};

export const supabase = url && key && !supabaseConfigError
  ? createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: secureStorage,
    },
  })
  : null;
