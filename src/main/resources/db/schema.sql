DROP SEQUENCE IF EXISTS app_user_id_seq;
DROP TABLE IF EXISTS app_user;

DROP SEQUENCE IF EXISTS training_id_seq;
DROP TABLE IF EXISTS training;

CREATE TABLE app_user (
    id INT NOT NULL PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(40) NOT NULL
);
CREATE SEQUENCE app_user_id_seq;

CREATE TABLE training (
    id INT NOT NULL PRIMARY KEY,
    training_time TIMESTAMP NOT NULL,
    comment VARCHAR(100) NOT NULL
);
CREATE SEQUENCE training_id_seq;