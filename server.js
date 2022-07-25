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
                addEmployee();
                break;
            case 'Update employee role':
                break;
            case 'View all roles':
                allRoles();
                break;
            case 'Add role':
                addRole();
                break;
            case 'View all departments':
                allDepartments();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Finish':
                finish();
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
    {
        type: 'input',
        name: 'roles',
        message: 'What is this employees role?',
    },
    {
        type: 'input',
        name: 'manager',
        message: 'Who is your manager? (id)',
    },
])
.then(val => {
    let params = [
        val.firstName,
        val.lastName,
        val.roles,
        val.manager
    ]
let sql = `INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES (?,?,?,?)`;
    db.query(sql, params, (err, rows) => {
        console.table(rows);
        return options();
    })
})};

const allRoles = () => {
    db.query(`SELECT roles.id, roles.title, department.name AS department, roles.salary
    FROM roles
    LEFT JOIN department ON roles.department_id = department.id; `, 
    (err, rows) => {
        console.table(rows);
    return options();
    });
};

const addRole =  () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the new role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary?'
        },
        {
            type: 'input',
            name: 'department',
            message: 'What department is this role in? (1-4)?',
        }
    ])
    .then(results => {
        let params = [
            results.role,
            results.salary,
            results.department
        ]
    let sql = `INSERT INTO roles (title, salary, department) VALUES (?,?,?)`;
        db.query(sql, params, (err, rows) => {
            consoleTable.table(rows);
            return options();
        });
    })
}

const allDepartments = () => {
    db.query(`SELECT department.*
    FROM department; `, 
    (err, rows) => {
        console.table(rows);
    return options();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the new department name?',
        },
    ])
    .then(result => {
        let params = [
            result.name
        ]
    let sql = `INSERT INTO department (name) VALUES (?)`;
        db.query(sql, params, (err, rows) =>  {
            console.table(rows);
                return options();
            
        })
    });
};

function finish() {
    db.end();
}

options();
