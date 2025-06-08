import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';
import type { ApiErrorResponse } from '../../../../types/tournament';

export const DELETE: APIRoute = async ({ params }) => {
  const cardId = params.cardId;
  console.log(`[API DELETE CARD] Attempting to delete cardId: ${cardId}`);

  if (!cardId) {
    console.error('[API DELETE CARD] Missing cardId');
    return new Response(JSON.stringify({ error: "Falta el ID de la tarjeta" } as ApiErrorResponse), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const numericCardId = parseInt(cardId, 10);
  if (isNaN(numericCardId)) {
    console.error(`[API DELETE CARD] Invalid numeric cardId: ${cardId}`);
    return new Response(JSON.stringify({ error: "ID de tarjeta inválido" } as ApiErrorResponse), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log(`[API DELETE CARD] Calling supabase.delete() for id: ${numericCardId}`);
    const { data, error, status, count } = await supabase 
      .from('tournament_card')
      .delete()
      .eq('id', numericCardId)
      .select(); 

    console.log('[API DELETE CARD] Supabase response:', { data, error, status, count });

    if (error) {
      console.error('[API DELETE CARD] Supabase error:', error);
      return new Response(JSON.stringify({ 
          error: "Error de Supabase al eliminar tarjeta", 
          message: error.message, 
          details: error.details, 
          hint: error.hint 
      } as ApiErrorResponse), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      });
    }
    if (count === 0 && status !== 404) { 
         console.warn(`[API DELETE CARD] Card with id ${numericCardId} not found or no rows affected, but no explicit error. Status: ${status}, Count: ${count}`);
    }


    console.log(`[API DELETE CARD] Successfully processed delete for cardId: ${numericCardId}. Status: ${status}`);
    return new Response(JSON.stringify({ message: "Tarjeta eliminada procesada", deletedCard: data }), { // Devolver 'data' si se usa .select()
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) { 
    console.error('[API DELETE CARD] Unhandled exception in API handler:', err);
    return new Response(JSON.stringify({ error: "Error interno del servidor", message: err.message } as ApiErrorResponse), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};