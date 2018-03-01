INSERT INTO app_user (id, username, password) VALUES (1, 'silver', md5('pass'));
INSERT INTO exercise (id, name, description, user_id) VALUES (1, 'Bench press', 'long and cool exercise description', 1);
INSERT INTO exercise_log (id, log_date, exercise_Id) VALUES (1, CURRENT_DATE, 1);