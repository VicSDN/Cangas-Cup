import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const { home_score, away_score } = body;

    if (!id || home_score === undefined || away_score === undefined) {
      return new Response(JSON.stringify({ 
        error: "Faltan campos requeridos",
        details: "Se requieren el ID del partido y los resultados"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Faltan las credenciales de Supabase");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Primero obtenemos el partido para verificar que existe
    const { data: match, error: fetchError } = await supabase
      .from("tournament_match")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error al obtener el partido:", fetchError);
      throw fetchError;
    }

    if (!match) {
      return new Response(JSON.stringify({ 
        error: "Partido no encontrado",
        details: "No se encontró el partido con el ID especificado"
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Actualizamos el resultado
    const { data, error: updateError } = await supabase
      .from("tournament_match")
      .update({
        home_score,
        away_score
      })
      .eq("id", id)
      .select();

    if (updateError) {
      console.error("Error al actualizar el resultado:", updateError);
      throw updateError;
    }

    return new Response(JSON.stringify(data[0]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error en POST /api/matches/[id]/score:", error);
    return new Response(JSON.stringify({ 
      error: "Error al actualizar el resultado",
      details: error instanceof Error ? error.message : "Error desconocido"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}; 