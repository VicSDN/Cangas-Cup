import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';
import type { CreateGoalPayload, Goal } from '../../../../types/tournament';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const matchId = url.searchParams.get('matchId');

  if (!matchId) {
    return new Response(JSON.stringify({ message: 'Match ID es requerido' }), { status: 400 });
  }

  try {
    const { data: rawGoalsData, error } = await supabase
      .from('tournament_goal')
      .select(`
        id,
        match_id,
        player_id,
        team_id,
        goal_minute,
        year,
        player:tournament_player ( id, name, second_name ), 
        team:tournament_team ( id, name )
      `)
      .eq('match_id', parseInt(matchId))
      .order('goal_minute', { ascending: true, nullsFirst: false })
      .order('id', { ascending: true });

    if (error) {
      // Este error ahora se capturará aquí si es un error de Supabase
      console.error("Supabase error fetching goals (API):", error);
      // Devuelve el mensaje de error de Supabase al cliente para más detalles
      return new Response(JSON.stringify({ message: `Error de Supabase: ${error.message}` }), { status: 500 });
    }

    // Log para depuración (ahora debería funcionar)
    console.log("========= RAW GOALS DATA FROM SUPABASE (API) =========");
    console.log(JSON.stringify(rawGoalsData, null, 2));

    if (!rawGoalsData) {
        return new Response(JSON.stringify([]), { status: 200 });
    }

    const goals: Goal[] = rawGoalsData.map((g: any) => {
      let playerName = 'Jugador Desconocido';
      let teamName = 'Equipo Desconocido';

      if (g.player && Array.isArray(g.player) && g.player.length > 0) {
        const p = g.player[0];
        if (p && (p.name || p.second_name)) {
          playerName = `${p.name || ''} ${p.second_name || ''}`.trim();
        }
      } else if (g.player && typeof g.player === 'object' && !Array.isArray(g.player)) {
        const p = g.player;
        if (p && (p.name || p.second_name)) {
          playerName = `${p.name || ''} ${p.second_name || ''}`.trim();
        }
      }

      if (g.team && Array.isArray(g.team) && g.team.length > 0) {
        const t = g.team[0];
        if (t && t.name) {
          teamName = t.name;
        }
      } else if (g.team && typeof g.team === 'object' && !Array.isArray(g.team)) {
        const t = g.team;
        if (t && t.name) {
          teamName = t.name;
        }
      }
      
      return {
        id: g.id,
        match_id: g.match_id,
        player_id: g.player_id,
        team_id: g.team_id,
        goal_minute: g.goal_minute,
        year: g.year,
        player_name: playerName || 'Jugador Desconocido',
        team_name: teamName || 'Equipo Desconocido',
      };
    });

    return new Response(JSON.stringify(goals), { status: 200 });
  } catch (error: any) {
    // Captura otros errores inesperados en el bloque try/catch
    console.error("Error in GET /api/matches/goals (API):", error);
    return new Response(JSON.stringify({ message: error.message || 'Error al obtener goles' }), { status: 500 });
  }
};

// La función POST sigue igual que antes
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as CreateGoalPayload;
    const { match_id, player_id, team_id, goal_minute, year } = body;

    if (!match_id || !player_id || !team_id || !year) {
      return new Response(JSON.stringify({ message: 'Faltan campos requeridos (match_id, player_id, team_id, year)' }), { status: 400 });
    }
    
    const goalDataToInsert: any = {
      match_id,
      player_id,
      team_id,
      year,
    };
    if (goal_minute !== undefined && goal_minute !== null) {
      goalDataToInsert.goal_minute = goal_minute;
    } else {
      goalDataToInsert.goal_minute = null;
    }

    const { data, error } = await supabase
      .from('tournament_goal')
      .insert(goalDataToInsert)
      .select()
      .single();

    if (error) {
        console.error("Supabase error inserting goal (API):", error);
        return new Response(JSON.stringify({ message: `Error de Supabase al insertar: ${error.message}` }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/matches/goals (API):", error);
    return new Response(JSON.stringify({ message: error.message || 'Error al registrar el gol' }), { status: 500 });
  }
};