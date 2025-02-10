import { supabase } from "../../db/supabase";

export async function getTeamById(id: string) {
  const { data: team, error } = await supabase
    .from("team")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching team:", error);
    throw error;
  }

  return team;
}