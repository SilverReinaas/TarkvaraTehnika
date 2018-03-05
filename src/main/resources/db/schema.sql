DROP SEQUENCE IF EXISTS measure_log_id_seq;
DROP TABLE IF EXISTS measure_log;

DROP SEQUENCE IF EXISTS exercise_unit_type_id_seq;
DROP TABLE IF EXISTS exercise_unit_type;

DROP SEQUENCE IF EXISTS exercise_id_seq;
DROP TABLE IF EXISTS exercise;

DROP SEQUENCE IF EXISTS app_user_id_seq;
DROP TABLE IF EXISTS app_user;

DROP SEQUENCE IF EXISTS unit_type_id_seq;
DROP TABLE IF EXISTS unit_type;

CREATE TABLE app_user (
    id INT NOT NULL PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(40) NOT NULL
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

CREATE TABLE measure_log (
    id INT NOT NULL PRIMARY KEY,
    created TIMESTAMP NOT NULL,
    exercise_id INT NOT NULL,
    unit_type_id INT NOT NULL,
    val NUMERIC,
    FOREIGN KEY (exercise_id) REFERENCES exercise(id),
    FOREIGN KEY (unit_type_id) REFERENCES unit_type(id)
);
CREATE SEQUENCE measure_log_id_seq;