// src/types/tournament.ts

export interface DatabaseBase {
  id: number;
  year: number;
}

export interface Team extends DatabaseBase {
  name: string;
  is_local?: boolean;
}

export interface Group extends DatabaseBase {
  name: string;
}

export interface Match extends DatabaseBase {
  home_team: number;
  away_team: number;
  group_id: number | null;
  match_date: string;
  home_score: number | null;
  away_score: number | null;
  match_stage: string;
  round_name: string | null;
  is_local_final: boolean;
  home_team_match_fouls?: number | null; // Faltas del equipo local en ESTE partido
  away_team_match_fouls?: number | null; // Faltas del equipo visitante en ESTE partido
}

// Este es el 'OriginalTransformedMatch' que importas
export interface TransformedMatchBase { 
  id: number;
  display_date: string;
  home_team_id: number;
  away_team_id: number;
  home_team_name: string;
  away_team_name: string;
  group_id: number | null;
  group_name: string | null;
  home_score: number | null;
  away_score: number | null;
  match_stage: string;
  round_name: string | null;
  is_local_final: boolean;
}

export interface Player extends DatabaseBase {
  name: string;
  second_name?: string | null;
  team_id: number;
  team?: { name: string } | null; 
  team_name?: string; 
}

export interface Card {
  id?: number;
  match_id: number;
  player_id: number;
  team_id: number;
  type: 'Amarilla' | 'Roja';
  minute: number;
  year: number;
  player_name?: string;
  team_name?: string;
  player?: { id: number; name: string; second_name?: string | null } | null; 
  team?: { id: number; name: string } | null;
}

export interface CreateCardPayload {
  match_id: number;
  player_id: number;
  team_id: number;
  type: 'Amarilla' | 'Roja';
  minute: number;
  year: number;
}

export interface UpdateMatchTeamFoulsPayload {
    match_id: number;
    home_fouls: number;
    away_fouls: number;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
  details?: any;
}