import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export async function refreshSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    if (session) {
      const { data, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) throw refreshError;

      return data.session;
    }

    return null;
  } catch (error) {
    console.error('Error al renovar la sesión:', error);
    return null;
  }
}
