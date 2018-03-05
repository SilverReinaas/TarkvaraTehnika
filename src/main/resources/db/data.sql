INSERT INTO unit_type (id, name, unit) VALUES (1, 'Duration', 's');
INSERT INTO unit_type (id, name, unit) VALUES (2, 'Reps', 'times');
INSERT INTO unit_type (id, name, unit) VALUES (3, 'Weight', 'kg');

INSERT INTO app_user (id, username, password) VALUES (1, 'silver', md5('pass'));
INSERT INTO exercise (id, name, description, user_id) VALUES (99999, 'Bench press', 'long and cool exercise description', 1);
INSERT INTO measure_log (id, created, exercise_id, unit_type_id, val) VALUES (99999, CURRENT_DATE, 99999, 3, 234);

INSERT INTO exercise_unit_type (id, exercise_id, unit_type_id) VALUES (55555, 99999, 2);
INSERT INTO exercise_unit_type (id, exercise_id, unit_type_id) VALUES (55556, 99999, 3);
