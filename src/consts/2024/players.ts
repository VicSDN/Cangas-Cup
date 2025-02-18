import { supabase } from "../../lib/supabase";

export async function getPlayerById(id: string) {
  const { data: player, error } = await supabase
    .from("player")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching player:", error);
    throw error;
  }

  return player;
}