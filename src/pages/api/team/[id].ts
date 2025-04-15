import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      status: 400,
    });
  }

  const body = await request.json();
  const { name, group_id, location, points } = body;

  // Validate input
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return new Response(JSON.stringify({ error: 'Name is required and must be a non-empty string' }), {
      status: 400,
    });
  }
  if (!group_id || typeof group_id !== 'string' || group_id.trim() === '') {
    return new Response(JSON.stringify({ error: 'Group ID is required and must be a non-empty string' }), {
      status: 400,
    });
  }
  if (!location || typeof location !== 'string' || location.trim() === '') {
    return new Response(JSON.stringify({ error: 'Location is required and must be a non-empty string' }), {
      status: 400,
    });
  }
 

  // Check authentication (assuming Supabase SSR setup)
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { error } = await supabase
    .from('tournament_team')
    .update({
      name: name.trim(),
      group_id: group_id.trim(),
      location: location.trim(),
      points,
    })
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
};