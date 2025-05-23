
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (request.headers.get("Content-Type") !== "application/json") {
      return new Response(JSON.stringify({ error: 'Content-Type debe ser application/json' }), { status: 415 });
    }

    const body = await request.json();
    const { match_id } = body;

    if (!match_id) {
      return new Response(JSON.stringify({ error: 'Falta match_id.' }), { status: 400 });
    }
    
    const { error: deleteMatchError } = await supabase
      .from('tournament_match')
      .delete()
      .eq('id', match_id);

    if (deleteMatchError) {
      console.error(`[API DELETE] Supabase error deleting match ID ${match_id}:`, deleteMatchError);
      return new Response(JSON.stringify({ error: 'Error al eliminar el partido de la base de datos.', details: deleteMatchError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Partido eliminado con éxito.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('[API DELETE] Excepción general en el endpoint:', err);
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