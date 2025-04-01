import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Las variables de entorno no están disponibles');
  console.error('VITE_SUPABASE_URL:', supabaseUrl || 'No definida');
  console.error('VITE_SUPABASE_KEY:', supabaseKey ? 'Presente' : 'Ausente');
  throw new Error('Las variables de entorno no están disponibles');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', 'Presente');

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
    if (!session || !session.refresh_token) return null;

    const { data, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: session.refresh_token });

    if (refreshError) throw refreshError;

    return data.session;
  } catch (error) {
    console.error('Error al renovar la sesión:', error);
    return null;
  }
}

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error al obtener la sesión:', error);
    return null;
  }
}
