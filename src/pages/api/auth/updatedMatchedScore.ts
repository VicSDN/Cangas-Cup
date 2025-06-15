import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import type { Match } from '../../../types/tournament';

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

// Helper function to update teams that advance based on match result
async function updateAdvancingTeams(matchId: number, homeTeam: number, awayTeam: number, homeScore: number, awayScore: number, hasPenalties: boolean = false, homePenalties: number | null = null, awayPenalties: number | null = null) {
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
        console.log(`Updated match ${match.id} with advancing team(s):`, updates);
      }
    }
  }
}

export const POST: APIRoute = async ({ request }) => {
  const timestamp = new Date().toISOString();

  if (request.headers.get('Content-Type') !== 'application/json') {
    return new Response(JSON.stringify({ error: 'Content-Type debe ser application/json' }), {
      status: 415,
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Cuerpo de la petición inválido (no es JSON válido)' }),
      { status: 400 }
    );
  }

  const { match_id, home_score, away_score } = body;

  if (match_id === undefined || home_score === undefined || away_score === undefined) {
    return new Response(
      JSON.stringify({ error: 'Faltan parámetros requeridos: match_id, home_score, away_score' }),
      { status: 400 }
    );
  }

  const numHomeScore = Number(home_score);
  const numAwayScore = Number(away_score);

  if (isNaN(numHomeScore) || isNaN(numAwayScore) || numHomeScore < 0 || numAwayScore < 0) {
    return new Response(
      JSON.stringify({ error: 'Los scores deben ser números enteros no negativos.' }),
      { status: 400 }
    );
  }
  try {
    const query = supabase
      .from('tournament_match')
      .update({ home_score: numHomeScore, away_score: numAwayScore })
      .eq('id', match_id);

    const { data, error } = await query.select<string, Match>().single();

    if (error) {
      console.error(
        `[API][${timestamp}] Error de Supabase al actualizar partido ID ${match_id}:`,
        error
      );
      return new Response(
        JSON.stringify({ error: 'Error de base de datos al actualizar.', details: error.message }),
        { status: 500 }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: `No se encontró el partido con ID ${match_id}.` }),
        { status: 404 }
      );
    }

    // Update advancing teams automatically
    try {
      // First, handle direct match-based advancement (winner/loser)
      await updateAdvancingTeams(
        match_id, 
        data.home_team, 
        data.away_team, 
        numHomeScore, 
        numAwayScore,
        data.has_penalties || false,
        data.home_penalties,
        data.away_penalties
      );

      // If this is a group stage match, also update group position-based advancement
      if (data.match_stage === 'Fase de Grupos' && data.group_id) {
        await updateAdvancingTeamsFromGroup(data.group_id, data.year);
      }
    } catch (advanceError: any) {
      console.error(`[API][${timestamp}] Error updating advancing teams for match ${match_id}:`, advanceError);
      // Don't fail the whole request if advancing teams update fails
    }

    return new Response(
      JSON.stringify({ message: 'Resultado actualizado correctamente.', updatedMatch: data }),
      { status: 200 }
    );
  } catch (e: any) {
    console.error(
      `[API][${timestamp}] Excepción inesperada en API updateMatchScore para partido ID ${match_id}:`,
      e
    );
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor.', details: e.message }),
      { status: 500 }
    );
  }
};

export const ALL: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({ error: `Método ${request.method} no permitido.` }), {
    status: 405,
  });
};
