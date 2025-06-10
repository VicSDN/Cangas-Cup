import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';
import type { Card, CreateCardPayload, ApiErrorResponse } from '../../../../types/tournament';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const matchId = url.searchParams.get('matchId');

  if (!matchId) {
    return new Response(
      JSON.stringify({ error: 'Falta el parámetro matchId' } as ApiErrorResponse),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const { data, error } = await supabase
      .from('tournament_card')
      .select<string, Card>(
        `
        id, match_id, player_id, team_id, type, minute, year,
        player:tournament_player!inner (id, name, second_name),
        team:tournament_team!inner (id, name)
      `
      )
      .eq('match_id', parseInt(matchId, 10))
      .order('minute');

    if (error) throw error;

    const formattedCards = (data || []).map((card) => ({
      ...card,
      player_name: `${card.player?.name || ''} ${card.player?.second_name || ''}`.trim(),
      team_name: card.team?.name || '',
    }));

    return new Response(JSON.stringify(formattedCards), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Error al cargar tarjetas',
        message: error.message,
      } as ApiErrorResponse),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = (await request.json()) as CreateCardPayload;

    if (
      !payload.match_id ||
      !payload.player_id ||
      !payload.team_id ||
      !payload.type ||
      payload.minute == null ||
      !payload.year
    ) {
      return new Response(
        JSON.stringify({ error: 'Datos incompletos para crear tarjeta' } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { data, error } = await supabase
      .from('tournament_card')
      .insert({
        match_id: payload.match_id,
        player_id: payload.player_id,
        team_id: payload.team_id,
        type: payload.type,
        minute: payload.minute,
        year: payload.year,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Error al crear tarjeta',
        message: error.message,
      } as ApiErrorResponse),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
