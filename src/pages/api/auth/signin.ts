export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Faltan credenciales de Supabase');
    }

    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: 'Email y contraseña son requeridos',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error de autenticación');
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const isProduction = import.meta.env.PROD;

    if (data.session?.access_token) {
      cookies.set('sb-access-token', data.session.access_token, {
        path: '/',
        secure: isProduction,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (data.session?.refresh_token) {
      cookies.set('sb-refresh-token', data.session.refresh_token, {
        path: '/',
        secure: isProduction,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    return redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error en signin:', error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
