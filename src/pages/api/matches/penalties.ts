import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import type { ApiErrorResponse } from '../../../types/tournament';

interface UpdatePenaltiesPayload {
  match_id: number;
  has_penalties: boolean;
  home_penalties?: number | null;
  away_penalties?: number | null;
}

// Helper function to get group rankings
async function getGroupRankings(groupId: number, year: number) {
  const { data: rankingData, error } = await supabase
    .from('view_group_ranking_ordered')
    .select('team_id, position_in_group')
    .eq('group_id', groupId)
    .eq('year', year)
    .order('position_in_group', { ascending: true });

  if (error) {
    console.error('Error getting group rankings:', error);
    return [];
  }

  return rankingData || [];
}

// Helper function to check if all group matches are completed
async function areAllGroupMatchesCompleted(groupId: number, year: number) {
  const { data: groupMatches, error } = await supabase
    .from('tournament_match')
    .select('id, home_score, away_score')
    .eq('group_id', groupId)
    .eq('year', year)
    .eq('match_stage', 'Fase de Grupos');

  if (error) {
    console.error('Error checking group matches completion:', error);
    return false;
  }

  // Check if all matches have scores
  return groupMatches?.every(match => 
    match.home_score !== null && match.away_score !== null
  ) || false;
}

// Helper function to update teams that advance based on group positions
async function updateAdvancingTeamsFromGroup(groupId: number, year: number) {
  // Only update if all group matches are completed
  const allCompleted = await areAllGroupMatchesCompleted(groupId, year);
  if (!allCompleted) {
    console.log(`Group ${groupId} matches not all completed yet, skipping group advancement update`);
    return;
  }

  console.log(`All matches completed for group ${groupId}, updating group position advancements`);

  // Get the current rankings for this group
  const rankings = await getGroupRankings(groupId, year);
  
  if (rankings.length === 0) {
    console.log(`No rankings found for group ${groupId}`);
    return;
  }

  // Find matches that depend on positions from this group
  const { data: matchesToUpdate, error } = await supabase
    .from('tournament_match')
    .select('id, home_team_placeholder_type, away_team_placeholder_type, home_team_source_group_id, away_team_source_group_id, home_team_source_group_position, away_team_source_group_position')
    .eq('year', year)
    .or(`home_team_source_group_id.eq.${groupId},away_team_source_group_id.eq.${groupId}`);

  if (error) {
    console.error('Error finding matches to update from group positions:', error);
    return;
  }

  for (const match of matchesToUpdate || []) {
    const updates: any = {};
    
    // Update home team if it comes from this group
    if (match.home_team_source_group_id === groupId && match.home_team_placeholder_type === 'GROUP_POSITION') {
      const position = match.home_team_source_group_position;
      if (position && typeof position === 'number') {
        const teamAtPosition = rankings.find(r => r.position_in_group === position);
        if (teamAtPosition) {
          updates.home_team = teamAtPosition.team_id;
          console.log(`Setting home team for match ${match.id} to team ${teamAtPosition.team_id} (position ${position} in group ${groupId})`);
        }
      }
    }
    
    // Update away team if it comes from this group
    if (match.away_team_source_group_id === groupId && match.away_team_placeholder_type === 'GROUP_POSITION') {
      const position = match.away_team_source_group_position;
      if (position && typeof position === 'number') {
        const teamAtPosition = rankings.find(r => r.position_in_group === position);
        if (teamAtPosition) {
          updates.away_team = teamAtPosition.team_id;
          console.log(`Setting away team for match ${match.id} to team ${teamAtPosition.team_id} (position ${position} in group ${groupId})`);
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('tournament_match')
        .update(updates)
        .eq('id', match.id);
      
      if (updateError) {
        console.error(`Error updating group position team for match ${match.id}:`, updateError);
      } else {
        console.log(`Updated match ${match.id} with group position team(s):`, updates);
      }
    }
  }
}

// Helper function to update teams that advance based on match result including penalties
async function updateAdvancingTeamsWithPenalties(matchId: number, homeTeam: number, awayTeam: number, homeScore: number, awayScore: number, hasPenalties: boolean = false, homePenalties: number | null = null, awayPenalties: number | null = null) {
  // Determine winner and loser
  let winnerId: number;
  let loserId: number;
  
  if (hasPenalties && homePenalties !== null && awayPenalties !== null) {
    // Winner determined by penalties
    winnerId = homePenalties > awayPenalties ? homeTeam : awayTeam;
    loserId = homePenalties > awayPenalties ? awayTeam : homeTeam;
  } else {
    // Winner determined by regular time
    if (homeScore === awayScore) {
      // It's a draw, no automatic advancement in this case
      return;
    }
    winnerId = homeScore > awayScore ? homeTeam : awayTeam;
    loserId = homeScore > awayScore ? awayTeam : homeTeam;
  }

  // Find matches where this match's winner should advance
  const { data: matchesToUpdateWinner, error: winnerError } = await supabase
    .from('tournament_match')
    .select('id, home_team_source_match_id, away_team_source_match_id, home_team_placeholder_type, away_team_placeholder_type')
    .or(`home_team_source_match_id.eq.${matchId},away_team_source_match_id.eq.${matchId}`);

  if (winnerError) {
    console.error('Error finding matches to update with winner:', winnerError);
    return;
  }

  // Update matches where winner advances
  for (const match of matchesToUpdateWinner || []) {
    const updates: any = {};
    
    if (match.home_team_source_match_id === matchId && match.home_team_placeholder_type === 'WINNER_MATCH') {
      updates.home_team = winnerId;
    }
    if (match.away_team_source_match_id === matchId && match.away_team_placeholder_type === 'WINNER_MATCH') {
      updates.away_team = winnerId;
    }
    if (match.home_team_source_match_id === matchId && match.home_team_placeholder_type === 'LOSER_MATCH') {
      updates.home_team = loserId;
    }
    if (match.away_team_source_match_id === matchId && match.away_team_placeholder_type === 'LOSER_MATCH') {
      updates.away_team = loserId;
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('tournament_match')
        .update(updates)
        .eq('id', match.id);
      
      if (updateError) {
        console.error(`Error updating advancing team for match ${match.id}:`, updateError);
      } else {
        console.log(`Updated match ${match.id} with advancing team(s) from penalties:`, updates);
      }
    }
  }
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
      .select('id, has_penalties, home_penalties, away_penalties, home_team, away_team, home_score, away_score')
      .single();

    if (error) throw error;

    // Update advancing teams automatically when penalties are updated
    if (payload.has_penalties && data) {
      try {
        await updateAdvancingTeamsWithPenalties(
          payload.match_id, 
          data.home_team, 
          data.away_team, 
          data.home_score || 0, 
          data.away_score || 0,
          data.has_penalties || false,
          data.home_penalties,
          data.away_penalties
        );
      } catch (advanceError: any) {
        console.error(`Error updating advancing teams for match ${payload.match_id} with penalties:`, advanceError);
        // Don't fail the whole request if advancing teams update fails
      }
    }

    return new Response(JSON.stringify({
      id: data.id,
      has_penalties: data.has_penalties,
      home_penalties: data.home_penalties,
      away_penalties: data.away_penalties
    }), {
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

