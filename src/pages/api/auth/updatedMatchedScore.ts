import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase'; 
import type { Match } from '../../../types/tournament'; 

export const POST: APIRoute = async ({ request }) => {
  const timestamp = new Date().toISOString();
  console.log(`[API][${timestamp}] Recibida petición POST a /api/updateMatchScore`);

  if (request.headers.get("Content-Type") !== "application/json") {
    console.warn(`[API][${timestamp}] Tipo de contenido incorrecto: ${request.headers.get("Content-Type")}`);
    return new Response(JSON.stringify({ error: 'Content-Type debe ser application/json' }), { status: 415 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    console.warn(`[API][${timestamp}] Error parseando JSON del body:`, e);
    return new Response(JSON.stringify({ error: 'Cuerpo de la petición inválido (no es JSON válido)' }), { status: 400 });
  }

  const { match_id, home_score, away_score } = body;

  console.log(`[API][${timestamp}] Datos recibidos:`, { match_id, home_score, away_score });

  if (match_id === undefined || home_score === undefined || away_score === undefined) {
    console.warn(`[API][${timestamp}] Faltan parámetros.`);
    return new Response(JSON.stringify({ error: 'Faltan parámetros requeridos: match_id, home_score, away_score' }), { status: 400 });
  }

  const numHomeScore = Number(home_score);
  const numAwayScore = Number(away_score);

  if (isNaN(numHomeScore) || isNaN(numAwayScore) || numHomeScore < 0 || numAwayScore < 0) {
    console.warn(`[API][${timestamp}] Scores inválidos.`);
    return new Response(JSON.stringify({ error: 'Los scores deben ser números enteros no negativos.' }), { status: 400 });
  }
  try {
    const { data, error } = await supabase
      .from('tournament_match')
      .update({ home_score: numHomeScore, away_score: numAwayScore })
      .eq('id', match_id)
      .select<string, Match>() 
      .single(); 

    if (error) {
      console.error(`[API][${timestamp}] Error de Supabase al actualizar partido ID ${match_id}:`, error);
      return new Response(JSON.stringify({ error: 'Error de base de datos al actualizar.', details: error.message }), { status: 500 });
    }

    if (!data) {
      console.warn(`[API][${timestamp}] No se encontró el partido ID ${match_id} para actualizar.`);
      return new Response(JSON.stringify({ error: `No se encontró el partido con ID ${match_id}.` }), { status: 404 });
    }

    console.log(`[API][${timestamp}] Partido ID ${match_id} actualizado correctamente.`, data);
    return new Response(JSON.stringify({ message: 'Resultado actualizado correctamente.', updatedMatch: data }), { status: 200 });

  } catch (e: any) {
    console.error(`[API][${timestamp}] Excepción inesperada en API updateMatchScore para partido ID ${match_id}:`, e);
    return new Response(JSON.stringify({ error: 'Error interno del servidor.', details: e.message }), { status: 500 });
  }
};

export const ALL: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({ error: `Método ${request.method} no permitido.` }), { status: 405 });
}