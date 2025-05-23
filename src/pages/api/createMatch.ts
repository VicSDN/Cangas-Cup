import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {


  try {
    const body = await request.json();
    const {
      home_team,
      away_team,
      group_id,
      match_date, 
      year,
      match_stage,
      is_local_final
    } = body;

    if (!home_team || !away_team || !match_date || !year || !match_stage) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos.' }), { status: 400 });
    }

    if (home_team === away_team) {
        return new Response(JSON.stringify({ error: 'El equipo local y visitante no pueden ser el mismo.' }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('tournament_match')
      .insert([
        {
          home_team,
          away_team,
          group_id: group_id || null, 
          match_date,
          year,
          home_score: null, 
          away_score: null, 
          match_stage,
          is_local_final: is_local_final || false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating match:', error);
      return new Response(JSON.stringify({ error: 'Error al crear el partido.', details: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Partido creado con éxito', match: data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('API error creating match:', err);
    const errorMessage = err instanceof Error ? err.message : 'Error interno del servidor.';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const ALL: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({ error: `Método ${request.method} no permitido.` }), { status: 405 });
}