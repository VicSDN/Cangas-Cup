import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import type { ApiErrorResponse } from '../../../types/tournament';

interface AddPlayerPayload {
  name: string;
  second_name?: string | null;
  team_id: number;
  year: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = (await request.json()) as AddPlayerPayload;

    if (!payload.name || !payload.team_id || !payload.year) {
      return new Response(JSON.stringify({ error: "Nombre, ID de equipo y año son requeridos" } as ApiErrorResponse), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: teamExists, error: teamError } = await supabase
      .from('tournament_team')
      .select('id')
      .eq('id', payload.team_id)
      .eq('year', payload.year) 
      .maybeSingle();

    if (teamError) throw teamError;
    if (!teamExists) {
        return new Response(JSON.stringify({ error: `El equipo con ID ${payload.team_id} no existe para el año ${payload.year}` } as ApiErrorResponse), {
            status: 400, headers: { 'Content-Type': 'application/json' },
        });
    }

    const insertData: any = {
      name: payload.name,
      team_id: payload.team_id,
      year: payload.year,
    };
    if (payload.second_name) {
      insertData.second_name = payload.second_name;
    }

    const { data: newPlayer, error: insertError } = await supabase
      .from('tournament_player')
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      // Manejar errores específicos de la BD, como violaciones de unicidad si las tienes
      if (insertError.code === '23505') { // Código para unique_violation
         return new Response(JSON.stringify({ error: "Error: Ya existe un jugador con esos datos para ese equipo y año.", details: insertError.message } as ApiErrorResponse), {
            status: 409, headers: { 'Content-Type': 'application/json' }, // Conflict
        });
      }
      throw insertError;
    }

    return new Response(JSON.stringify(newPlayer), {
      status: 201, headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error creating player:', error);
    return new Response(JSON.stringify({ error: "Error interno al crear el jugador", message: error.message } as ApiErrorResponse), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};