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

    // Validaciones más específicas
    if (!payload.match_id || typeof payload.match_id !== 'number' || payload.match_id <= 0) {
      return new Response(
        JSON.stringify({ error: 'ID del partido requerido y debe ser un número válido' } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (!payload.player_id || typeof payload.player_id !== 'number' || payload.player_id <= 0) {
      return new Response(
        JSON.stringify({ error: 'ID del jugador requerido y debe ser un número válido' } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (!payload.team_id || typeof payload.team_id !== 'number' || payload.team_id <= 0) {
      return new Response(
        JSON.stringify({ error: 'ID del equipo requerido y debe ser un número válido' } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (!payload.type || (payload.type !== 'Amarilla' && payload.type !== 'Roja')) {
      return new Response(
        JSON.stringify({ error: 'Tipo de tarjeta debe ser "Amarilla" o "Roja"' } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (payload.minute == null || typeof payload.minute !== 'number' || payload.minute < 0 || payload.minute > 120) {
      return new Response(
        JSON.stringify({ error: 'El minuto debe ser un número entre 0 y 120' } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (!payload.year || typeof payload.year !== 'number' || payload.year <= 0) {
      return new Response(
        JSON.stringify({ error: 'Año requerido y debe ser un número válido' } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verificar que el jugador pertenece al equipo especificado
    const { data: playerCheck, error: playerError } = await supabase
      .from('tournament_player')
      .select('team_id')
      .eq('id', payload.player_id)
      .eq('year', payload.year)
      .single();

    if (playerError || !playerCheck) {
      return new Response(
        JSON.stringify({ error: 'Jugador no encontrado' } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (playerCheck.team_id !== payload.team_id) {
      return new Response(
        JSON.stringify({ error: 'El jugador no pertenece al equipo especificado' } as ApiErrorResponse),
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
