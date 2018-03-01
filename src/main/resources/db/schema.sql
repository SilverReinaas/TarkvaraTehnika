DROP SEQUENCE IF EXISTS exercise_log_id_seq;
DROP TABLE IF EXISTS exercise_log;

DROP SEQUENCE IF EXISTS exercise_id_seq;
DROP TABLE IF EXISTS exercise;

DROP SEQUENCE IF EXISTS app_user_id_seq;
DROP TABLE IF EXISTS app_user;

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
    user_id INT,
    CONSTRAINT FK_UserExercise
    FOREIGN KEY (user_id) REFERENCES app_user(id)
);
CREATE SEQUENCE exercise_id_seq;

CREATE TABLE exercise_log (
    id INT NOT NULL PRIMARY KEY,
    log_date DATE,
    exercise_id INT,
    CONSTRAINT FK_ExerciseLog
    FOREIGN KEY (exercise_id) REFERENCES exercise(id)
);
CREATE SEQUENCE exercise_log_id_seq;