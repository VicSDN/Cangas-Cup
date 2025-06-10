import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  try {
    const year = url.searchParams.get('year');
    if (!year) {
      return new Response(JSON.stringify({ error: 'Year parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: teams, error } = await supabase
      .from('tournament_team')
      .select('id, name')
      .eq('year', parseInt(year, 10))
      .order('name', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify(teams || []), {
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
