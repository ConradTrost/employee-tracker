INSERT INTO departments (name) VALUES ('Tom'), ('Todd'), ('Tim'), ('Jim'), ('Jimbo'), ('Mike');

INSERT INTO roles (title, salary, department_id) VALUES ('Manager', 100000.90, 2), ('Engineer', 5000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES 
('Conrad', 'Trost', 1, 2), ('NotConrad', 'NotTrost', 2, NULL);