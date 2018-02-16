DROP SEQUENCE IF EXISTS app_user_id_seq;
DROP TABLE IF EXISTS app_user;

CREATE TABLE app_user (
    id INT NOT NULL PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(40) NOT NULL
);
CREATE SEQUENCE app_user_id_seq;