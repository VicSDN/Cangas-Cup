import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
  try {
    const matchId = params.id;
    console.log('Getting match data for ID:', matchId);
    
    if (!matchId) {
      return new Response(JSON.stringify({ error: 'Match ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const parsedMatchId = parseInt(matchId, 10);
    if (isNaN(parsedMatchId)) {
      return new Response(JSON.stringify({ error: 'Invalid Match ID format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: match, error } = await supabase
      .from('tournament_match')
      .select('*')
      .eq('id', parsedMatchId)
      .single();

    if (error) {
      console.error('Error fetching match:', error);
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Match not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw new Error(error.message);
    }

    console.log('Match data retrieved:', match);

    return new Response(JSON.stringify(match), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in GET match endpoint:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
