import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      match_id,
      home_team,
      away_team,
      match_date,
      round_name,
      match_stage,
      group_id,
      is_local_final,
      year,
    } = body;

    console.log('Edit match request data:', { match_id, year, match_stage, group_id, home_team, away_team });

    if (!match_id || !year) {
      return new Response(JSON.stringify({ error: 'Match ID and year are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validaciones adicionales para partidos de grupos
    if (match_stage === 'Fase de Grupos') {
      if (!group_id) {
        return new Response(JSON.stringify({ error: 'Group ID is required for group stage matches' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (home_team && away_team && home_team === away_team) {
      return new Response(JSON.stringify({ error: 'Home team and away team cannot be the same' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verificar que el partido existe
    const { data: existingMatch, error: fetchError } = await supabase
      .from('tournament_match')
      .select('id, match_stage')
      .eq('id', match_id)
      .eq('year', year)
      .single();

    if (fetchError || !existingMatch) {
      return new Response(JSON.stringify({ error: 'Match not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build update object dynamically
    const updateData: any = {
      match_stage: match_stage || 'Fase de Grupos',
      is_local_final: is_local_final || false,
    };

    // Only include fields that have values
    if (home_team !== null && home_team !== undefined) updateData.home_team = home_team;
    if (away_team !== null && away_team !== undefined) updateData.away_team = away_team;
    if (match_date) {
      // Validar formato de fecha
      const dateObj = new Date(match_date);
      if (isNaN(dateObj.getTime())) {
        return new Response(JSON.stringify({ error: 'Invalid date format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      updateData.match_date = match_date;
    }
    if (round_name !== null && round_name !== undefined) updateData.round_name = round_name;
    if (group_id !== null && group_id !== undefined) updateData.group_id = group_id;

    console.log('Update data:', updateData);

    const { data, error } = await supabase
      .from('tournament_match')
      .update(updateData)
      .eq('id', match_id)
      .eq('year', year)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: 'No match was updated' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Match updated successfully:', data[0]);

    return new Response(JSON.stringify({ success: true, data: data[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in match edit endpoint:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
