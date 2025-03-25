import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY as string;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, group_id, year } = await request.json();

    // Validar los datos
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ message: "El nombre del equipo es requerido" }),
        { status: 400 }
      );
    }

    if (!group_id || typeof group_id !== 'number' || group_id <= 0) {
      return new Response(
        JSON.stringify({ message: "El ID del grupo debe ser un número positivo" }),
        { status: 400 }
      );
    }

    if (!year || typeof year !== 'number' || year < 2000 || year > 2100) {
      return new Response(
        JSON.stringify({ message: "El año debe ser un número válido entre 2000 y 2100" }),
        { status: 400 }
      );
    }

    // Extraer el encabezado de autorización
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ message: "No se ha proporcionado el token de autenticación" }),
        { status: 401 }
      );
    }
    const token = authHeader.replace("Bearer ", "");

    // Crear un cliente Supabase con el token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    // Verificar al usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Error de autenticación:", authError);
      return new Response(
        JSON.stringify({ message: "No se pudo verificar al usuario" }),
        { status: 401 }
      );
    }

    // Verificar si el grupo existe
    const { data: groupExists, error: groupError } = await supabase
      .from("tournament_group")
      .select("id")
      .eq("id", group_id)
      .single();

    if (groupError || !groupExists) {
      return new Response(
        JSON.stringify({ message: "El grupo especificado no existe" }),
        { status: 400 }
      );
    }

    // Verificar si el equipo ya existe
    const { data: existingTeam, error: checkError } = await supabase
      .from("tournament_team")
      .select("id")
      .eq("name", name.trim())
      .eq("year", year)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 es "no se encontraron registros"
      console.error("Error al verificar equipo existente:", checkError);
      return new Response(
        JSON.stringify({ message: "Error al verificar si el equipo existe" }),
        { status: 500 }
      );
    }

    if (existingTeam) {
      return new Response(
        JSON.stringify({ message: "Ya existe un equipo con ese nombre en este año" }),
        { status: 400 }
      );
    }

    // Insertar el nuevo equipo
    const { data, error } = await supabase
      .from("tournament_team")
      .insert([{ 
        name: name.trim(),
        group_id,
        year
      }])
      .select()
      .single();

    if (error) {
      console.error("Error al insertar equipo:", error);
      return new Response(
        JSON.stringify({ 
          message: "Error al insertar el equipo",
          details: error.message
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: "Equipo creado exitosamente",
        data 
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Error en el endpoint add-team:", error);
    return new Response(
      JSON.stringify({ 
        message: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido"
      }),
      { status: 500 }
    );
  }
};
