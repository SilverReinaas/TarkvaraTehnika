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

INSERT INTO app_user (id, username, password, email, phone, forename, surname, code) VALUES (1, 'silver', md5('pass'), 'abc@def.gh', '55551111', 'Mike', 'I.', '33344455566');