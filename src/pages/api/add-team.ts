export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase, getSession } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    console.log('Iniciando proceso de añadir equipo');
    const session = await getSession();
    if (!session) {
      console.error('No hay sesión activa');
      return new Response(
        JSON.stringify({
          error: 'No autenticado',
          details: 'Por favor, inicie sesión nuevamente'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await request.json();
    console.log('Datos recibidos:', data);
    
    const { name, group_id, location, year } = data;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return new Response(
        JSON.stringify({
          error: 'Datos inválidos',
          details: 'El nombre del equipo es requerido'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!group_id || isNaN(Number(group_id))) {
      return new Response(
        JSON.stringify({
          error: 'Datos inválidos',
          details: 'El ID del grupo es requerido y debe ser un número'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!location || typeof location !== 'string' || location.trim() === '') {
      return new Response(
        JSON.stringify({
          error: 'Datos inválidos',
          details: 'La localización es requerida'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (!year || isNaN(Number(year)) || year < 2000 || year > 2100) {
      return new Response(
        JSON.stringify({
          error: 'Datos inválidos',
          details: 'El año debe ser un número válido entre 2000 y 2100'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { data: groupExists, error: groupError } = await supabase
      .from('tournament_group')
      .select('id')
      .eq('id', group_id)
      .single();

    if (groupError || !groupExists) {
      console.error('Error o grupo no encontrado:', groupError);
      return new Response(
        JSON.stringify({
          error: 'Grupo no encontrado',
          details: 'El grupo especificado no existe'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { data: existingTeam, error: checkError } = await supabase
      .from('tournament_team')
      .select('id')
      .eq('name', name)
      .eq('year', year)
      .maybeSingle();

    if (checkError) {
      console.error('Error al verificar equipo existente:', checkError);
      throw checkError;
    }

    if (existingTeam) {
      return new Response(
        JSON.stringify({
          error: 'Equipo duplicado',
          details: 'Ya existe un equipo con ese nombre en este año'
        }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { data: team, error: insertError } = await supabase
      .from('tournament_team')
      .insert([
        {
          name: name.trim(),
          group_id,
          location,
          year
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error al insertar equipo:', insertError);
      throw insertError;
    }

    console.log('Equipo añadido exitosamente:', team);
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Equipo añadido correctamente',
        team
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error completo al añadir equipo:', error);
    return new Response(
      JSON.stringify({
        error: 'Error al añadir el equipo',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
