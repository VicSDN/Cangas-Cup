import { supabase } from "../../lib/supabase";

export async function getTeamById2025(id: string) {
  const { data: team, error } = await supabase
    .from("tournament_team")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching team:", error);
    throw error;
  }

  return team;
}

export async function getTotalTeams2025() {
  const { count, error } = await supabase
    .from("tournament_team")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching total teams:", error);
    throw error;
  }

  return count;
}

export async function addTeam(teamData: any) {
  const { data, error } = await supabase.from("tournament_team").insert([teamData]);
  if (error) throw error;
  return data;
}

export async function updateTeam(id: string, updates: any) {
  const { data, error } = await supabase.from("tournament_team").update(updates).eq("id", id);
  if (error) throw error;
  return data;
}

export async function deleteTeam(id: string) {
  const { error } = await supabase.from("tournament_team").delete().eq("id", id);
  if (error) throw error;
}