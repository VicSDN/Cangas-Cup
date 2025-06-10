import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import type { Player } from '../../../types/tournament';

export const POST: APIRoute = async ({ request, url, cookies }) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'API: Supabase URL (VITE_SUPABASE_URL) o Anon Key (VITE_SUPABASE_ANON_KEY/VITE_SUPABASE_KEY) no están configuradas.'
    );
    return new Response(
      JSON.stringify({ message: 'Configuración del cliente Supabase incompleta.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const clientAccessToken = cookies.get('sb-access-token')?.value;

  if (!clientAccessToken) {
    return new Response(JSON.stringify({ message: 'No autenticado: Falta token de acceso.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUserClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${clientAccessToken}` } },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabaseUserClient.auth.getUser();
  if (authError || !user) {
    cookies.delete('sb-access-token', { path: '/' });
    cookies.delete('sb-refresh-token', { path: '/' });
    return new Response(
      JSON.stringify({ message: 'Autenticación fallida: Token inválido o sesión expirada.' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const playerId = url.searchParams.get('playerId');
  if (!playerId) {
    return new Response(JSON.stringify({ message: 'Falta el ID del jugador (playerId).' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const second_name_form = formData.get('second_name') as string | null;
    const teamIdString = formData.get('team_id') as string;
    const yearString = formData.get('year') as string;

    if (!name || name.trim() === '') {
      return new Response(JSON.stringify({ message: 'El nombre del jugador es requerido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let team_id: number;
    if (!teamIdString || teamIdString.trim() === '') {
      return new Response(JSON.stringify({ message: 'El ID del equipo es requerido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    team_id = parseInt(teamIdString, 10);
    if (isNaN(team_id)) {
      return new Response(
        JSON.stringify({ message: 'El ID del equipo proporcionado no es un número válido.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    let year: number;
    if (!yearString || yearString.trim() === '') {
      return new Response(JSON.stringify({ message: 'El año del jugador es requerido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    year = parseInt(yearString, 10);
    if (isNaN(year)) {
      return new Response(
        JSON.stringify({ message: 'El año del jugador proporcionado no es un número válido.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const updates: Partial<Omit<Player, 'id' | 'team' | 'team_name'>> & {
      second_name?: string | null;
    } = {
      name: name.trim(),
      team_id: team_id,
      year: year,
    };

    if (second_name_form && second_name_form.trim() !== '') {
      updates.second_name = second_name_form.trim();
    } else {
      updates.second_name = null;
    }

    const { data, error: updateError } = await supabaseUserClient
      .from('tournament_player')
      .update(updates)
      .eq('id', playerId)
      .select()
      .single();

    if (updateError) {
      console.error(
        `Error de Supabase (RLS?) al actualizar jugador ID ${playerId} por usuario ${user.id}:`,
        updateError
      );
      return new Response(
        JSON.stringify({
          message:
            updateError.message || 'Error al actualizar el jugador. Verifique permisos (RLS).',
        }),
        {
          status: updateError.code === 'PGRST200' || updateError.code === '42501' ? 403 : 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!data) {
      console.warn(
        `No se encontró el jugador con ID ${playerId} después de la actualización por usuario ${user.id} (posiblemente RLS).`
      );
      return new Response(
        JSON.stringify({
          error: `No se pudo actualizar o encontrar el jugador con ID ${playerId}. Verifique permisos.`,
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Jugador actualizado correctamente.', updatedPlayer: data }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error(
      `Error inesperado en API /api/players/update-player (usuario ${user?.id}):`,
      error
    );
    return new Response(
      JSON.stringify({
        message: error.message || 'Ocurrió un error interno en el servidor.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const ALL: APIRoute = ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: `Método ${request.method} no permitido.` }), {
      status: 405,
    });
  }
  return new Response(null, { status: 404 });
};
