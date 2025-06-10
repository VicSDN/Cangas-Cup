import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import type { UpdateMatchMvpPayload } from '../../../types/tournament';

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = (await request.json()) as UpdateMatchMvpPayload;

    if (!payload.match_id || !payload.year) {
      return new Response(JSON.stringify({ error: 'Match ID and year are required.' }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from('tournament_match')
      .update({
        home_team_mvp_player_id: payload.home_team_mvp_player_id,
        away_team_mvp_player_id: payload.away_team_mvp_player_id,
      })
      .eq('id', payload.match_id)
      .eq('year', payload.year)
      .select();

    if (error) {
      console.error('Error updating MVPs:', error);
      return new Response(JSON.stringify({ error: error.message || 'Failed to update MVPs.' }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'MVPs updated successfully.', data }), {
      status: 200,
    });
  } catch (e: any) {
    console.error('Server error updating MVPs:', e);
    return new Response(JSON.stringify({ error: e.message || 'An unexpected error occurred.' }), {
      status: 500,
    });
  }
};
