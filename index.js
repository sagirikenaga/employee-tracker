const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config(); 
require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the employee_db database.`)
  );

const displayMenu = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Please select an option. ',
            choices: ["View all departments", "View all roles", "View all employees", "Add department", "Add role", "Add employee", "Update employee", "Exit"]
        },
    ])
        .then(userChoice => {
            switch (userChoice.menu) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add department":
                    addDepartment();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "Update employee":
                    updateEmployee();
                    break;
                default:
                    process.exit();
            }
        });
};

const viewDepartments = () => {
    db.query(
        'SELECT * FROM departments;',
        (err, results) => {
            console.table(results);
            displayMenu();
        });
};

const viewRoles = () => {
    db.query(
        'SELECT * FROM roles;',
        (err, results) => {
            console.table(results);
            displayMenu();
        }
    )
};

const viewEmployees = () => {
    db.query(
        "SELECT E.id, E.first_name, E.last_name, R.title, D.name AS department, R.salary, CONCAT(M.first_name,' ',M.last_name) AS manager FROM employees E JOIN roles R ON E.role_id = R.id JOIN departments D ON R.department_id = D.id LEFT JOIN employees M ON E.manager_id = M.id;",
        (err, results) => {
            console.table(results);
            displayMenu();
        }
    )
};

const addDepartment = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'What is the name of the department you would like to add?',
        validate: department => {
            if (department) {
                console.log("Department succesfully added.");
                return true;
            } else {
                console.log('Error. What is the name of the department you would like to add?');
                return false;
            }
        }
    }
    ])
        .then(name => {
            db.promise().query("INSERT INTO departments SET ?", name);
            viewDepartments();
        })
}


const addRole = () => {

    return db.promise().query(
        "SELECT id, name FROM departments;"
    )
        .then(([departments]) => {
            let departmentChoices = departments.map(({
                id,
                name
            }) => ({
                name: name,
                value: id
            }));

            inquirer.prompt(
                [{
                    type: 'input',
                    name: 'title',
                    message: 'Please enter your title.',
                    validate: titleName => {
                        if (titleName) {
                            return true;
                        } else {
                            console.log('Error. Please enter your title.');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Please select your department.',
                    choices: departmentChoices
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Please enter your salary.',
                    validate: salary => {
                        if (salary) {
                            return true;
                        } else {
                            console.log('Error. Please enter your salary.');
                            return false;
                        }
                    }
                }
                ]
            )
                .then(({ title, department, salary }) => {
                    const query = db.query(
                        'INSERT INTO roles SET ?',
                        {
                            title: title,
                            department_id: department,
                            salary: salary
                        },
                        function (err, res) {
                            if (err) throw err;
                        }
                    )
                }).then(() => displayMenu())

        })
}

const addEmployee = (roles) => {

    return db.promise().query(
        "SELECT R.id, R.title FROM roles R;"
    )
        .then(([employees]) => {
            let titleChoices = employees.map(({
                id,
                title

            }) => ({
                value: id,
                name: title
            }))

            db.promise().query(
                "SELECT E.id, CONCAT(E.first_name,' ',E.last_name) AS manager FROM employees E;"
            ).then(([managers]) => {
                let managerChoices = managers.map(({
                    id,
                    manager
                }) => ({
                    value: id,
                    name: manager
                }));

                inquirer.prompt(
                    [{
                        type: 'input',
                        name: 'firstName',
                        message: `Please enter employee's first name.`,
                        validate: firstName => {
                            if (firstName) {
                                return true;
                            } else {
                                console.log(`Error. Please enter employee's first name.`);
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: `Please enter employee's last name.`,
                        validate: lastName => {
                            if (lastName) {
                                return true;
                            } else {
                                console.log(`Error. Please enter employee's last name.`);
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: `Please select employee's role.`,
                        choices: titleChoices
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: `Please select employee's manager.`,
                        choices: managerChoices
                    }

                    ])
                    .then(({ firstName, lastName, role, manager }) => {
                        const query = db.query(
                            'INSERT INTO employees SET ?',
                            {
                                first_name: firstName,
                                last_name: lastName,
                                role_id: role,
                                manager_id: manager
                            },
                            function (err, res) {
                                if (err) throw err;
                                console.log({ role, manager })
                            }
                        )
                    })
                    .then(() => displayMenu())
            })
        })
}

const updateEmployee = () => {

    return db.promise().query(
        "SELECT R.id, R.title, R.salary, R.department_id FROM roles R;"
    )
        .then(([roles]) => {
            let roleChoices = roles.map(({
                id,
                title

            }) => ({
                value: id,
                name: title
            }));

            inquirer.prompt(
                [
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Which role would you like to update?',
                        choices: roleChoices
                    }
                ]
            )
                .then(role => {
                    console.log(role);
                    inquirer.prompt(
                        [{
                            type: 'input',
                            name: 'title',
                            message: 'Please enter the new title.',
                            validate: titleName => {
                                if (titleName) {
                                    return true;
                                } else {
                                    console.log('Error. Please enter the new title.');
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'Please enter the new salary.',
                            validate: salary => {
                                if (salary) {
                                    return true;
                                } else {
                                    console.log('Error. Please enter the new salary.');
                                    return false;
                                }
                            }
                        }]
                    )
                        .then(({ title, salary }) => {
                            const query = db.query(
                                'UPDATE roles SET title = ?, salary = ? WHERE id = ?',
                                [
                                    title,
                                    salary
                                    ,
                                    role.role
                                ],
                                function (err, res) {
                                    if (err) throw err;
                                }
                            )
                        })
                        .then(() => displayMenu())
                })
        });

};

displayMenu();