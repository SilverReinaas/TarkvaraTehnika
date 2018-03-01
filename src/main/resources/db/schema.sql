DROP SEQUENCE IF EXISTS app_user_id_seq;
DROP TABLE IF EXISTS app_user;

DROP SEQUENCE IF EXISTS exercise_id_seq;
DROP TABLE IF EXISTS exercise;

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
    CONSTRAINT FK_PersonOrder FOREIGN KEY (user_id) REFERENCES app_user(id)
);
CREATE SEQUENCE exercise_id_seq;