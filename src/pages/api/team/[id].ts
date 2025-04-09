import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    const teamData = await request.json();

    const { error } = await supabase
      .from('tournament_team')
      .update(teamData)
      .eq('id', id);

    if (error) {
      console.error('Error updating team:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Team updated successfully' }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Unexpected error updating team:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
