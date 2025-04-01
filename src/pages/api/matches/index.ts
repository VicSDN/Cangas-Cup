import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get('year') || '2025', 10);

    console.log('Año:', year);

    // Get auth tokens from cookies
    const accessToken = cookies.get('sb-access-token')?.value;
    const refreshToken = cookies.get('sb-refresh-token')?.value;

    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({
          error: 'No autenticado',
          details: 'No se encontró la sesión'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Set the session
    const { data: { session }, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    if (sessionError || !session) {
      cookies.delete('sb-access-token', { path: '/' });
      cookies.delete('sb-refresh-token', { path: '/' });
      return new Response(
        JSON.stringify({
          error: 'Sesión inválida',
          details: 'Por favor, inicie sesión nuevamente'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    const { data: matches, error: matchesError } = await supabase
      .from('tournament_match')
      .select(`
        id,
        match_date,
        match_time,
        year,
        home_score,
        away_score,
        home_team(name),
        away_team(name),
        tournament_group(name)
      `)
      .eq('year', year)
      .order('match_date', { ascending: false });
    if (matchesError) {
      console.error('Error detallado de Supabase:', matchesError);
      throw matchesError;
    }

    console.log('Partidos obtenidos:', matches || []);
    const transformedMatches = matches?.map(match => ({
      id: match.id,
      match_date: match.match_date,
      match_time: match.match_time,
      year: match.year,
      home_team_name: match.home_team?.name || 'Equipo no encontrado',
      away_team_name: match.away_team?.name || 'Equipo no encontrado',
      group_name: match.tournament_group?.name || 'Sin grupo',
      home_score: match.home_score,
      away_score: match.away_score
    })) || [];
    return new Response(JSON.stringify(transformedMatches), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error completo en GET /api/matches:', error);
    return new Response(
      JSON.stringify({
        error: 'Error al obtener los partidos',
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
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    console.log('Iniciando POST /api/matches');
    const body = await request.json();
    console.log('Datos recibidos:', body);

    const { home_team, away_team, group_id, match_date, year } = body;

    // Get auth tokens from cookies
    const accessToken = cookies.get('sb-access-token')?.value;
    const refreshToken = cookies.get('sb-refresh-token')?.value;

    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({
          error: 'No autenticado',
          details: 'No se encontró la sesión'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Set the session
    const { data: { session }, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    if (sessionError || !session) {
      cookies.delete('sb-access-token', { path: '/' });
      cookies.delete('sb-refresh-token', { path: '/' });
      return new Response(
        JSON.stringify({
          error: 'Sesión inválida',
          details: 'Por favor, inicie sesión nuevamente'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!home_team || !away_team || !group_id || !match_date || !year) {
      console.log('Faltan campos requeridos:', {
        home_team,
        away_team,
        group_id,
        match_date,
        year,
      });
      return new Response(
        JSON.stringify({
          error: 'Faltan campos requeridos',
          details: 'Todos los campos son obligatorios',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const numericGroupId = parseInt(group_id, 10);

    console.log('Verificando que los equipos pertenecen al grupo:', numericGroupId);
    console.log('IDs de equipos recibidos:', { home_team, away_team });

    const { data: groupData, error: groupError } = await supabase
      .from('tournament_group')
      .select('id, name')
      .eq('id', numericGroupId)
      .single();

    if (groupError || !groupData) {
      console.error('Error al verificar el grupo:', groupError);
      return new Response(
        JSON.stringify({
          error: 'Error al verificar el grupo',
          details: 'El grupo especificado no existe',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('Grupo encontrado:', groupData);

    const { data: homeTeamGroup, error: homeTeamError } = await supabase
      .from('tournament_team')
      .select('group_id, name')
      .eq('id', home_team)
      .single();

    const { data: awayTeamGroup, error: awayTeamError } = await supabase
      .from('tournament_team')
      .select('group_id, name')
      .eq('id', away_team)
      .single();

    console.log('Datos de equipos obtenidos:', {
      homeTeam: homeTeamGroup,
      awayTeam: awayTeamGroup,
    });

    if (homeTeamError || awayTeamError) {
      console.error('Error al verificar grupos de equipos:', { homeTeamError, awayTeamError });
      return new Response(
        JSON.stringify({
          error: 'Error al verificar los grupos de los equipos',
          details: homeTeamError?.message || awayTeamError?.message,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('Grupos de equipos:', {
      homeTeam: {
        id: home_team,
        name: homeTeamGroup?.name,
        group_id: homeTeamGroup?.group_id,
      },
      awayTeam: {
        id: away_team,
        name: awayTeamGroup?.name,
        group_id: awayTeamGroup?.group_id,
      },
      expectedGroup: {
        id: numericGroupId,
        name: groupData.name,
      },
    });

    if (!homeTeamGroup || !awayTeamGroup) {
      console.error('No se encontraron los equipos:', {
        homeTeam: homeTeamGroup,
        awayTeam: awayTeamGroup,
      });
      return new Response(
        JSON.stringify({
          error: 'No se encontraron los equipos',
          details: 'Uno o ambos equipos no existen en la base de datos',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (homeTeamGroup.group_id !== numericGroupId || awayTeamGroup.group_id !== numericGroupId) {
      console.error('Los equipos no pertenecen al grupo especificado:', {
        homeTeam: {
          id: home_team,
          name: homeTeamGroup.name,
          group_id: homeTeamGroup.group_id,
          expected_group: numericGroupId,
        },
        awayTeam: {
          id: away_team,
          name: awayTeamGroup.name,
          group_id: awayTeamGroup.group_id,
          expected_group: numericGroupId,
        },
      });
      return new Response(
        JSON.stringify({
          error: 'Los equipos seleccionados no pertenecen al grupo especificado',
          details: `Los equipos ${homeTeamGroup.name} y ${awayTeamGroup.name} deben pertenecer al grupo ${groupData.name}`,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { data: existingMatch, error: existingMatchError } = await supabase
      .from('tournament_match')
      .select('id')
      .eq('match_date', match_date)
      .eq('group_id', numericGroupId)
      .or(
        `home_team.eq.${home_team},away_team.eq.${home_team},home_team.eq.${away_team},away_team.eq.${away_team}`
      )
      .single();

    if (existingMatchError && existingMatchError.code !== 'PGRST116') {
      console.error('Error al verificar partido existente:', existingMatchError);
      throw new Error('Error al verificar partido existente');
    }

    if (existingMatch) {
      return new Response(
        JSON.stringify({
          error: 'Partido duplicado',
          details:
            'Ya existe un partido programado para esta fecha y hora con alguno de estos equipos',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('Intentando insertar partido');
    const { data: newMatch, error: createError } = await supabase
      .from('tournament_match')
      .insert([
        {
          home_team,
          away_team,
          group_id: numericGroupId,
          match_date: match_date || null,
          year,
          home_score: 0,
          away_score: 0
        }
      ])
      .select(`
        id,
        match_date,
        match_time,
        year,
        home_score,
        away_score,
        home_team(name),
        away_team(name),
        tournament_group(name)
      `)
      .single();
    if (createError) {
      console.error('Error de Supabase al insertar:', createError);
      throw createError;
    }

    console.log('Partido creado exitosamente:', newMatch);
    return new Response(
      JSON.stringify({
        ...newMatch,
        home_team_name: newMatch.home_team?.name || 'Equipo no encontrado',
        away_team_name: newMatch.away_team?.name || 'Equipo no encontrado',
        group_name: newMatch.tournament_group?.name || 'Sin grupo'
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error completo en POST /api/matches:', error);
    return new Response(
      JSON.stringify({
        error: 'Error al crear el partido',
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
