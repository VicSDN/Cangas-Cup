import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const { home_score, away_score } = body;

    console.log("Actualizando resultado del partido:", id);
    console.log("Nuevo resultado:", { home_score, away_score });

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
      throw new Error("Error al verificar el partido");
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

    console.log("Partido encontrado:", match);

    // Actualizamos el resultado
    const { data, error: updateError } = await supabase
      .from("tournament_match")
      .update({
        home_score,
        away_score
      })
      .eq("id", id)
      .select(`
        id,
        home_team,
        away_team,
        group_id,
        match_date,
        match_time,
        year,
        home_score,
        away_score,
        home_team:tournament_team!tournament_match_home_team_fkey(name),
        away_team:tournament_team!tournament_match_away_team_fkey(name),
        group:tournament_group!tournament_match_group_id_fkey(name)
      `);

    if (updateError) {
      console.error("Error al actualizar el resultado:", updateError);
      throw new Error("Error al actualizar el resultado");
    }

    console.log("Resultado actualizado exitosamente:", data);
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