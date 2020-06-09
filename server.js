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

function viewRoles() {
    console.log('Nice. Bag Secured...');
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
}

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
        viewRoles();
    }
    else if(ans === 'Add a role'){
        viewRoles();
    }
    else if(ans === 'Add an employee'){
        viewRoles();
    }
    else if(ans === 'Update employee role'){
        viewRoles();
    }
    else {
        endConnection();
    }
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
    console.log('Showing departments...');
    const sql = 'SELECT * FROM departments;';
    const params = [];
    connection.query(sql, params, function(err, results) {
        if(err) throw err;
        console.table(results);
    })
}

const viewEmployees = () => {
    console.log('Showing employees...')
    const sql = 'select * from employees left join roles on employees.role_id = roles.id;';
    const params = [];
    
}

const endConnection = () => {
    console.log('Thanks for supporting this app! Bye.')
    connection.end();
}