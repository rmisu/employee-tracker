const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abc',
    database: 'team',
    }
);

const options = () => {
    inquirer.prompt({
        type: 'list',
        name: 'choices',
        message: 'What would you like to?',
        choices: [
            'View all employees',
            'Add employee',
            'Update employee role',
            'View all roles',
            'Add role',
            'View all departments',
            'Add department',
            'Finish'
        ]
    })
    .then((answers) => {
        switch (answers.choices) {
            case 'View all employees':
                allEmployees();
                break;
            case 'Add employee': 
                break;
            case 'Update employee role':
                break;
            case 'View all roles':
                allRoles();
                break;
            case 'Add role':
                break;
            case 'View all departments':
                allDepartments();
                break;
            case 'Add department':
                break;
            case 'Finish':
                break;
        }
    });
}

const allEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.roles_id,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee manager
    RIGHT JOIN employee ON employee.manager_id = manager.id; `, 
    (err, rows) => {
        console.table(rows);
    return options();
    });
};

const allRoles = () => {
    db.query(`SELECT roles.id, roles.title, department.name AS department, roles.salary
    FROM roles
    LEFT JOIN department ON roles.department_id = department.id; `, 
    (err, rows) => {
        console.table(rows);
    return options();
    });
};

const allDepartments = () => {
    db.query(`SELECT department.*
    FROM department; `, 
    (err, rows) => {
        console.table(rows);
    return options();
    });
};

const addEmployee = () => {
    inquirer.prompt([
    {
        type: 'input',
        name: 'firstName',
        message: 'What is the employees first name?'
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'What is the employees last name?'
    },
])}

options();
