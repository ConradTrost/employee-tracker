DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE departments(
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles(
    id INTEGER NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(40) NOT NULL,
    department_id INTEGER UNSIGNED NOT NULL
);

CREATE TABLE employees (
    id INTEGER NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL, 
    role_id INTEGER UNSIGNED NOT NULL,  
    manager_id INTEGER UNSIGNED
);