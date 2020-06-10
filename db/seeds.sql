INSERT INTO departments (department) VALUES ('Software'), ('Hardware'), ('Human Resources');

INSERT INTO roles (title, salary, department_id) VALUES ('Manager', 100000.90, 2), ('Engineer', 5000, 1), ('Engineer', 10020000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES 
('Conrad', 'Trost', 1, 2), ('NotConrad', 'NotTrost', 2, NULL);