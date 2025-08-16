import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true';

let supabase: SupabaseClient | undefined;

export function supabaseClient() {
    if (typeof supabase === 'undefined') {
        supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);
    }
    return supabase;
}
