DROP SEQUENCE IF EXISTS measure_log_id_seq;
DROP TABLE IF EXISTS measure_log;

DROP SEQUENCE IF EXISTS exercise_set_id_seq;
DROP TABLE IF EXISTS exercise_set;

DROP SEQUENCE IF EXISTS exercise_unit_type_id_seq;
DROP TABLE IF EXISTS exercise_unit_type;

DROP SEQUENCE IF EXISTS exercise_muscle_id_seq;
DROP TABLE IF EXISTS exercise_muscle;

DROP SEQUENCE IF EXISTS exercise_id_seq;
DROP TABLE IF EXISTS exercise;

DROP SEQUENCE IF EXISTS app_user_id_seq;
DROP TABLE IF EXISTS app_user;

DROP SEQUENCE IF EXISTS unit_type_id_seq;
DROP TABLE IF EXISTS unit_type;

DROP SEQUENCE IF EXISTS muscle_id_seq;
DROP TABLE IF EXISTS muscle;

DROP TABLE IF EXISTS exercise_log;

CREATE TABLE app_user (
    id INT NOT NULL PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(40) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    forename VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    code VARCHAR(11) NOT NULL

);
CREATE SEQUENCE app_user_id_seq;

CREATE TABLE exercise (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(500),
    user_id INT NOT NULL,
    CONSTRAINT FK_UserExercise
    FOREIGN KEY (user_id) REFERENCES app_user(id)
);
CREATE SEQUENCE exercise_id_seq;

CREATE TABLE unit_type (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(30) NOT NULL
);
CREATE SEQUENCE unit_type_id_seq;

CREATE TABLE exercise_unit_type (
    id INT NOT NULL PRIMARY KEY,
    exercise_id INT NOT NULL,
    unit_type_id INT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercise(id),
    FOREIGN KEY (unit_type_id) REFERENCES unit_type(id)
);
CREATE SEQUENCE exercise_unit_type_id_seq;

CREATE TABLE exercise_set (
    id INT NOT NULL PRIMARY KEY,
    created TIMESTAMP NOT NULL,
    exercise_id INT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercise(id)
);
CREATE SEQUENCE exercise_set_id_seq;

CREATE TABLE measure_log (
    id INT NOT NULL PRIMARY KEY,
    created TIMESTAMP NOT NULL,
    exercise_set_id INT NOT NULL,
    unit_type_id INT NOT NULL,
    val NUMERIC,
    FOREIGN KEY (exercise_set_id) REFERENCES exercise_set(id),
    FOREIGN KEY (unit_type_id) REFERENCES unit_type(id)
);
CREATE SEQUENCE measure_log_id_seq;

CREATE TABLE muscle (
    id INT NOT NULL PRIMARY KEY,
    muscle_name VARCHAR(100) NOT NULL,
    location_id INT NOT NULL
);
CREATE SEQUENCE muscle_id_seq;

CREATE TABLE exercise_muscle (
    id INT NOT NULL PRIMARY KEY,
    exercise_id INT NOT NULL,
    muscle_id INT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercise(id),
    FOREIGN KEY (muscle_id) REFERENCES muscle(id)
);
CREATE SEQUENCE exercise_muscle_id_seq;