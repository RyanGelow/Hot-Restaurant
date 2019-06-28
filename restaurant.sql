-- if making any changes this will drop it
DROP DATABASE IF EXISTS restaurant_db;

-- create a database called restaurant
CREATE DATABASE restaurant_db;

USE restaurant_db;

-- create a table inside the database called tables
CREATE TABLE tables (

-- id unique id for each table
id INT NOT NULL AUTO_INCREMENT,

-- reservation name
reservationName VARCHAR(45) NOT NULL,

-- phone number 
phoneNumber INT(10) NOT NULL,

-- primary key
    PRIMARY KEY (id)
);

-- add reservation
INSERT INTO tables (reservationName, phoneNumber)
VALUES("test", 911),
("table 2", 111);

SELECT * FROM tables;
