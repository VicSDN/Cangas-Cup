import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import type { ApiErrorResponse } from '../../../types/tournament';

interface UpdatePenaltiesPayload {
  match_id: number;
  has_penalties: boolean;
  home_penalties?: number | null;
  away_penalties?: number | null;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = (await request.json()) as UpdatePenaltiesPayload;

    if (payload.match_id == null) {
      return new Response(
        JSON.stringify({ error: 'ID del partido es requerido' } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verificar que el partido es de eliminatoria
    const { data: match, error: matchError } = await supabase
      .from('tournament_match')
      .select('match_stage')
      .eq('id', payload.match_id)
      .single();

    if (matchError) {
      return new Response(
        JSON.stringify({ error: 'Partido no encontrado', message: matchError.message } as ApiErrorResponse),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verificar que es un partido de eliminatoria
    const eliminatoryStages = ['Octavos de Final', 'Cuartos de Final', 'Semifinal', 'Tercer Puesto', 'Final'];
    if (!eliminatoryStages.includes(match.match_stage)) {
      return new Response(
        JSON.stringify({ error: 'Los penales solo están disponibles para partidos de eliminatoria' } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validar datos de penales
    if (payload.has_penalties) {
      if (payload.home_penalties == null || payload.away_penalties == null) {
        return new Response(
          JSON.stringify({ error: 'Si hay penales, debe especificar el resultado de ambos equipos' } as ApiErrorResponse),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (payload.home_penalties < 0 || payload.away_penalties < 0) {
        return new Response(
          JSON.stringify({ error: 'Los penales no pueden ser negativos' } as ApiErrorResponse),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (payload.home_penalties === payload.away_penalties) {
        return new Response(
          JSON.stringify({ error: 'Los penales no pueden terminar en empate' } as ApiErrorResponse),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    const updateData: any = {
      has_penalties: payload.has_penalties,
    };

    if (payload.has_penalties) {
      updateData.home_penalties = payload.home_penalties;
      updateData.away_penalties = payload.away_penalties;
    } else {
      updateData.home_penalties = null;
      updateData.away_penalties = null;
    }

    const { data, error } = await supabase
      .from('tournament_match')
      .update(updateData)
      .eq('id', payload.match_id)
      .select('id, has_penalties, home_penalties, away_penalties')
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Error al actualizar penales del partido',
        message: error.message,
      } as ApiErrorResponse),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const matchId = url.searchParams.get('matchId');

  if (!matchId) {
    return new Response(
      JSON.stringify({ error: 'Falta el parámetro matchId' } as ApiErrorResponse),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { data, error } = await supabase
      .from('tournament_match')
      .select('id, has_penalties, home_penalties, away_penalties, match_stage')
      .eq('id', parseInt(matchId, 10))
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ has_penalties: false, home_penalties: null, away_penalties: null }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }

    return new Response(
      JSON.stringify({
        has_penalties: data.has_penalties ?? false,
        home_penalties: data.home_penalties ?? null,
        away_penalties: data.away_penalties ?? null,
        match_stage: data.match_stage,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Error al cargar penales del partido',
        message: error.message,
      } as ApiErrorResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

