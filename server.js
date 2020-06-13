const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const table = cTable.getTable([
    {Hello: 'Welcome!'}
]);

console.table(table);

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db'
});

connection.connect(err => {
    if(err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    showMenu();
    return;
})

const showEmployeeChoices = falseParam => {
    let employeeChoices = [];
    if (falseParam == true) {
        employeeChoices = ['None'];
    }
    const sql = 'select first_name, last_name, id from employees;';
    const params = [];
    connection.query(sql, params, function(err, results) {
        if(err) throw err;
        for (n in results) {
            employeeChoices.push([results[n].id, results[n].first_name, results[n].last_name].join(' '));
        } 
        if (falseParam == true) {
            showRoleChoices(falseParam, employeeChoices)
        }
        else {
            showRoleChoices(falseParam, employeeChoices);
        }
    });
};

const showRoleChoices = (falseParam, employeeChoices) => {
    const roleChoices = [];
    const sql = `SELECT id, title FROM roles;`;
    const params = [];
    connection.query(sql, params, function(err, results) {
        if (err) throw err;
        for (n in results) {
            roleChoices.push([results[n].id, results[n].title].join(' '));
        };
        if (falseParam == true) {
            addEmployee(employeeChoices, roleChoices);
        }
        else {
            updateRole(employeeChoices, roleChoices);
        }
    });
};

const updateRole = (employeeChoices, roleChoices) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'Employee',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'Role',
            choices: roleChoices
        }
    ])
    .then(answer => {
        const toFindInt = answer.Employee.split(' ');
        const indexNumber = toFindInt[0];
        const toFindRole = answer.Role.split(' ');
        const indexRole = toFindRole[0];
        const sql = `UPDATE employees SET role_id = ${indexRole} WHERE id = ${indexNumber};`;
        const params = [];
        connection.query(sql, params, function(err, result) {
            if(err) throw err;
            console.table(result);
            exitMenu();
        })
    });
};

const exitMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu_or_quit',
            message: 'What next?',
            choices: ['Show menu', 'Quit']
        }
    ])
        .then(answers => {
            if(answers.menu_or_quit === 'Show menu'){
                showMenu();
            }
            else {
                endConnection();
            }
        })
};

function viewRoles() {
    const sql = `SELECT roles.id, title, departments.department, salary FROM roles
    LEFT JOIN departments on departments.id = roles.department_id;`
    const params = [];
    connection.query(sql, params, function(err, results) {
        if(err) throw err;
        console.log('Showing roles..\n')
        console.table(results);
        exitMenu();
    });
};

function verify(answers) {
    const ans = answers.menuChoice;
    if(ans === 'View all departments'){
        viewDepartments();
    }
    else if(ans === 'View all roles'){
        viewRoles();
    }
    else if(ans === 'View all employees'){
        viewEmployees();
    }
    else if(ans === 'Add a department'){
        addDepartment();
    }
    else if(ans === 'Add a role'){
        deptChoices();
    }
    else if(ans === 'Add an employee'){
        showEmployeeChoices(true);
    }
    else if(ans === 'Update employee role'){
        showEmployeeChoices(false);
    }
    else if(ans === 'Delete employee'){
        deleteEmployee();
    }
    else {
        endConnection();
    }
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'text',
            name: 'deptName',
            message: 'Insert department name:'
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO departments (department) VALUES (?);`
        const params = [answer.deptName];
        connection.query(sql, params, function(err, result) {
            if(err) throw err;
            console.table(result);
            exitMenu();
        });
    });
};

const deptChoices = () => {
    const sql = `SELECT department FROM departments`;
    const params = [];
    const departmentArray = [];
    connection.query(sql, params, function(err, results) {
        if (err) throw err;
        for (n in results) {
            departmentArray.push(results[n].department);
        };
        addRole(departmentArray);
    });
};

const addRole = async departmentArray => {
        inquirer.prompt([
        {
            type: 'text',
            name: 'title',
            message: 'Insert role name:'
        },
        {
            type: 'number',
            name: 'salary',
            message: 'Insert the salary:'
        },
        {
            type: 'list',
            name: 'dept',
            choices: departmentArray
        }
    ])
    .then(answers => {
        // Return the ID of the department
        let sql = `SELECT id FROM departments WHERE department = '${answers.dept}';`;
        connection.query(sql, function(err, results) {
            if(err) throw err;
            const deptID = results[0].id;
            addValuesDept(deptID, answers);
        })
    });
};

const addValuesDept = (deptID, answers) => {
    sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`;
    const params = [answers.title, answers.salary, deptID]
    connection.query(sql, params, function(err, results) {
        if(err) throw err;
        console.table(results);
        exitMenu();
    });
};

const addEmployee = (employeeChoices, roleChoices) => {
    inquirer.prompt([
        {
            type: 'text',
            name: 'firstName',
            message: 'Insert first name:'
        },
        {
            type: 'text',
            name: 'lastName',
            message: 'Insert last name:'
        },
        {
            type: 'list',
            name: 'role',
            message: 'Enter the role',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Enter the manager',
            choices: employeeChoices
        }
    ])
    .then(answers => {
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const roleID = answers.role.split(' ');
        let managerID = answers.managerId.split(' ')
        if (answers.managerId == 'None') {
            managerID[0] = null;
        }
        console.log(managerID);
        console.log(managerID[0]);
        const params = [answers.firstName, answers.lastName, roleID[0], managerID[0]];
        connection.query(sql, params, function(err, results) {
            if(err) throw err;
            console.table(results);
            exitMenu();
        })
    })
}

const showMenu = () => {
    console.log('Welcome to the menu!');

        inquirer.prompt([
            {
                type: 'list',
                name: 'menuChoice',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Quit']
            }
        ])
        .then((answers) => verify(answers))
};

const viewDepartments = () => {
    console.log('Showing departments...\n');
    const sql = 'SELECT * FROM departments;';
    const params = [];
    connection.query(sql, params, function(err, results) {
        if(err) throw err;
        console.table(results);
        exitMenu();
    });
};

const viewEmployees = () => {
    console.log('Showing employees...\n')
    const sql = `select employees.first_name, employees.last_name, title, salary, departments.department, managers.first_name as manager from employees 
    left join roles on employees.role_id = roles.id
    left join departments on roles.department_id = departments.id
    left join employees as managers on employees.manager_id = managers.id;`;
    const params = [];
    connection.query(sql, params, function(err, results) {
        if(err) throw err;
        console.table(results);
        exitMenu();
    });
};

const endConnection = () => {
    console.log('Thanks for supporting this app! Bye.')
    connection.end();
};