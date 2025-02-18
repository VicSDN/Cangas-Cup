export const prerender = false; 

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    console.log("Content-Type:", request.headers.get("content-type"));

    const bodyText = await request.text();
    console.log("Body Text:", bodyText);

    const params = new URLSearchParams(bodyText);
    console.log("URLSearchParams:", params);

    const email = params.get("email");
    const password = params.get("password");

    console.log("Parsed Email:", email);
    console.log("Parsed Password:", password);

    if (!email || !password) {
      console.error("Email o contraseña faltantes.");
      return new Response("Email y contraseña son requeridos", { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error al iniciar sesión:", error);
      return new Response("Email o contraseña inválidos", { status: 401 });
    }

    const { session } = data;

    if (session) {
      cookies.set("sb-access-token", session.access_token, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });
      cookies.set("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });

      return redirect("/admin/dashboard");
    } else {
      console.error("No se pudo obtener la sesión del usuario.");
      return new Response("No se pudo obtener la sesión", { status: 500 });
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
};
