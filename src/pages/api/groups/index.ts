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
      throw new Error("Faltan las credenciales de Supabase");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Intentando obtener grupos...");
    const { data: groups, error } = await supabase
      .from("tournament_group")
      .select("id, name")
      .eq("year", year)
      .order("name");

    if (error) {
      console.error("Error detallado de Supabase:", error);
      throw error;
    }

    console.log("Grupos obtenidos:", groups);
    return new Response(JSON.stringify(groups || []), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error completo en GET /api/groups:", error);
    return new Response(JSON.stringify({ 
      error: "Error al obtener los grupos",
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