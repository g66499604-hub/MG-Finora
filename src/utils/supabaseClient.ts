import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseAnonKey.includes('your-anon-public-key')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export interface AuthSessionState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email?: string;
    displayName?: string;
    isOwner: boolean;
    role: 'owner' | 'admin' | 'member';
  } | null;
}

export const OWNER_EMAIL = 'mianmuhammadhassanjan2030@gmail.com';
export const OWNER_NAME = 'Mian Muhammad Hassan Jan';
export const COMPANY_NAME = 'M.M.H.J Tech';

export const isOwnerEmail = (email?: string): boolean => {
  if (!email) return false;
  return email.toLowerCase() === OWNER_EMAIL.toLowerCase();
};
