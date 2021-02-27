INSERT INTO department (name)
VALUES ("Marketing"), ("Admin"), ("Engineering"), ("Human Resources"), ("Healthcare");

INSERT INTO  role (title, salary, department_id)
VALUES ("Lead", "2000.00", "1"), ("Director", "80000.00", "2"), ("Chef", "60000.00", "3");

INSERT INTO  employee (first_name, last_name, role_id)
VALUES ("John", "Doe", "145"), ("Sarah", "Smith", "2489"), ("Tyler", "Miller", "3390");

INSERT INTO  employee (first_name, last_name, role_id, manager_id)
VALUES ("Lexa", "Clarke", "1439"), ("Tyrone", "Leo", "2390"), ("Erna", "Ford", "3789");
