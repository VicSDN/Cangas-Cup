import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get("year") || "2025", 10);

    console.log("URL de Supabase:", supabaseUrl);
    console.log("Año:", year);

    if (!supabaseUrl || !supabaseKey) {
      console.error("Credenciales de Supabase no encontradas");
      throw new Error("Faltan las credenciales de Supabase");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar la conexión
    const { data: testData, error: testError } = await supabase
      .from("tournament_team")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("Error de conexión con Supabase:", testError);
      throw testError;
    }

    console.log("Conexión exitosa con Supabase");

    const { data: teams, error } = await supabase
      .from("tournament_team")
      .select("id, name")
      .eq("year", year)
      .order("name");

    if (error) {
      console.error("Error detallado de Supabase:", error);
      throw error;
    }

    console.log("Equipos obtenidos:", teams);
    return new Response(JSON.stringify(teams || []), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error completo en GET /api/teams:", error);
    return new Response(JSON.stringify({ 
      error: "Error al obtener los equipos",
      details: error instanceof Error ? error.message : "Error desconocido",
      stack: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}; 