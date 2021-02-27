const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "poopYOU21!",
    database: "employee_DB"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    start();
  });