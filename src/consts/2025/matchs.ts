import { supabase } from "../../lib/supabase";

export async function getMatchById2025(id: string) {
  const { data: team, error } = await supabase
    .from("tournament_match")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching match:", error);
    throw error;
  }

  return team;
}

export async function getTotalMatchs2025() {
  const { count, error } = await supabase
    .from("tournament_match")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching total matchs:", error);
    throw error;
  }

  return count;
}


export async function addMatch(matchData: any) {
    const { data, error } = await supabase.from("tournament_match").insert([matchData]);
    if (error) throw error;
    return data;
  }
  
  export async function updateMatch(id: string, updates: any) {
    const { data, error } = await supabase.from("tournament_match").update(updates).eq("id", id);
    if (error) throw error;
    return data;
  }
  
  export async function deleteMatch(id: string) {
    const { error } = await supabase.from("tournament_match").delete().eq("id", id);
    if (error) throw error;
  }