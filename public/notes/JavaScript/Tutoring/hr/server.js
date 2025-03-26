const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "acme_hr_db",
    password: "yourPassword",
    port: 5432,
});

app.get("/api/employees", async (req, res) => {
    try {
        const query = `
      SELECT e.id, e.name, e.created_at, e.updated_at, e.department_id, d.name AS department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.id ASC
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/employees/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
      SELECT e.id, e.name, e.created_at, e.updated_at, e.department_id, d.name AS department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = $1
    `;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/employees", async (req, res) => {
    const { name, department_id } = req.body;
    if (!name || !department_id) {
        return res.status(400).json({ error: "Missing name or department_id" });
    }
    try {
        const query = `
      INSERT INTO employees (name, department_id)
      VALUES ($1, $2)
      RETURNING *
    `;
        const result = await pool.query(query, [name, department_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/api/employees/:id", async (req, res) => {
    const { id } = req.params;
    const { name, department_id } = req.body;
    if (!name || !department_id) {
        return res.status(400).json({ error: "Missing name or department_id" });
    }
    try {
        const query = `
      UPDATE employees
      SET name = $1,
          department_id = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
        const result = await pool.query(query, [name, department_id, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/api/employees/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const query = "DELETE FROM employees WHERE id = $1 RETURNING *";
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
