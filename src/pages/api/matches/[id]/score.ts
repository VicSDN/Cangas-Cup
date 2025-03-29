import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const { home_score, away_score } = body;
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: 'No se ha proporcionado el token de autenticación',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    console.log('Actualizando resultado del partido:', id);
    console.log('Nuevo resultado:', { home_score, away_score });

    if (!id || home_score === undefined || away_score === undefined) {
      return new Response(
        JSON.stringify({
          error: 'Faltan campos requeridos',
          details: 'Se requieren el ID del partido y los resultados',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Credenciales de Supabase no encontradas');
      throw new Error('Faltan las credenciales de Supabase');
    }

    console.log('Creando cliente de Supabase');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Error de autenticación:', authError);
      return new Response(
        JSON.stringify({
          error: 'No se pudo verificar al usuario',
          details: authError?.message,
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('Intentando actualizar resultado...');
    const { error: updateError } = await supabase
      .from('tournament_match')
      .update({
        home_score,
        away_score,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error al actualizar el resultado:', updateError);
      return new Response(
        JSON.stringify({
          error: 'Error al actualizar el resultado',
          details: updateError.message,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { data, error: selectError } = await supabase
      .from('tournament_match')
      .select(
        `
        id,
        home_team,
        away_team,
        group_id,
        match_date,
        match_time,
        year,
        home_score,
        away_score
      `
      )
      .eq('id', id)
      .single();

    if (selectError) {
      console.error('Error al obtener el partido actualizado:', selectError);
      return new Response(
        JSON.stringify({
          error: 'Error al obtener el partido actualizado',
          details: selectError.message,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!data) {
      console.error('No se pudo obtener el partido actualizado');
      return new Response(
        JSON.stringify({
          error: 'Error al obtener el partido actualizado',
          details: 'No se pudo obtener el partido después de la actualización',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { data: homeTeam } = await supabase
      .from('tournament_team')
      .select('name')
      .eq('id', data.home_team)
      .single();

    const { data: awayTeam } = await supabase
      .from('tournament_team')
      .select('name')
      .eq('id', data.away_team)
      .single();

    const { data: group } = await supabase
      .from('tournament_group')
      .select('name')
      .eq('id', data.group_id)
      .single();

    const updatedMatch = {
      id: data.id,
      match_date: data.match_date,
      match_time: data.match_time,
      year: data.year,
      home_team_name: homeTeam?.name || 'Equipo no encontrado',
      away_team_name: awayTeam?.name || 'Equipo no encontrado',
      group_name: group?.name || 'Sin grupo',
      home_score: data.home_score,
      away_score: data.away_score,
    };

    console.log('Resultado actualizado exitosamente:', updatedMatch);
    return new Response(JSON.stringify(updatedMatch), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error en POST /api/matches/[id]/score:', error);
    return new Response(
      JSON.stringify({
        error: 'Error al actualizar el resultado',
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
