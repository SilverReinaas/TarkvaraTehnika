
INSERT INTO unit_type (id, name, unit) VALUES (1, 'Duration', 's');
INSERT INTO unit_type (id, name, unit) VALUES (2, 'Reps', 'times');
INSERT INTO unit_type (id, name, unit) VALUES (3, 'Weight', 'kg');

insert into muscle(id, location_id, muscle_name) values (1, 1, 'traps');
insert into muscle(id, location_id, muscle_name) values (2, 2, 'shoulders');
insert into muscle(id, location_id, muscle_name) values (3, 3, 'triceps');
insert into muscle(id, location_id, muscle_name) values (4, 4, 'biceps');
insert into muscle(id, location_id, muscle_name) values (5, 5, 'forearms');
insert into muscle(id, location_id, muscle_name) values (6, 6, 'chest');
insert into muscle(id, location_id, muscle_name) values (7, 7, 'abs');
insert into muscle(id, location_id, muscle_name) values (8, 8, 'obliques');
insert into muscle(id, location_id, muscle_name) values (9, 9, 'lats');
insert into muscle(id, location_id, muscle_name) values (10, 10, 'lower back');
insert into muscle(id, location_id, muscle_name) values (11, 11, 'glutes');
insert into muscle(id, location_id, muscle_name) values (12, 12, 'hams');
insert into muscle(id, location_id, muscle_name) values (13, 13, 'quads');
insert into muscle(id, location_id, muscle_name) values (14, 14, 'calves');

INSERT INTO app_user (id, username, password) VALUES (1, 'silver', md5('pass'));

INSERT INTO exercise (id, name, description, user_id) VALUES (1, 'Bench press', 'long and cool exercise description', 1);
INSERT INTO exercise_unit_type (id, exercise_id, unit_type_id) VALUES (1, 1, 2);
INSERT INTO exercise_unit_type (id, exercise_id, unit_type_id) VALUES (2, 1, 3);

INSERT INTO exercise_set (id, exercise_id, created) VALUES (1, 1, '2018-04-01');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (1, '2018-04-01 18:00:00', 1, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (2, '2018-04-01 18:00:00', 1, 3, 60);
INSERT INTO exercise_set (id, exercise_id, created) VALUES (2, 1, '2018-04-01');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (3, '2018-04-01 18:10:00', 2, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (4, '2018-04-01 18:10:00', 2, 3, 60);
INSERT INTO exercise_set (id, exercise_id, created) VALUES (3, 1, '2018-04-01');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (5, '2018-04-01 18:20:00', 3, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (6, '2018-04-01 18:20:00', 3, 3, 60);

INSERT INTO exercise_set (id, exercise_id, created) VALUES (4, 1, '2018-04-02');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (7, '2018-04-02 18:00:00', 4, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (8, '2018-04-02 18:00:00', 4, 3, 60);
INSERT INTO exercise_set (id, exercise_id, created) VALUES (5, 1, '2018-04-02');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (9, '2018-04-02 18:10:00', 5, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (10, '2018-04-02 18:10:00', 5, 3, 60);
INSERT INTO exercise_set (id, exercise_id, created) VALUES (6, 1, '2018-04-02');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (11, '2018-04-02 18:20:00', 6, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (12, '2018-04-02 18:20:00', 6, 3, 60);

INSERT INTO exercise_set (id, exercise_id, created) VALUES (7, 1, '2018-04-03');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (13, '2018-04-03 18:00:00', 7, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (14, '2018-04-03 18:00:00', 7, 3, 60);
INSERT INTO exercise_set (id, exercise_id, created) VALUES (8, 1, '2018-04-03');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (15, '2018-04-03 18:10:00', 8, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (16, '2018-04-03 18:10:00', 8, 3, 60);
INSERT INTO exercise_set (id, exercise_id, created) VALUES (9, 1, '2018-04-03');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (17, '2018-04-03 18:20:00', 9, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (18, '2018-04-03 18:20:00', 9, 3, 60);

INSERT INTO exercise_set (id, exercise_id, created) VALUES (10, 1, '2018-04-04');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (19, '2018-04-04 18:00:00', 10, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (20, '2018-04-04 18:00:00', 10, 3, 60);
INSERT INTO exercise_set (id, exercise_id, created) VALUES (11, 1, '2018-04-04');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (21, '2018-04-04 18:10:00', 11, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (22, '2018-04-04 18:10:00', 11, 3, 60);
INSERT INTO exercise_set (id, exercise_id, created) VALUES (12, 1, '2018-04-04');
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (23, '2018-04-04 18:20:00', 12, 2, 8);
INSERT INTO measure_log (id, created, exercise_set_id, unit_type_id, val) VALUES (24, '2018-04-04 18:20:00', 12, 3, 60);


/*
INSERT INTO exercise_muscle (id, exercise_id, muscle_id) VALUES (55555, 1, 1);
INSERT INTO exercise_muscle (id, exercise_id, muscle_id) VALUES (55556, 1, 2);
*/