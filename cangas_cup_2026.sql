-- =============================================
-- LIMPIEZA PREVIA (borrar datos 2026 existentes)
-- Orden correcto respetando FKs:
--   partidos → jugadores → ranking → equipos → grupos
-- =============================================
DELETE FROM tournament_match   WHERE year = 2026;
DELETE FROM tournament_player  WHERE year = 2026;
DELETE FROM tournament_ranking WHERE year = 2026;
DELETE FROM tournament_team    WHERE year = 2026;
DELETE FROM tournament_group   WHERE year = 2026;

-- Sincronizar secuencias para evitar conflictos de PK
-- (necesario cuando ya existen filas de otros años)
SELECT setval(pg_get_serial_sequence('tournament_group',  'id'), COALESCE(MAX(id), 0)) FROM tournament_group;
SELECT setval(pg_get_serial_sequence('tournament_team',   'id'), COALESCE(MAX(id), 0)) FROM tournament_team;
SELECT setval(pg_get_serial_sequence('tournament_player', 'id'), COALESCE(MAX(id), 0)) FROM tournament_player;
SELECT setval(pg_get_serial_sequence('tournament_match',  'id'), COALESCE(MAX(id), 0)) FROM tournament_match;

-- =============================================
-- EQUIPOS (tournament_team)
-- =============================================
INSERT INTO tournament_team (name, year) VALUES ('RNF SALAS', 2026);
INSERT INTO tournament_team (name, year) VALUES ('GAMBETAS', 2026);
INSERT INTO tournament_team (name, year) VALUES ('GOB-LET', 2026);
INSERT INTO tournament_team (name, year) VALUES ('SPORTING GALÁCTICOS C.F.', 2026);
INSERT INTO tournament_team (name, year) VALUES ('BAR AZUL', 2026);
INSERT INTO tournament_team (name, year) VALUES ('CARNICERÍA VÍCTOR-KELTI', 2026);
INSERT INTO tournament_team (name, year) VALUES ('BUS NARCEA / EL CANGUÉS', 2026);
INSERT INTO tournament_team (name, year) VALUES ('CALEYA BY SLAVIC', 2026);
INSERT INTO tournament_team (name, year) VALUES ('TALLERES RAFAEL / CERVECERÍA KELTI', 2026);
INSERT INTO tournament_team (name, year) VALUES ('ORQUÍDEA REAL', 2026);
INSERT INTO tournament_team (name, year) VALUES ('CUCORALLYTEAM FS', 2026);
INSERT INTO tournament_team (name, year) VALUES ('O PALIQUE MONDOÑEDO', 2026);
INSERT INTO tournament_team (name, year) VALUES ('TRANSPORTES AGUADO FS', 2026);
INSERT INTO tournament_team (name, year) VALUES ('EL SALÓN DEL CAFÉ', 2026);
INSERT INTO tournament_team (name, year) VALUES ('SANJ', 2026);
INSERT INTO tournament_team (name, year) VALUES ('EPIKPEAK', 2026);

