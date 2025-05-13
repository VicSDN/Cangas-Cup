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
}

export interface TransformedMatch {
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