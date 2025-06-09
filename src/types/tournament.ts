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
  home_team_match_fouls?: number | null; 
  away_team_match_fouls?: number | null; 
  home_team_mvp_player_id?: number | null;
  away_team_mvp_player_id?: number | null;
}

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
  home_team_mvp_player_id?: number | null;
  away_team_mvp_player_id?: number | null;
}

export interface UpdateMatchMvpPayload {
  match_id: number;
  home_team_mvp_player_id: number | null;
  away_team_mvp_player_id: number | null;
  year: number; 
}

export interface Player extends DatabaseBase {
  name: string;
  second_name?: string | null;
  team_id: number;
  team?: Team | null;
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

export interface RankingEntry {
  year: number | null; 
  group_id: number;
  team_id: number;
  points: number | null;
  games_played: number;
  goals_for: number | null;     
  goals_against: number | null;    
  goal_difference: number | bigint | null; 
  fair_play_points: number | null;
  fouls_committed: number | null;
  group_name: string;
  team_name: string;
  is_local?: boolean | null;
  h2h_points: number | string | bigint | null; 
  h2h_goal_difference: number | string | bigint | null;
  h2h_goals_for: number | string | bigint | null;
  overall_goal_difference: number | bigint | null; 
  overall_goals_for: number | bigint | null;     
  sort_key?: number; 
  position_in_group: number;
}

export interface Goal {
  id: number;
  match_id: number;
  player_id: number;
  team_id: number;
  goal_minute?: number | null;
  year: number;
  player_name?: string; 
  team_name?: string;  
}

export interface CreateGoalPayload {
  match_id: number;
  player_id: number;
  team_id: number;
  goal_minute?: number;
  year: number;
}