-- =============================================
-- JUGADORES (tournament_player)
-- =============================================
-- Equipo: RNF SALAS
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JOSEBA', 'GENARO GARCÍA', id, 2026 FROM tournament_team WHERE name = 'RNF SALAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MIGUEL', 'GARCÍA FERNÁNDEZ', id, 2026 FROM tournament_team WHERE name = 'RNF SALAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'VÍCTOR', 'VIGIL FERNÁNDEZ', id, 2026 FROM tournament_team WHERE name = 'RNF SALAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ANTONIO', 'RIESGO DIAZ', id, 2026 FROM tournament_team WHERE name = 'RNF SALAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DANIEL', 'OLIVAR CUERO', id, 2026 FROM tournament_team WHERE name = 'RNF SALAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DAVID', 'FERNÁNDEZ ARIAS', id, 2026 FROM tournament_team WHERE name = 'RNF SALAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'VÍCTOR', 'MANUEL RUBIO RIESGO', id, 2026 FROM tournament_team WHERE name = 'RNF SALAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JESÚS', 'FERNÁNDEZ GARCÍA', id, 2026 FROM tournament_team WHERE name = 'RNF SALAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JAIRO', 'FERNÁNDEZ GARCÍA', id, 2026 FROM tournament_team WHERE name = 'RNF SALAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JOSE', 'MANUEL GARCÍA RODRIGUEZ', id, 2026 FROM tournament_team WHERE name = 'RNF SALAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JOSE', 'MANUEL FERNANDEZ ARRANZ', id, 2026 FROM tournament_team WHERE name = 'RNF SALAS' AND year = 2026;
-- Equipo: GAMBETAS
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ANTONIO', 'FERNÁNDEZ MENÉNDEZ', id, 2026 FROM tournament_team WHERE name = 'GAMBETAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MAYKOL', 'GIRÓN ROSABAL', id, 2026 FROM tournament_team WHERE name = 'GAMBETAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'IVÁN', 'MUÑOZ RECIO', id, 2026 FROM tournament_team WHERE name = 'GAMBETAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'BRUNO', 'ARIAS FERNÁNDEZ', id, 2026 FROM tournament_team WHERE name = 'GAMBETAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'NAIM', 'METALSI PAREDES', id, 2026 FROM tournament_team WHERE name = 'GAMBETAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ADAM', 'METALSI PAREDES', id, 2026 FROM tournament_team WHERE name = 'GAMBETAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JOSE', 'ÁNGEL MOLERO BAUTISTA', id, 2026 FROM tournament_team WHERE name = 'GAMBETAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ANTONIO', 'QUESADA LÓPEZ', id, 2026 FROM tournament_team WHERE name = 'GAMBETAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'IVÁN', 'GEMES CANTOS', id, 2026 FROM tournament_team WHERE name = 'GAMBETAS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JAVIER', 'MONTES BURGOS', id, 2026 FROM tournament_team WHERE name = 'GAMBETAS' AND year = 2026;
-- Equipo: GOB-LET
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'NEL', 'CASTAÑO RON', id, 2026 FROM tournament_team WHERE name = 'GOB-LET' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MARTIN', 'GARCIA RUBIO', id, 2026 FROM tournament_team WHERE name = 'GOB-LET' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MIGUEL', 'RON MENDEZ', id, 2026 FROM tournament_team WHERE name = 'GOB-LET' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'RODRIGO', 'LOPEZ MARTINEZ', id, 2026 FROM tournament_team WHERE name = 'GOB-LET' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALEJANDRO', 'BRAVO GONZÁLEZ', id, 2026 FROM tournament_team WHERE name = 'GOB-LET' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'BORJA', 'GOMEZ LOPEZ', id, 2026 FROM tournament_team WHERE name = 'GOB-LET' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'PELAYO', 'GOMEZ FERNANDEZ', id, 2026 FROM tournament_team WHERE name = 'GOB-LET' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'IVÁN', 'ÁLVAREZ POZO', id, 2026 FROM tournament_team WHERE name = 'GOB-LET' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'PABLO', 'GONZÁLEZ LLANOS', id, 2026 FROM tournament_team WHERE name = 'GOB-LET' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'HUGO', 'JIMÉNEZ BERMEJO', id, 2026 FROM tournament_team WHERE name = 'GOB-LET' AND year = 2026;
-- Equipo: SPORTING GALÁCTICOS C.F.
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'RUBÉN', 'MORGA SÁENZ', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'EMMANUEL', 'LÓPEZ ROLDÁN', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ROBERT', 'IONUT DARÍE', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'FATAH', 'ED DERRAZ', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'KEVIN', 'DÁVILA', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ÓSCAR', 'MOUTINHO CABEZÓN', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'BIELAL', 'SAIDI KASSARI', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MOHAMMED', 'EDDERRAZ BEN TAYEB', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ANAS', 'BOUREGBA RFIGUE', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'CARLOS', 'CHAMUSCA', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JOSE', 'ORLANDO DOS SANTOS CLARA', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MOUHSIN', 'JEDDI', id, 2026 FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.' AND year = 2026;
-- Equipo: BAR AZUL
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'PABLO', 'ÁLVAREZ GONZÁLEZ', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'BAYRON', 'FERNÁNDEZ PÉREZ', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DYLAN', 'FERNÁNDEZ PEREZ', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'LUCAS', 'GALÁN DÍAZ (LUKAKU)', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'PABLO', 'MARTÍNEZ ÁLVAREZ', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALEJANDRO', 'RGUEZ ÁLVAREZ (JANITO)', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'PELAYO', 'ÁLVAREZ GONZÁLEZ (LASO)', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'RUBÉN', 'FERNÁNDEZ LÓPEZ', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ABEL', 'MENÉNDEZ CASTROSÍN', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'IKER', 'FUERTES COLLAR', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'HUGO', 'MENÉNDEZ CASTROSÍN', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DANIEL', 'RODRIGUEZ ÁLVAREZ', id, 2026 FROM tournament_team WHERE name = 'BAR AZUL' AND year = 2026;
-- Equipo: CARNICERÍA VÍCTOR-KELTI
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MARIO', 'ROBLES VALDÉS', id, 2026 FROM tournament_team WHERE name = 'CARNICERÍA VÍCTOR-KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JAVIER', 'AMOR GARCÍA', id, 2026 FROM tournament_team WHERE name = 'CARNICERÍA VÍCTOR-KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JAIRO', 'ALLER BRANDIDO', id, 2026 FROM tournament_team WHERE name = 'CARNICERÍA VÍCTOR-KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'HÉCTOR', 'LANA LLANOS', id, 2026 FROM tournament_team WHERE name = 'CARNICERÍA VÍCTOR-KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DAVID', 'VILLA DE LA VARGA', id, 2026 FROM tournament_team WHERE name = 'CARNICERÍA VÍCTOR-KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DIEGO', 'DE LA VARGA FERNÁNDEZ', id, 2026 FROM tournament_team WHERE name = 'CARNICERÍA VÍCTOR-KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'VICTOR', 'MURIAS MENÉNDEZ', id, 2026 FROM tournament_team WHERE name = 'CARNICERÍA VÍCTOR-KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'LEONEL', 'SNEIDER URREA RIVERA', id, 2026 FROM tournament_team WHERE name = 'CARNICERÍA VÍCTOR-KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'FELIPE', 'OTTO MENDES DA SILVA', id, 2026 FROM tournament_team WHERE name = 'CARNICERÍA VÍCTOR-KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MIKAEL', 'HENRIQUE DEON', id, 2026 FROM tournament_team WHERE name = 'CARNICERÍA VÍCTOR-KELTI' AND year = 2026;
-- Equipo: BUS NARCEA / EL CANGUÉS
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JORGE', 'DANIEL MENENDEZ ESTEVES', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALAN', 'GARCIA RODRIGUEZ', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DANIEL', 'RODRIGUEZ MARTINEZ', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'VICTOR', 'COMBARRO HIDALGO', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DANIEL', 'ALCAIDE SOTO', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MANUEL', 'FERNÁNDEZ VILLAMIL (BALA)', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'RICARDO', 'GONZALEZ FERNANDEZ', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'OLIVER', 'LOSAS FERNANDEZ', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALEJANDRO', 'FERNANDEZ BARRERO', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'LUIS', 'GARCÍA ÁLVAREZ (PARAJAS)', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MIGUEL', 'GONZÁLEZ MARCOS (VOLCÁN)', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JONATHAN', 'SUÁREZ VARELA (JONA)', id, 2026 FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS' AND year = 2026;
-- Equipo: CALEYA BY SLAVIC
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JAVIER', 'TORRES FERNÁNDEZ', id, 2026 FROM tournament_team WHERE name = 'CALEYA BY SLAVIC' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'RAÚL', 'RODRÍGUEZ GARCÍA', id, 2026 FROM tournament_team WHERE name = 'CALEYA BY SLAVIC' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'SERGIO', 'ÁLVAREZ RODRÍGUEZ', id, 2026 FROM tournament_team WHERE name = 'CALEYA BY SLAVIC' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'CÉSAR', 'MIRANDA ÁLVAREZ', id, 2026 FROM tournament_team WHERE name = 'CALEYA BY SLAVIC' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DANIEL', 'PÉREZ CARREÑO', id, 2026 FROM tournament_team WHERE name = 'CALEYA BY SLAVIC' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DIEGO', 'CIENFUEGOS ÁLVAREZ', id, 2026 FROM tournament_team WHERE name = 'CALEYA BY SLAVIC' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JESÚS', 'GARCÍA OLIVEIRA', id, 2026 FROM tournament_team WHERE name = 'CALEYA BY SLAVIC' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'PABLO', 'RODRÍGUEZ FERNÁNDEZ', id, 2026 FROM tournament_team WHERE name = 'CALEYA BY SLAVIC' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JOSE', 'MANUEL RODRÍGUEZ GARCÍA', id, 2026 FROM tournament_team WHERE name = 'CALEYA BY SLAVIC' AND year = 2026;
-- Equipo: TALLERES RAFAEL / CERVECERÍA KELTI
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JAVIER', 'LABANDEIRA VIGIL', id, 2026 FROM tournament_team WHERE name = 'TALLERES RAFAEL / CERVECERÍA KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'CARLOS', 'GARCÍA GARCÍA', id, 2026 FROM tournament_team WHERE name = 'TALLERES RAFAEL / CERVECERÍA KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'HUGO', 'FERNÁNDEZ GOMEZ', id, 2026 FROM tournament_team WHERE name = 'TALLERES RAFAEL / CERVECERÍA KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ERIK', 'CHACÓN LÓPEZ', id, 2026 FROM tournament_team WHERE name = 'TALLERES RAFAEL / CERVECERÍA KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALEJANDRO', 'DOMÍNGUEZ GIL', id, 2026 FROM tournament_team WHERE name = 'TALLERES RAFAEL / CERVECERÍA KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'RAÚL', 'ARIAS CHACÓN', id, 2026 FROM tournament_team WHERE name = 'TALLERES RAFAEL / CERVECERÍA KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DANIEL', 'FUENTE CARRO', id, 2026 FROM tournament_team WHERE name = 'TALLERES RAFAEL / CERVECERÍA KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'AITOR', 'MENÉNDEZ CORRAL', id, 2026 FROM tournament_team WHERE name = 'TALLERES RAFAEL / CERVECERÍA KELTI' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DIEGO', 'DACOSTA LAIZ', id, 2026 FROM tournament_team WHERE name = 'TALLERES RAFAEL / CERVECERÍA KELTI' AND year = 2026;
-- Equipo: ORQUÍDEA REAL
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'SILVERIO', 'QUESADA DOS REIS', id, 2026 FROM tournament_team WHERE name = 'ORQUÍDEA REAL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'GUILLERMO', 'JOSÉ QUESADA DOS REIS', id, 2026 FROM tournament_team WHERE name = 'ORQUÍDEA REAL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'SERGIO', 'LÓPEZ GARCÍA', id, 2026 FROM tournament_team WHERE name = 'ORQUÍDEA REAL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'DANIEL', 'ÁLVAREZ PRESA', id, 2026 FROM tournament_team WHERE name = 'ORQUÍDEA REAL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALBERTO', 'RODRIGUEZ FERNANDEZ', id, 2026 FROM tournament_team WHERE name = 'ORQUÍDEA REAL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MARCOS', 'ANTON MENENDEZ', id, 2026 FROM tournament_team WHERE name = 'ORQUÍDEA REAL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ÁLVARO', 'VALDERREY PÉREZ', id, 2026 FROM tournament_team WHERE name = 'ORQUÍDEA REAL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'BORJA', 'PÉREZ RAMOS', id, 2026 FROM tournament_team WHERE name = 'ORQUÍDEA REAL' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALBERTO', 'MARTÍNEZ VELASCO', id, 2026 FROM tournament_team WHERE name = 'ORQUÍDEA REAL' AND year = 2026;
-- Equipo: CUCORALLYTEAM FS
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ROBERTO', 'AMIGO MONTESERÍN', id, 2026 FROM tournament_team WHERE name = 'CUCORALLYTEAM FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MARIO', 'ÁLVAREZ GONZÁLEZ', id, 2026 FROM tournament_team WHERE name = 'CUCORALLYTEAM FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'RAÚL', 'AGUSTÍN SEBASTIÁN', id, 2026 FROM tournament_team WHERE name = 'CUCORALLYTEAM FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MANUEL', 'ÁLVAREZ GONZÁLEZ', id, 2026 FROM tournament_team WHERE name = 'CUCORALLYTEAM FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ANTONY', 'GONZÁLEZ ULLA', id, 2026 FROM tournament_team WHERE name = 'CUCORALLYTEAM FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'HUGO', 'ÁLVAREZ SUÁREZ', id, 2026 FROM tournament_team WHERE name = 'CUCORALLYTEAM FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALFONSO', 'GONZÁLEZ TOMÁS', id, 2026 FROM tournament_team WHERE name = 'CUCORALLYTEAM FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'FÉLIX', 'MACÍAS DIEGUEZ', id, 2026 FROM tournament_team WHERE name = 'CUCORALLYTEAM FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'NOÉ', 'BARRERO VEGA', id, 2026 FROM tournament_team WHERE name = 'CUCORALLYTEAM FS' AND year = 2026;
-- Equipo: O PALIQUE MONDOÑEDO
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'EDUARDO', 'SAAVEDRA CEBREIRO', id, 2026 FROM tournament_team WHERE name = 'O PALIQUE MONDOÑEDO' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'HELDER', 'GONSALVES SEMEDO', id, 2026 FROM tournament_team WHERE name = 'O PALIQUE MONDOÑEDO' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JESÚS', 'PRECIADO SÁNCHEZ', id, 2026 FROM tournament_team WHERE name = 'O PALIQUE MONDOÑEDO' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'NICHOLAS', 'LOPEZ CASTRO', id, 2026 FROM tournament_team WHERE name = 'O PALIQUE MONDOÑEDO' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'RENATO', 'RODRIGUES MONTEIRO', id, 2026 FROM tournament_team WHERE name = 'O PALIQUE MONDOÑEDO' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'CARLOS', 'CAYADO LÓPEZ', id, 2026 FROM tournament_team WHERE name = 'O PALIQUE MONDOÑEDO' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'IVÁN', 'LÓPEZ LÓPEZ', id, 2026 FROM tournament_team WHERE name = 'O PALIQUE MONDOÑEDO' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'BRUNO', 'SILVEN FERNÁNDEZ', id, 2026 FROM tournament_team WHERE name = 'O PALIQUE MONDOÑEDO' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'CHRISTIAN', 'RIVAS GARCÍA', id, 2026 FROM tournament_team WHERE name = 'O PALIQUE MONDOÑEDO' AND year = 2026;
-- Equipo: TRANSPORTES AGUADO FS
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'GABRIEL', 'RODRÍGUEZ MARTÍNEZ', id, 2026 FROM tournament_team WHERE name = 'TRANSPORTES AGUADO FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALEJANDRO', 'MEDINA COLORADO', id, 2026 FROM tournament_team WHERE name = 'TRANSPORTES AGUADO FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'BORJA', 'GONZÁLEZ GONZÁLEZ', id, 2026 FROM tournament_team WHERE name = 'TRANSPORTES AGUADO FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'NACHO', 'CANO ROBES', id, 2026 FROM tournament_team WHERE name = 'TRANSPORTES AGUADO FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'NOEL', 'AGUADO FERNÁNDEZ', id, 2026 FROM tournament_team WHERE name = 'TRANSPORTES AGUADO FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MANUEL', 'CELESTINO MAYO GARCÍA', id, 2026 FROM tournament_team WHERE name = 'TRANSPORTES AGUADO FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALEJANDRO', 'BUENO BERDASCO', id, 2026 FROM tournament_team WHERE name = 'TRANSPORTES AGUADO FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JUAN', 'GÓMEZ RODRÍGUEZ', id, 2026 FROM tournament_team WHERE name = 'TRANSPORTES AGUADO FS' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MOUNTASIR', 'LAHRI MHAJIB', id, 2026 FROM tournament_team WHERE name = 'TRANSPORTES AGUADO FS' AND year = 2026;
-- Equipo: EL SALÓN DEL CAFÉ
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'FERNANDO', 'MIGUEL LÓPEZ QUINTANA', id, 2026 FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALEXANDER', 'BAZ VICENTE', id, 2026 FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'RUBÉN', 'BAZ VICENTE', id, 2026 FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'RUBÉN', 'SÁNCHEZ MARTÍN', id, 2026 FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JOSE', 'MARÍA SÁNCHEZ GIL', id, 2026 FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JUAN', 'MANUEL SALVADOR CARRETO', id, 2026 FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ALEJANDRO', 'CHRISTIAN DE LA CALLE SANTOS', id, 2026 FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JESUS', 'CASTRO MELLADO', id, 2026 FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ADRIAN', 'BARBÓN SÁNCHEZ', id, 2026 FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'LUIS', 'ALFONSO SÁNCHEZ ROMO', id, 2026 FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JOSE', 'MARÍA SÁNCHEZ GIL', id, 2026 FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ' AND year = 2026;
-- Equipo: SANJ
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JON', 'ARRIETA PEREZ DE ONRAITA', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ENEKO', 'SUSO MORENO', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'IKER', 'ALFONSO SÁNCHEZ', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ION', 'MUGICA OCHOA DE ZUAZOLA', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ASIER', 'GONZÁLEZ CASTRO', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JULEN', 'ORUETA RUIZ DE HEREDIA', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MAROUAN', 'EL FAKIRI EL BASRI', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JOSEBA', 'SAINZ RUIZ DE GAUNA', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JON', 'BERGANZO ERRO', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'XABIER', 'RESANO MORCILLO', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JOKIN', 'MARQUINEZ SANCHEZ', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'IÑIGO', 'MORCILLO MTEZ DE ALEGRIA', id, 2026 FROM tournament_team WHERE name = 'SANJ' AND year = 2026;
-- Equipo: EPIKPEAK
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MARIO', 'RODRIGUEZ FERNANDEZ', id, 2026 FROM tournament_team WHERE name = 'EPIKPEAK' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'AMILCAR', 'RODRIGUEZ BOTO', id, 2026 FROM tournament_team WHERE name = 'EPIKPEAK' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'NÉSTOR', 'ARBAS REDONDO', id, 2026 FROM tournament_team WHERE name = 'EPIKPEAK' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ANDRES', 'MENENDEZ LOPEZ', id, 2026 FROM tournament_team WHERE name = 'EPIKPEAK' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'JORGE', 'RODRÍGUEZ LÓPEZ', id, 2026 FROM tournament_team WHERE name = 'EPIKPEAK' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MANUEL', 'ARBAS REDONDO', id, 2026 FROM tournament_team WHERE name = 'EPIKPEAK' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'PABLO', 'MENENDEZ FUENTE', id, 2026 FROM tournament_team WHERE name = 'EPIKPEAK' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'ENOL', 'ALVAREZ CEBRIAN (P)', id, 2026 FROM tournament_team WHERE name = 'EPIKPEAK' AND year = 2026;
INSERT INTO tournament_player (name, second_name, team_id, year) SELECT 'MANUEL', 'ÁLVAREZ RODRÍGUEZ', id, 2026 FROM tournament_team WHERE name = 'EPIKPEAK' AND year = 2026;

