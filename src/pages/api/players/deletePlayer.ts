import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import type { ApiErrorResponse } from '../../../types/tournament'; 

export const POST: APIRoute = async ({ request }) => {
  try {
    const { player_id } = await request.json();

    if (!player_id) {
      return new Response(JSON.stringify({ error: "Falta player_id" } as ApiErrorResponse), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const { error } = await supabase
      .from('tournament_player')
      .delete()
      .eq('id', player_id);

    if (error) {
      console.error("Error deleting player from Supabase:", error);
      if (error.code && error.code.startsWith('23')) { 
         return new Response(JSON.stringify({ error: "No se puede eliminar el jugador porque tiene datos asociados (tarjetas, goles, etc.). Elimina esos datos primero o configura eliminación en cascada.", details: error.message } as ApiErrorResponse), {
          status: 409, 
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }

    return new Response(JSON.stringify({ message: "Jugador eliminado correctamente" }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error deleting player:', error);
    return new Response(JSON.stringify({ error: "Error interno al eliminar el jugador", message: error.message } as ApiErrorResponse), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};