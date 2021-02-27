var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "poopYOU21!",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: [
                    "view all employees",
                    "add employee",
                    "view all employees by department",
                    "view all departments",
                    "add department",
                    "view all roles",
                    "update employee role",
                    "add role",
                    "exit"
                ]
            })
            .then(function (answer) {
            switch (answer.action) {
                case "view all employees":
                    employeeView();
                    break;

                case "add employee":
                    addEmployee();
                    break;

                case "view all departments":
                    viewDepartments();
                    break;

                case "add department":
                    addDepartment();
                    break;

                case "view all roles":
                    viewRoles();
                    break;

                case "Update employee manager":
                        updateManager();
                        break;

                case "update employee role":
                    updateEmployeeRole();
                    break;

                case "add role":
                    addRole();
                    break;

                case "exit":
                    console.log("Goodbye!")
                    connection.end();
                    break;
            }
        });
}

function employeeView() {
    connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  }
function viewDepartments() {
    connection.query("SELECT * FROM department", (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  }

function viewRoles() {
    connection.query("SELECT * FROM role", (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  }


function updateEmployeeRole() {
    connection.query(
      "SELECT role.id, title, first_name, last_name, employee.id, employee.role_id FROM role LEFT JOIN employee on role.id = employee.role_id;",
      (err, res) => {
        if (err) throw err;
        let employee_ids = res.map(({ id, first_name, last_name }) => ({
          name: first_name + " " + last_name,
          value: id,
        }));
        let role_ids = res.map(({ role_id, title }) => ({
          name: title,
          value: role_id,
        }));
        console.table(res);
        inquirer
          .prompt([
            {
              type: "list",
              name: "employee_id",
              message: "What is the employee's name?",
              choices: employee_ids,
            },
            {
              type: "list",
              name: "newrole_id",
              message: "What is the new role title?",
              choices: role_ids,
            },
          ])
          .then((data) => {
            connection.query(
              "UPDATE employee SET ? WHERE ?",
              [{ role_id: data.newrole_id }, { id: data.employee_id }],
              (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " has been updated!\n");
                start();
              }
            );
          });
      }
    );
  }

function updateManager() {
  let update_manager = {
    manager_id: null,
    id: null,
  };
  connection.query(
    "SELECT * FROM employee WHERE manager_id IS NOT null; ",
    (err, res) => {
      if (err) throw err;
      let employee_ids = res.map(({ id, first_name }) => ({
        name: first_name,
        value: id,
      }));
      inquirer
        .prompt({
          type: "list",
          name: "employee_id",
          message: "What is the employee's name?",
          choices: employee_ids,
        })
        .then((data) => {
          console.log(data);
          update_manager.id = data.employee_id;
          connection.query(
            "SELECT first_name, id FROM employee WHERE manager_id IS null;",
            (err, res) => {
              if (err) throw err;
              let manager_ids = res.map(({ id, first_name }) => ({
                name: first_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "newManager_id",
                    message: "What is the new manager ID?",
                    choices: manager_ids,
                  },
                ])
                .then((data) => {
                  update_manager.manager_id = data.newManager_id;
                  connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [
                      { manager_id: update_manager.manager_id },
                      { id: update_manager.id },
                    ],
                    (err, res) => {
                      if (err) throw err;
                      console.log(res.affectedRows + " has been updated!\n");
                      start();
                    }
                  );
                });
            }
          );
        });
    }
  );
}
function addEmployee() {
    connection.query("SELECT * FROM role", (err, res) => {
      if (err) throw err;
      let role_ids = res.map(({ id, title }) => ({
        name: title,
        value: id,
      }));
      connection.query(
        "SELECT DISTINCT managers.id, managers.first_name, managers.last_name FROM employee JOIN employee as managers ON employee.manager_id = managers.id ORDER BY managers.last_name ASC;",
        (err, res) => {
          let manager_ids = res.map(({ id, first_name }) => ({
            name: first_name,
            value: id,
          }));
  
          inquirer
            .prompt([
              {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?",
              },
              {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?",
              },
              {
                type: "list",
                name: "role_id",
                message: "What is the employee's role?",
                choices: role_ids,
              },
              {
                type: "list",
                name: "isManager",
                message: "Is the employee a manager?",
                choices: ["Yes", "No"],
              },

              {
                type: "list",
                name: "manager_id",
                message: "Who is the employee's manager?",
                when: (answers) => answers.isManager === "No",
                choices: manager_ids,
              },
            ])
            .then((data) => {
              connection.query(
                "INSERT INTO employee SET ?",
                {
                  first_name: data.first_name,
                  last_name: data.last_name,
                  role_id: data.role_id,
                  manager_id: data.manager_id,
                },
                function (err) {
                  if (err) throw err;
                  console.log("Your employee was added successfully!");
                  start();
                }
              );
            });
        }
      );
    });
  }
  function addRole() {
    connection.query("SELECT * FROM employeesDB.department;", (err, res) => {
      if (err) throw err;
      let department_ids = res.map(({ id, name }) => ({
        name: name,
        value: id,
      }));
  
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "What is the role?",
          },
          {
            type: "input",
            name: "salary",
            message: "What is the salary?",
          },
          {
            type: "list",
            name: "department_id",
            message: "What is the department ID?",
            choices: department_ids,
          },
        ])
        .then((data) => {
          connection.query(
            "INSERT INTO role SET ?",
            {
              title: data.title,
              salary: data.salary,
              department_id: data.department_id,
            },
            function (err) {
              if (err) throw err;
              console.log("Your role was added successfully!");
              prompt();
            }
          );
        });
    });
  }
  function addDepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of the department?",
        },
      ])
      .then((data) => {
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: data.name,
          },
          function (err) {
            if (err) throw err;
            console.log("Your department was successfuly added!");
            start();
          }
        );
      });
  }