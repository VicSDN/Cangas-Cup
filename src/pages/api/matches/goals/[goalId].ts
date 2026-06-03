import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';
import type { ApiErrorResponse } from '../../../../types/tournament';

export const DELETE: APIRoute = async ({ params, request }) => {
  const goalIdFromParams = params.goalId;

  if (!goalIdFromParams || goalIdFromParams === 'undefined' || goalIdFromParams.trim() === '') {
    console.error(
      '[BACKEND GOALS DELETE] Invalid goalId (undefined, empty, or not provided):',
      goalIdFromParams
    );
    return new Response(
      JSON.stringify({ error: 'Falta el ID del gol o es inválido' } as ApiErrorResponse),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const numericGoalId = parseInt(goalIdFromParams, 10);
  if (isNaN(numericGoalId)) {
    console.error(`[BACKEND GOALS DELETE] Goal ID '${goalIdFromParams}' is not a valid number.`);
    return new Response(
      JSON.stringify({
        error: `El ID del gol '${goalIdFromParams}' no es un número válido.`,
      } as ApiErrorResponse),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const { error, count } = await supabase
      .from('tournament_goal')
      .delete()
      .eq('id', numericGoalId);

    if (error) {
      console.error('[BACKEND GOALS DELETE] Supabase error during delete:', error);
      return new Response(
        JSON.stringify({
          error: 'Error de base de datos al eliminar el gol',
          message: error.message,
          details: error.details,
          hint: error.hint,
        } as ApiErrorResponse),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ message: 'Gol eliminado correctamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[BACKEND GOALS DELETE] Unexpected error in handler:', error);
    return new Response(
      JSON.stringify({
        error: 'Error inesperado en el servidor al eliminar el gol',
        message: error.message,
      } as ApiErrorResponse),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
