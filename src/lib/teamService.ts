// src/lib/teamService.ts
import { supabase } from './supabase';

export interface Team {
  id: number;
  name: string;
  group_id: number;
  year: number;
}

export async function getAllTeams(): Promise<Team[]> {
  try {
    const { data, error } = await supabase.from('tournament_team').select('*');

    if (error) {
      console.error('Error fetching all teams:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching all teams:', error);
    return [];
  }
}

export async function getTotalTeams(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('tournament_team')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching total teams:', error.message);
      return 0;
    }

    return count ?? 0;
  } catch (error) {
    console.error('Unexpected error fetching total teams:', error);
    return 0;
  }
}

export async function updateTeam(id: number, updates: Partial<Team>): Promise<Team | null> {
  try {
    const { data, error } = await supabase
      .from('tournament_team')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating team with ID ${id}:`, error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Unexpected error updating team with ID ${id}:`, error);
    return null;
  }
}

export async function deleteTeam(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from('tournament_team').delete().eq('id', id);

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
