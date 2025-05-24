import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import type { UpdateMatchTeamFoulsPayload, ApiErrorResponse } from '../../../types/tournament';

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = (await request.json()) as UpdateMatchTeamFoulsPayload;

    if (payload.match_id == null || payload.home_fouls == null || payload.away_fouls == null) {
      return new Response(JSON.stringify({ error: "Datos incompletos para actualizar faltas" } as ApiErrorResponse), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase
      .from('tournament_match')
      .update({
        home_team_match_fouls: payload.home_fouls,
        away_team_match_fouls: payload.away_fouls,
      })
      .eq('id', payload.match_id)
      .select('id, home_team_match_fouls, away_team_match_fouls')
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Error al actualizar faltas del partido", message: error.message } as ApiErrorResponse), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const matchId = url.searchParams.get('matchId');

    if (!matchId) {
        return new Response(JSON.stringify({ error: "Falta el parámetro matchId" } as ApiErrorResponse), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    try {
        const { data, error } = await supabase
            .from('tournament_match')
            .select('id, home_team_match_fouls, away_team_match_fouls')
            .eq('id', parseInt(matchId, 10))
            .single();

        if (error) {
          if (error.code === 'PGRST116') { 
             return new Response(JSON.stringify({ home_fouls: 0, away_fouls: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
          }
          throw error;
        }
        
        return new Response(JSON.stringify({
            home_fouls: data.home_team_match_fouls ?? 0,
            away_fouls: data.away_team_match_fouls ?? 0
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: "Error al cargar faltas del partido", message: error.message } as ApiErrorResponse), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};