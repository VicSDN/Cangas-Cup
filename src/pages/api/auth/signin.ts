export const prerender = false;

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan credenciales de Supabase");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    console.log("Iniciando proceso de autenticación");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Faltan credenciales de Supabase");
    }

    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Datos recibidos:", { email });

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: "Email y contraseña son requeridos",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Intentando autenticar con Supabase");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error de autenticación:", error);
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Autenticación exitosa");

    if (data.session?.access_token) {
      cookies.set("sb-access-token", data.session.access_token, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, 
      });
    }

    if (data.session?.refresh_token) {
      cookies.set("sb-refresh-token", data.session.refresh_token, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, 
      });
    }

    return redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error completo en signin:", error);
    return new Response(
      JSON.stringify({
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
        stack: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
