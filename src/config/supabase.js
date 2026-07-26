import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // PKCE is required for OAuth code exchange
    flowType:          'pkce',
    // Automatically detect and restore sessions from URL
    detectSessionInUrl: true,
    // Persist session in localStorage
    persistSession:     true,
    autoRefreshToken:   true,
  },
});
