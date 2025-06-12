-- Migración para agregar soporte de penales en partidos de eliminatoria
-- Ejecutar en la base de datos Supabase

-- Agregar columna para indicar si el partido tuvo penales
ALTER TABLE tournament_match 
ADD COLUMN has_penalties BOOLEAN DEFAULT FALSE;

-- Agregar columna para los goles del equipo local en penales
ALTER TABLE tournament_match 
ADD COLUMN home_penalties INTEGER;

-- Agregar columna para los goles del equipo visitante en penales
ALTER TABLE tournament_match 
ADD COLUMN away_penalties INTEGER;

-- Agregar comentarios para documentar las nuevas columnas
COMMENT ON COLUMN tournament_match.has_penalties IS 'Indica si el partido se resolvió por penales (solo para eliminatorias)';
COMMENT ON COLUMN tournament_match.home_penalties IS 'Goles del equipo local en la tanda de penales';
COMMENT ON COLUMN tournament_match.away_penalties IS 'Goles del equipo visitante en la tanda de penales';

-- Agregar restricciones para validar los datos de penales
ALTER TABLE tournament_match 
ADD CONSTRAINT check_penalties_not_negative 
CHECK (home_penalties >= 0 AND away_penalties >= 0);

ALTER TABLE tournament_match 
ADD CONSTRAINT check_penalties_consistency 
CHECK (
  (has_penalties = FALSE AND home_penalties IS NULL AND away_penalties IS NULL) OR
  (has_penalties = TRUE AND home_penalties IS NOT NULL AND away_penalties IS NOT NULL AND home_penalties != away_penalties)
);

