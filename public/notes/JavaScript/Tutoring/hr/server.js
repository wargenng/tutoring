/*
 * HR Assignment - API Endpoints:
 *
 * Employees Endpoints:
 * - GET /api/employees: Returns an array of employees, including their department names via a LEFT JOIN.
 * - GET /api/employees/:id: Returns a single employee by id, including the department name via a LEFT JOIN.
 * - POST /api/employees: Creates a new employee using the provided name and department_id; returns the newly created employee.
 * - PUT /api/employees/:id: Updates an existing employee's name and department_id (with updated_at set to now) and returns the updated employee.
 * - DELETE /api/employees/:id: Deletes an employee and returns no content.
 *
 * Departments Endpoints:
 * - GET /api/departments: Returns an array of departments.
 * - GET /api/departments/:id: Returns a single department by id.
 * - POST /api/departments: Creates a new department using the provided name; returns the newly created department.
 * - PUT /api/departments/:id: Updates an existing department's name and returns the updated department.
 * - DELETE /api/departments/:id: Deletes a department and returns no content.
 *
 * Additional Information:
 * - This code uses a PostgreSQL connection via pg.Client with a connection string from an environment variable (DATABASE_URL).
 * - The approach is similar to the student's flavors project:
 *   - Both use the pg.Client from the 'pg' library.
 *   - Both initialize the client with a connection string from process.env.
 *   - Both handle SQL queries asynchronously with try/catch blocks and use async/await.
 *   - The structure and error handling in the endpoints are modeled after the student's code.
 */

require("dotenv").config();
const express = require("express");
const app = express();
const pg = require("pg");

// Connect to PostgreSQL using the connection string from the environment variable
const client = new pg.Client(process.env.DATABASE_URL);

app.use(express.json());

// Establish connection to the PostgreSQL database
client.connect();

// =======================
// Employees Endpoints
// =======================

// GET /api/employees
// Retrieves all employees along with their department names using a LEFT JOIN.
app.get("/api/employees", async (req, res, next) => {
    try {
        const allEmployees = await client.query(`
      SELECT e.id, e.name, e.created_at, e.updated_at, e.department_id, d.name AS department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.id ASC
    `);
        res.status(200).json(allEmployees.rows);
    } catch (error) {
        next(error);
    }
});

// GET /api/employees/:id
// Retrieves a single employee by id along with their department name using a LEFT JOIN.
app.get("/api/employees/:id", async (req, res, next) => {
    try {
        const singleEmployee = `
      SELECT e.id, e.name, e.created_at, e.updated_at, e.department_id, d.name AS department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = $1
    `;
        const response = await client.query(singleEmployee, [req.params.id]);
        res.status(200).json(response.rows);
    } catch (error) {
        next(error);
    }
});

// POST /api/employees
// Creates a new employee with the provided name and department_id.
app.post("/api/employees", async (req, res, next) => {
    try {
        const newEmployee = `
      INSERT INTO employees(name, department_id)
      VALUES ($1, $2)
      RETURNING *
    `;
        const response = await client.query(newEmployee, [
            req.body.name,
            req.body.department_id,
        ]);
        res.status(201).json(response.rows[0]);
    } catch (error) {
        next(error);
    }
});

// PUT /api/employees/:id
// Updates an existing employee's name and department_id, and sets updated_at to now.
app.put("/api/employees/:id", async (req, res, next) => {
    try {
        const updateEmployee = `
      UPDATE employees
      SET name = $1,
          department_id = $2,
          updated_at = now()
      WHERE id = $3
      RETURNING *
    `;
        const response = await client.query(updateEmployee, [
            req.body.name,
            req.body.department_id,
            req.params.id,
        ]);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/employees/:id
// Deletes an employee with the specified id.
app.delete("/api/employees/:id", async (req, res, next) => {
    try {
        const deleteEmployee = `DELETE FROM employees WHERE id = $1 RETURNING *`;
        await client.query(deleteEmployee, [req.params.id]);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

// =======================
// Departments Endpoints
// =======================

// GET /api/departments
// Retrieves all departments.
app.get("/api/departments", async (req, res, next) => {
    try {
        const allDepartments = await client.query(`SELECT * FROM departments`);
        res.status(200).json(allDepartments.rows);
    } catch (error) {
        next(error);
    }
});

// GET /api/departments/:id
// Retrieves a single department by id.
app.get("/api/departments/:id", async (req, res, next) => {
    try {
        const singleDepartment = `SELECT * FROM departments WHERE id = $1`;
        const response = await client.query(singleDepartment, [req.params.id]);
        res.status(200).json(response.rows);
    } catch (error) {
        next(error);
    }
});

// POST /api/departments
// Creates a new department with the provided name.
app.post("/api/departments", async (req, res, next) => {
    try {
        const newDepartment = `
      INSERT INTO departments(name)
      VALUES ($1)
      RETURNING *
    `;
        const response = await client.query(newDepartment, [req.body.name]);
        res.status(201).json(response.rows[0]);
    } catch (error) {
        next(error);
    }
});

// PUT /api/departments/:id
// Updates an existing department's name.
app.put("/api/departments/:id", async (req, res, next) => {
    try {
        const updateDepartment = `
      UPDATE departments
      SET name = $1
      WHERE id = $2
      RETURNING *
    `;
        const response = await client.query(updateDepartment, [
            req.body.name,
            req.params.id,
        ]);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/departments/:id
// Deletes a department with the specified id.
app.delete("/api/departments/:id", async (req, res, next) => {
    try {
        const deleteDepartment = `DELETE FROM departments WHERE id = $1 RETURNING *`;
        await client.query(deleteDepartment, [req.params.id]);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

// Start the server on the specified port from the environment or default to 3000.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