-- Total equipos iniciales: 16
-- Total jugadores: 163

-- =============================================
-- GRUPOS, EQUIPOS NUEVOS Y PARTIDOS
-- II CANGAS CUP 2026
-- =============================================
-- Ejecutar en Supabase SQL Editor (PostgreSQL)
-- Formato horario: hora local España verano (CEST = UTC+2)
-- =============================================

DO $$
DECLARE
  -- IDs de grupos
  v_grp_a   INTEGER;
  v_grp_b   INTEGER;
  v_grp_c   INTEGER;
  v_grp_d   INTEGER;
  v_grp_e   INTEGER;
  v_grp_f   INTEGER;
  v_grp_g   INTEGER;
  v_grp_h   INTEGER;

  -- IDs equipos existentes
  v_rnf_salas    INTEGER;
  v_gambetas     INTEGER;
  v_goblet       INTEGER;
  v_sporting     INTEGER;
  v_bar_azul     INTEGER;
  v_carniceria   INTEGER;
  v_bus_narcea   INTEGER;
  v_caleya       INTEGER;
  v_talleres     INTEGER;
  v_orquidea     INTEGER;
  v_cucorally    INTEGER;
  v_palique      INTEGER;
  v_t_aguado     INTEGER;
  v_salon_cafe   INTEGER;
  v_sanj         INTEGER;
  v_epikpeak     INTEGER;

  -- IDs equipos nuevos
  v_valles       INTEGER;
  v_abadia       INTEGER;
  v_gestoria     INTEGER;
  v_racing       INTEGER;
  v_exconar      INTEGER;
  v_astursim     INTEGER;
  v_pub_buddha   INTEGER;
  v_donango      INTEGER;

  -- IDs partidos Ronda 1
  v_m_a1  INTEGER;
  v_m_b1  INTEGER;
  v_m_c1  INTEGER;
  v_m_d1  INTEGER;
  v_m_e1  INTEGER;
  v_m_f1  INTEGER;
  v_m_g1  INTEGER;
  v_m_h1  INTEGER;

