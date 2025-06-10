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

    if (!match_id || !year) {
      return new Response(JSON.stringify({ error: 'Match ID and year are required' }), {
        status: 400,
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
    if (match_date) updateData.match_date = match_date;
    if (round_name !== null && round_name !== undefined) updateData.round_name = round_name;
    if (group_id !== null && group_id !== undefined) updateData.group_id = group_id;

    const { data, error } = await supabase
      .from('tournament_match')
      .update(updateData)
      .eq('id', match_id)
      .eq('year', year)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
