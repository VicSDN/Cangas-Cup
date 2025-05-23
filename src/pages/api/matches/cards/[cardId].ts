// src/pages/api/matches/cards/[cardId].ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';
import type { ApiErrorResponse } from '../../../../types/tournament';

export const DELETE: APIRoute = async ({ params }) => {
  const cardId = params.cardId;

  if (!cardId) {
    return new Response(JSON.stringify({ error: "Falta el ID de la tarjeta" } as ApiErrorResponse), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { error } = await supabase
      .from('tournament_card')
      .delete()
      .eq('id', parseInt(cardId, 10));

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Tarjeta eliminada correctamente" }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Error al eliminar tarjeta", message: error.message } as ApiErrorResponse), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};