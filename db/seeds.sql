INSERT INTO departments (name)
VALUES 
    ("Sales"), 
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO roles (title, department_id, salary)
VALUES
   1 ("Sales Lead", 1, 100 000),
    2 ("Salesperson", 1, 80 000),
    3 ("Lead Engineer", 2, 150 000),
   4  ("Software Engineer", 2, 120 000),
   5  ("Account Manager", 3, 160 000),
   6  ("Accountant", 3, 125 000),
   7 ("Legal Team Lead", 4, 250 000),
   8 ("Lawyer", 4, 190 000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("John", "Doe", 1, NULL),
    ("Mike", "Chan", 2, 1),
    ("Ashley", "Rodriguez", 3, NULL),
    ("Kevin", "Tupik", 4, 3),
    ("Kunal", "Singh", 5, NULL),
    ("Malia", "Brown", 6, 5),
    ("Sarah", "Lourd", 7, NULL),
    ("Tom", "Allen", 8, 7);