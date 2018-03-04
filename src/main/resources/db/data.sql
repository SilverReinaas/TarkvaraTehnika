INSERT INTO unit_type (id, name, unit) VALUES (1, 'Duration', 's');
INSERT INTO unit_type (id, name, unit) VALUES (2, 'Reps', 'times');
INSERT INTO unit_type (id, name, unit) VALUES (3, 'Weight', 'kg');

INSERT INTO app_user (id, username, password) VALUES (1, 'silver', md5('pass'));
INSERT INTO exercise (id, name, description, user_id) VALUES (99999, 'Bench press', 'long and cool exercise description', 1);
INSERT INTO exercise_log (id, log_date, exercise_Id) VALUES (99999, CURRENT_DATE, 99999);
