import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (request.headers.get("Content-Type") !== "application/json") {
      return new Response(JSON.stringify({ error: 'Content-Type debe ser application/json' }), { status: 415 });
    }

    const body = await request.json();
    const { team_id } = body;

    if (!team_id) {
      return new Response(JSON.stringify({ error: 'Falta team_id.' }), { status: 400 });
    }
    
    const { error: rankingDeleteError } = await supabase
        .from('tournament_ranking')
        .delete()
        .eq('team_id', team_id);

    if (rankingDeleteError) {
        console.warn(`Advertencia al eliminar ranking para team_id ${team_id}:`, rankingDeleteError.message);
    }
    
    const { error: teamDeleteError } = await supabase
      .from('tournament_team')
      .delete()
      .eq('id', team_id);

    if (teamDeleteError) {
      console.error(`Supabase error deleting team ID ${team_id}:`, teamDeleteError);
      return new Response(JSON.stringify({ error: 'Error al eliminar el equipo de la base de datos.', details: teamDeleteError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Equipo eliminado con éxito.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('API error deleting team:', err);
    const errorMessage = err.message || 'Error interno del servidor.';
    return new Response(JSON.stringify({ error: "Error procesando la solicitud de eliminación.", details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const ALL: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({ error: `Método ${request.method} no permitido en esta ruta.` }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', 'Allow': 'POST' },
  });
};