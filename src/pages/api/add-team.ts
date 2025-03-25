import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY as string;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, group_id, year } = await request.json();

    // Extraer el encabezado de autorización
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ message: "No se ha proporcionado el token de autenticación" }),
        { status: 401 }
      );
    }
    const token = authHeader.replace("Bearer ", "");

    // Crear un cliente Supabase con el token en los encabezados globales
    const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });

    // Verificar al usuario
    const { data: { user }, error: authError } = await supabaseAuthClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ message: "No se pudo verificar al usuario" }),
        { status: 401 }
      );
    }

    // Insertar el nuevo equipo
    const { data, error } = await supabaseAuthClient
      .from("tournament_team")
      .insert([{ name, group_id, year }]);

    if (error) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error interno" }), { status: 500 });
  }
};
