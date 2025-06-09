-- Migration to fix the missing tables and columns that were causing the app to fail

-- 1. Add MVP columns to tournament_match table
ALTER TABLE tournament_match 
ADD COLUMN IF NOT EXISTS home_team_mvp_player_id INTEGER REFERENCES tournament_player(id),
ADD COLUMN IF NOT EXISTS away_team_mvp_player_id INTEGER REFERENCES tournament_player(id);

-- 2. Create tournament_awards table
CREATE TABLE IF NOT EXISTS tournament_awards (
    id SERIAL PRIMARY KEY,
    award_type VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    team_id INTEGER REFERENCES tournament_team(id),
    player_id INTEGER REFERENCES tournament_player(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(award_type, year) -- Each award type can only be given once per year
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournament_match_mvp_home ON tournament_match(home_team_mvp_player_id);
CREATE INDEX IF NOT EXISTS idx_tournament_match_mvp_away ON tournament_match(away_team_mvp_player_id);
CREATE INDEX IF NOT EXISTS idx_tournament_awards_year ON tournament_awards(year);
CREATE INDEX IF NOT EXISTS idx_tournament_awards_type ON tournament_awards(award_type);

-- 4. Add comments for documentation
COMMENT ON COLUMN tournament_match.home_team_mvp_player_id IS 'ID del jugador MVP del equipo local';
COMMENT ON COLUMN tournament_match.away_team_mvp_player_id IS 'ID del jugador MVP del equipo visitante';
COMMENT ON TABLE tournament_awards IS 'Tabla para almacenar los premios del torneo (campeón, mejor jugador, etc.)';
COMMENT ON COLUMN tournament_awards.award_type IS 'Tipo de premio: CampeonTorneo, SubcampeonTorneo, MejorJugador, etc.';