BEGIN

  -- =========================================
  -- 1. GRUPOS
  -- =========================================
  INSERT INTO tournament_group (name, year) VALUES ('GRUPO 1', 2026) RETURNING id INTO v_grp_a;
  INSERT INTO tournament_group (name, year) VALUES ('GRUPO 2', 2026) RETURNING id INTO v_grp_b;
  INSERT INTO tournament_group (name, year) VALUES ('GRUPO 3', 2026) RETURNING id INTO v_grp_c;
  INSERT INTO tournament_group (name, year) VALUES ('GRUPO 4', 2026) RETURNING id INTO v_grp_d;
  INSERT INTO tournament_group (name, year) VALUES ('GRUPO 5', 2026) RETURNING id INTO v_grp_e;
  INSERT INTO tournament_group (name, year) VALUES ('GRUPO 6', 2026) RETURNING id INTO v_grp_f;
  INSERT INTO tournament_group (name, year) VALUES ('GRUPO 7', 2026) RETURNING id INTO v_grp_g;
  INSERT INTO tournament_group (name, year) VALUES ('GRUPO 8', 2026) RETURNING id INTO v_grp_h;

  -- =========================================
  -- 2. EQUIPOS NUEVOS
  -- =========================================
  INSERT INTO tournament_team (name, year) VALUES ('VALLES DEL NARCEA FS', 2026) RETURNING id INTO v_valles;
  INSERT INTO tournament_team (name, year) VALUES ('ABADÍA DISCO-BAR',     2026) RETURNING id INTO v_abadia;
  INSERT INTO tournament_team (name, year) VALUES ('GESTORÍA CANAL',       2026) RETURNING id INTO v_gestoria;
  INSERT INTO tournament_team (name, year) VALUES ('RACING ALLANDÉS',      2026) RETURNING id INTO v_racing;
  INSERT INTO tournament_team (name, year) VALUES ('EXCONAR',              2026) RETURNING id INTO v_exconar;
  INSERT INTO tournament_team (name, year) VALUES ('ASTURSIM',             2026) RETURNING id INTO v_astursim;
  INSERT INTO tournament_team (name, year) VALUES ('PUB BUDDHA',           2026) RETURNING id INTO v_pub_buddha;
  INSERT INTO tournament_team (name, year) VALUES ('DOÑANGO',              2026) RETURNING id INTO v_donango;

  -- =========================================
  -- 3. IDs EQUIPOS YA EXISTENTES
  -- =========================================
  SELECT id INTO v_rnf_salas    FROM tournament_team WHERE name = 'RNF SALAS'                           AND year = 2026;
  SELECT id INTO v_gambetas     FROM tournament_team WHERE name = 'GAMBETAS'                            AND year = 2026;
  SELECT id INTO v_goblet       FROM tournament_team WHERE name = 'GOB-LET'                             AND year = 2026;
  SELECT id INTO v_sporting     FROM tournament_team WHERE name = 'SPORTING GALÁCTICOS C.F.'            AND year = 2026;
  SELECT id INTO v_bar_azul     FROM tournament_team WHERE name = 'BAR AZUL'                            AND year = 2026;
  SELECT id INTO v_carniceria   FROM tournament_team WHERE name = 'CARNICERÍA VÍCTOR-KELTI'             AND year = 2026;
  SELECT id INTO v_bus_narcea   FROM tournament_team WHERE name = 'BUS NARCEA / EL CANGUÉS'             AND year = 2026;
  SELECT id INTO v_caleya       FROM tournament_team WHERE name = 'CALEYA BY SLAVIC'                    AND year = 2026;
  SELECT id INTO v_talleres     FROM tournament_team WHERE name = 'TALLERES RAFAEL / CERVECERÍA KELTI'  AND year = 2026;
  SELECT id INTO v_orquidea     FROM tournament_team WHERE name = 'ORQUÍDEA REAL'                       AND year = 2026;
  SELECT id INTO v_cucorally    FROM tournament_team WHERE name = 'CUCORALLYTEAM FS'                    AND year = 2026;
  SELECT id INTO v_palique      FROM tournament_team WHERE name = 'O PALIQUE MONDOÑEDO'                 AND year = 2026;
  SELECT id INTO v_t_aguado     FROM tournament_team WHERE name = 'TRANSPORTES AGUADO FS'               AND year = 2026;
  SELECT id INTO v_salon_cafe   FROM tournament_team WHERE name = 'EL SALÓN DEL CAFÉ'                   AND year = 2026;
  SELECT id INTO v_sanj         FROM tournament_team WHERE name = 'SANJ'                                AND year = 2026;
  SELECT id INTO v_epikpeak     FROM tournament_team WHERE name = 'EPIKPEAK'                            AND year = 2026;

  -- =========================================
  -- 4. ASIGNACIÓN DE EQUIPOS A GRUPOS
  -- =========================================
  -- GRUPO 1: RNF SALAS · CUCORALLYTEAM FS · ASTURSIM
  UPDATE tournament_team SET group_id = v_grp_a WHERE id IN (v_rnf_salas, v_cucorally, v_astursim);
  -- GRUPO 2: VALLES DEL NARCEA FS · GOB-LET · SPORTING GALÁCTICOS C.F.
  UPDATE tournament_team SET group_id = v_grp_b WHERE id IN (v_valles, v_goblet, v_sporting);
  -- GRUPO 3: ABADÍA DISCO-BAR · BUS NARCEA / EL CANGUÉS · CARNICERÍA VÍCTOR-KELTI
  UPDATE tournament_team SET group_id = v_grp_c WHERE id IN (v_abadia, v_bus_narcea, v_carniceria);
  -- GRUPO 4: CALEYA BY SLAVIC · SANJ · GAMBETAS
  UPDATE tournament_team SET group_id = v_grp_d WHERE id IN (v_caleya, v_sanj, v_gambetas);
  -- GRUPO 5: TALLERES RAFAEL / CERVECERÍA KELTI · TRANSPORTES AGUADO FS · PUB BUDDHA
  UPDATE tournament_team SET group_id = v_grp_e WHERE id IN (v_talleres, v_t_aguado, v_pub_buddha);
  -- GRUPO 6: GESTORÍA CANAL · RACING ALLANDÉS · O PALIQUE MONDOÑEDO
  UPDATE tournament_team SET group_id = v_grp_f WHERE id IN (v_gestoria, v_racing, v_palique);
  -- GRUPO 7: EXCONAR · BAR AZUL · DOÑANGO
  UPDATE tournament_team SET group_id = v_grp_g WHERE id IN (v_exconar, v_bar_azul, v_donango);
  -- GRUPO 8: ORQUÍDEA REAL · EPIKPEAK · EL SALÓN DEL CAFÉ
  UPDATE tournament_team SET group_id = v_grp_h WHERE id IN (v_orquidea, v_epikpeak, v_salon_cafe);

  -- =========================================
  -- 5. RONDA 1 — PRIMER PARTIDO DE CADA GRUPO
  --    Ambos equipos conocidos desde el principio
  -- =========================================

  -- GRUPO 2 — Viernes 12/06 22:00
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final, round_name)
  VALUES
    (v_valles, v_goblet, v_grp_b, '2026-06-12T22:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false, '1er Partido Grupo 2')
  RETURNING id INTO v_m_b1;

  -- GRUPO 1 — Viernes 12/06 23:00
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final, round_name)
  VALUES
    (v_rnf_salas, v_cucorally, v_grp_a, '2026-06-12T23:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false, '1er Partido Grupo 1')
  RETURNING id INTO v_m_a1;

  -- GRUPO 3 — Sábado 13/06 00:00
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final, round_name)
  VALUES
    (v_abadia, v_bus_narcea, v_grp_c, '2026-06-13T00:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false, '1er Partido Grupo 3')
  RETURNING id INTO v_m_c1;

  -- GRUPO 4 — Sábado 13/06 01:00
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final, round_name)
  VALUES
    (v_caleya, v_sanj, v_grp_d, '2026-06-13T01:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false, '1er Partido Grupo 4')
  RETURNING id INTO v_m_d1;

  -- GRUPO 6 — Sábado 13/06 02:00
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final, round_name)
  VALUES
    (v_gestoria, v_racing, v_grp_f, '2026-06-13T02:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false, '1er Partido Grupo 6')
  RETURNING id INTO v_m_f1;

  -- GRUPO 5 — Sábado 13/06 03:00
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final, round_name)
  VALUES
    (v_talleres, v_t_aguado, v_grp_e, '2026-06-13T03:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false, '1er Partido Grupo 5')
  RETURNING id INTO v_m_e1;

  -- GRUPO 7 — Sábado 13/06 04:00
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final, round_name)
  VALUES
    (v_exconar, v_bar_azul, v_grp_g, '2026-06-13T04:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false, '1er Partido Grupo 7')
  RETURNING id INTO v_m_g1;

  -- GRUPO 8 — Sábado 13/06 05:00
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final, round_name)
  VALUES
    (v_orquidea, v_epikpeak, v_grp_h, '2026-06-13T05:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false, '1er Partido Grupo 8')
  RETURNING id INTO v_m_h1;

  -- =========================================
  -- 6. RONDA 2 — EQUIPO LIBRE vs PERDEDOR RONDA 1
  --    away_team = NULL → se rellena automáticamente al introducir resultado Ronda 1
  -- =========================================

  -- GRUPO 2 — Sábado 06:00 · SPORTING vs Perdedor Grupo 2
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     away_team_placeholder_type, away_team_source_match_id)
  VALUES
    (v_sporting, NULL, v_grp_b, '2026-06-13T06:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'LOSER_MATCH', v_m_b1);

  -- GRUPO 3 — Sábado 07:00 · CARNICERÍA vs Perdedor Grupo 3
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     away_team_placeholder_type, away_team_source_match_id)
  VALUES
    (v_carniceria, NULL, v_grp_c, '2026-06-13T07:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'LOSER_MATCH', v_m_c1);

  -- GRUPO 1 — Sábado 08:00 · ASTURSIM vs Perdedor Grupo 1
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     away_team_placeholder_type, away_team_source_match_id)
  VALUES
    (v_astursim, NULL, v_grp_a, '2026-06-13T08:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'LOSER_MATCH', v_m_a1);

  -- GRUPO 6 — Sábado 09:00 · O PALIQUE MONDOÑEDO vs Perdedor Grupo 6
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     away_team_placeholder_type, away_team_source_match_id)
  VALUES
    (v_palique, NULL, v_grp_f, '2026-06-13T09:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'LOSER_MATCH', v_m_f1);

  -- GRUPO 4 — Sábado 10:00 · GAMBETAS vs Perdedor Grupo 4
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     away_team_placeholder_type, away_team_source_match_id)
  VALUES
    (v_gambetas, NULL, v_grp_d, '2026-06-13T10:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'LOSER_MATCH', v_m_d1);

  -- GRUPO 5 — Sábado 11:00 · PUB BUDDHA vs Perdedor Grupo 5
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     away_team_placeholder_type, away_team_source_match_id)
  VALUES
    (v_pub_buddha, NULL, v_grp_e, '2026-06-13T11:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'LOSER_MATCH', v_m_e1);

  -- GRUPO 7 — Sábado 12:00 · DOÑANGO vs Perdedor Grupo 7
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     away_team_placeholder_type, away_team_source_match_id)
  VALUES
    (v_donango, NULL, v_grp_g, '2026-06-13T12:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'LOSER_MATCH', v_m_g1);

  -- GRUPO 8 — Sábado 13:00 · EL SALÓN DEL CAFÉ vs Perdedor Grupo 8
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     away_team_placeholder_type, away_team_source_match_id)
  VALUES
    (v_salon_cafe, NULL, v_grp_h, '2026-06-13T13:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'LOSER_MATCH', v_m_h1);

  -- =========================================
  -- 7. RONDA 3 — GANADOR RONDA 1 vs EQUIPO LIBRE
  --    home_team = NULL → se rellena automáticamente al introducir resultado Ronda 1
  -- =========================================

  -- GRUPO 1 — Sábado 14:00 · Ganador Grupo 1 vs ASTURSIM
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     home_team_placeholder_type, home_team_source_match_id)
  VALUES
    (NULL, v_astursim, v_grp_a, '2026-06-13T14:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'WINNER_MATCH', v_m_a1);

  -- GRUPO 2 — Sábado 15:00 · Ganador Grupo 2 vs SPORTING GALÁCTICOS C.F.
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     home_team_placeholder_type, home_team_source_match_id)
  VALUES
    (NULL, v_sporting, v_grp_b, '2026-06-13T15:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'WINNER_MATCH', v_m_b1);

  -- GRUPO 3 — Sábado 16:00 · Ganador Grupo 3 vs CARNICERÍA VÍCTOR-KELTI
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     home_team_placeholder_type, home_team_source_match_id)
  VALUES
    (NULL, v_carniceria, v_grp_c, '2026-06-13T16:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'WINNER_MATCH', v_m_c1);

  -- GRUPO 4 — Sábado 17:00 · Ganador Grupo 4 vs GAMBETAS
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     home_team_placeholder_type, home_team_source_match_id)
  VALUES
    (NULL, v_gambetas, v_grp_d, '2026-06-13T17:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'WINNER_MATCH', v_m_d1);

  -- GRUPO 5 — Sábado 18:00 · Ganador Grupo 5 vs PUB BUDDHA
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     home_team_placeholder_type, home_team_source_match_id)
  VALUES
    (NULL, v_pub_buddha, v_grp_e, '2026-06-13T18:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'WINNER_MATCH', v_m_e1);

  -- GRUPO 6 — Sábado 19:00 · Ganador Grupo 6 vs O PALIQUE MONDOÑEDO
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     home_team_placeholder_type, home_team_source_match_id)
  VALUES
    (NULL, v_palique, v_grp_f, '2026-06-13T19:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'WINNER_MATCH', v_m_f1);

  -- GRUPO 7 — Sábado 20:00 · Ganador Grupo 7 vs DOÑANGO
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     home_team_placeholder_type, home_team_source_match_id)
  VALUES
    (NULL, v_donango, v_grp_g, '2026-06-13T20:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'WINNER_MATCH', v_m_g1);

  -- GRUPO 8 — Sábado 21:00 · Ganador Grupo 8 vs EL SALÓN DEL CAFÉ
  INSERT INTO tournament_match
    (home_team, away_team, group_id, match_date, year, home_score, away_score, match_stage, is_local_final,
     home_team_placeholder_type, home_team_source_match_id)
  VALUES
    (NULL, v_salon_cafe, v_grp_h, '2026-06-13T21:00:00+02:00', 2026, NULL, NULL, 'Fase de Grupos', false,
     'WINNER_MATCH', v_m_h1);

END;
$$;

-- Total equipos 2026: 24 (16 iniciales + 8 nuevos)
-- Total grupos 2026:   8
-- Total partidos 2026: 24 (8 Ronda 1 + 8 Ronda 2 + 8 Ronda 3)
