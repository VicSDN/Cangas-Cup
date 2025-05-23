// src/pages/api/matches/players.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import type { Player, ApiErrorResponse } from '../../../types/tournament';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const homeTeamId = url.searchParams.get('homeTeamId');
  const awayTeamId = url.searchParams.get('awayTeamId');
  const year = url.searchParams.get('year');

  if (!homeTeamId || !awayTeamId || !year) {
    return new Response(JSON.stringify({ error: "Faltan parámetros: homeTeamId, awayTeamId o year" } as ApiErrorResponse), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const teamIds = [parseInt(homeTeamId, 10), parseInt(awayTeamId, 10)];
    const currentYear = parseInt(year, 10);

    const { data: playersData, error: playersError } = await supabase
      .from('tournament_player')
      .select<string, Player>(`
        id, name, second_name, team_id, year,
        team:tournament_team!inner (name)
      `)
      .in('team_id', teamIds)
      .eq('year', currentYear)
      .order('team_id')
      .order('name');

    if (playersError) throw playersError;

    const formattedPlayers = (playersData || []).map((p: Player) => ({
        ...p,
        team_name: p.team?.name
    }));

    return new Response(JSON.stringify(formattedPlayers), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Error interno al cargar jugadores", message: error.message } as ApiErrorResponse), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};