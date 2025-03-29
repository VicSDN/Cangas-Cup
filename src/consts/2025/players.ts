import { supabase } from '../../lib/supabase';

export async function getPlayerById2025(id: string) {
  const { data: player, error } = await supabase
    .from('tournament_player')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching player:', error);
    throw error;
  }

  return player;
}

export async function getAllPlayers2025() {
  const { data: players, error } = await supabase.from('tournament_player').select('*');

  if (error) {
    console.error('Error fetching players:', error);
    throw error;
  }

  return players;
}

export async function getTotalPlayers() {
  const { count, error } = await supabase
    .from('tournament_player')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching total players:', error);
    throw error;
  }

  return count;
}

export async function addPlayer(playerData: any) {
  const { data, error } = await supabase.from('tournament_player').insert([playerData]);
  if (error) throw error;
  return data;
}

export async function updatePlayer(id: string, updates: any) {
  const { data, error } = await supabase.from('tournament_player').update(updates).eq('id', id);
  if (error) throw error;
  return data;
}

export async function deletePlayer(id: string) {
  const { error } = await supabase.from('tournament_player').delete().eq('id', id);
  if (error) throw error;
}
