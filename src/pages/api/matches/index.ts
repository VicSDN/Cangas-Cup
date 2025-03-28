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

    // Consulta simplificada para obtener los partidos con sus relaciones
    const { data: matches, error } = await supabase
      .from("tournament_match")
      .select(`
        id,
        home_team,
        away_team,
        group_id,
        match_date,
        match_time,
        year,
        home_team:tournament_team!tournament_match_home_team_fkey(name),
        away_team:tournament_team!tournament_match_away_team_fkey(name),
        group:tournament_group!tournament_match_group_id_fkey(name)
      `)
      .eq("year", year)
      .order("match_date", { ascending: false });

    if (error) {
      console.error("Error detallado de Supabase:", error);
      throw error;
    }

    console.log("Partidos obtenidos:", matches || []);
    
    // Transformar los datos para que coincidan con la estructura esperada
    const transformedMatches = matches?.map(match => ({
      id: match.id,
      match_date: match.match_date,
      match_time: match.match_time,
      year: match.year,
      home_team_name: match.home_team?.name,
      away_team_name: match.away_team?.name,
      group_name: match.group?.name,
      home_score: null,
      away_score: null
    })) || [];

    return new Response(JSON.stringify(transformedMatches), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error completo en GET /api/matches:", error);
    return new Response(JSON.stringify({ 
      error: "Error al obtener los partidos",
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

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log("Iniciando POST /api/matches");
    const body = await request.json();
    console.log("Datos recibidos:", body);
    
    const { home_team, away_team, group_id, match_date, year } = body;

    if (!home_team || !away_team || !group_id || !match_date || !year) {
      console.log("Faltan campos requeridos:", { home_team, away_team, group_id, match_date, year });
      return new Response(JSON.stringify({ 
        error: "Faltan campos requeridos",
        details: "Todos los campos son obligatorios"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error("Credenciales de Supabase no encontradas");
      throw new Error("Faltan las credenciales de Supabase");
    }

    console.log("Creando cliente de Supabase");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar que los equipos pertenezcan al grupo seleccionado
    const { data: homeTeamData, error: homeTeamError } = await supabase
      .from("tournament_team")
      .select("group_id")
      .eq("id", home_team)
      .single();

    if (homeTeamError) {
      console.error("Error al obtener equipo local:", homeTeamError);
      throw new Error("Error al verificar el equipo local");
    }

    const { data: awayTeamData, error: awayTeamError } = await supabase
      .from("tournament_team")
      .select("group_id")
      .eq("id", away_team)
      .single();

    if (awayTeamError) {
      console.error("Error al obtener equipo visitante:", awayTeamError);
      throw new Error("Error al verificar el equipo visitante");
    }

    if (homeTeamData.group_id !== group_id || awayTeamData.group_id !== group_id) {
      console.error("Los equipos no pertenecen al grupo seleccionado");
      return new Response(JSON.stringify({ 
        error: "Grupo incorrecto",
        details: "Los equipos seleccionados no pertenecen al grupo especificado"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Verificar que no exista un partido programado para la misma fecha y hora
    const { data: existingMatch, error: existingMatchError } = await supabase
      .from("tournament_match")
      .select("id")
      .eq("match_date", match_date)
      .eq("group_id", group_id)
      .or(`home_team.eq.${home_team},away_team.eq.${home_team},home_team.eq.${away_team},away_team.eq.${away_team}`)
      .single();

    if (existingMatchError && existingMatchError.code !== "PGRST116") { // PGRST116 es "no se encontraron resultados"
      console.error("Error al verificar partido existente:", existingMatchError);
      throw new Error("Error al verificar partido existente");
    }

    if (existingMatch) {
      return new Response(JSON.stringify({ 
        error: "Partido duplicado",
        details: "Ya existe un partido programado para esta fecha y hora con alguno de estos equipos"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.log("Intentando insertar partido");
    const { data, error } = await supabase
      .from("tournament_match")
      .insert([
        {
          home_team,
          away_team,
          group_id,
          match_date: match_date || null,
          year,
          home_score: 0,
          away_score: 0
        },
      ])
      .select(`
        id,
        home_team,
        away_team,
        group_id,
        match_date,
        year,
        home_score,
        away_score,
        home_team:tournament_team!tournament_match_home_team_fkey(name),
        away_team:tournament_team!tournament_match_away_team_fkey(name),
        group:tournament_group!tournament_match_group_id_fkey(name)
      `);

    if (error) {
      console.error("Error de Supabase al insertar:", error);
      throw error;
    }

    console.log("Partido creado exitosamente:", data);
    return new Response(JSON.stringify(data[0]), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error completo en POST /api/matches:", error);
    return new Response(JSON.stringify({ 
      error: "Error al crear el partido",
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