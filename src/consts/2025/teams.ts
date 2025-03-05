import { supabase } from "../../lib/supabase";

// Definir la interfaz para un equipo
export interface Team {
  id: number;
  name: string;
  group_id: number;
  year: number;
}

// Obtener todos los equipos
export async function getAllTeams(): Promise<Team[]> {
  try {
    const { data, error } = await supabase
      .from("tournament_team")
      .select("*");

    if (error) {
      console.error("Error fetching all teams:", error.message);
      return [];
    }

    return data || [];  // Regresar todos los equipos o un arreglo vacío si no hay resultados
  } catch (error) {
    console.error("Unexpected error fetching all teams:", error);
    return [];
  }
}

// Obtener el total de equipos en la tabla
export async function getTotalTeams(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("tournament_team")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching total teams:", error.message);
      return 0;
    }

    return count ?? 0;  // Regresar el número total de equipos
  } catch (error) {
    console.error("Unexpected error fetching total teams:", error);
    return 0;
  }
}

// Agregar un nuevo equipo
export async function addTeam(teamData: Omit<Team, "id">): Promise<Team | null> {
  try {
    const { data, error } = await supabase
      .from("tournament_team")
      .insert([teamData])
      .select()
      .single();

    if (error) {
      console.error("Error adding team:", error.message);
      return null;
    }

    return data;  // Regresar el equipo agregado
  } catch (error) {
    console.error("Unexpected error adding team:", error);
    return null;
  }
}

// Actualizar la información de un equipo
export async function updateTeam(id: number, updates: Partial<Team>): Promise<Team | null> {
  try {
    const { data, error } = await supabase
      .from("tournament_team")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating team with ID ${id}:`, error.message);
      return null;
    }

    return data;  // Regresar el equipo actualizado
  } catch (error) {
    console.error(`Unexpected error updating team with ID ${id}:`, error);
    return null;
  }
}

// Eliminar un equipo
export async function deleteTeam(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("tournament_team").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting team with ID ${id}:`, error.message);
      return false;
    }

    return true;  
  } catch (error) {
    console.error(`Unexpected error deleting team with ID ${id}:`, error);
    return false;
  }
}
