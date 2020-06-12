const mysql = require('mysql2');
const inquirer = require('inquirer');

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

const showEmployeeChoices = () => {
    const employeeChoices = [];
    const sql = 'select first_name, last_name, id from employees;';
    const params = [];
    connection.query(sql, params, function(err, results) {
        if(err) throw err;
        for (n in results) {
            employeeChoices.push([results[n].id, results[n].first_name, results[n].last_name].join(' '));

        } showRoleChoices(employeeChoices);
    });
};

const showRoleChoices = employeeChoices => {
    const roleChoices = [];
    const sql = `SELECT id, title FROM roles;`;
    const params = [];
    connection.query(sql, params, function(err, results) {
        if (err) throw err;
        for (n in results) {
            roleChoices.push([results[n].id, results[n].title].join(' '));
        } updateRole(employeeChoices, roleChoices);
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
        console.log(indexRole);
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
        addEmployee();
    }
    else if(ans === 'Update employee role'){
        showEmployeeChoices();
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
        console.log(answers.dept);
        let sql = `SELECT id FROM departments WHERE department = '${answers.dept}';`;
        connection.query(sql, function(err, results) {
            if(err) throw err;
            const deptID = results[0].id;
            console.log(deptID);
            addValuesDept(deptID, answers);
        })
    });
};

const addValuesDept = (deptID, answers) => {
    sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`;
    console.log(deptID)
    const params = [answers.title, answers.salary, deptID]
    connection.query(sql, params, function(err, results) {
        if(err) throw err;
        console.table(results);
        exitMenu();
    });
};

const addEmployee = () => {
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
            type: 'number',
            name: 'roleId', // This needs fix
            message: 'Insert role id'
        },
        {
            type: 'number',
            name: 'managerId',
            message: 'Insert manager ID or leave blank',
            default: false
        }
    ])
    .then(answers => {
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const params = [answers.firstName, answers.lastName, answers.roleId, answers.managerId];
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
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Delete employee', 'Quit']
            }
        ])
        .then((answers) => verify(answers))
};

const viewDepartments = () => {
    console.log('Showing departments...');
    const sql = 'SELECT * FROM departments;';
    const params = [];
    connection.query(sql, params, function(err, results) {
        if(err) throw err;
        console.table(results);
        exitMenu();
    });
};

const viewEmployees = () => {
    console.log('Showing employees...')
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