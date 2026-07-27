import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL      || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType:           'pkce',
    detectSessionInUrl: true,  // SDK auto-exchanges the code from the URL
    persistSession:     true,
    autoRefreshToken:   true,
    storageKey:         'ashub-auth-token',
  },
});
