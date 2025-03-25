const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "",
    port: 5432,
});

app.get("/api/flavors", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM flavors ORDER BY id ASC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching flavors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/flavors/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM flavors WHERE id = $1", [
            id,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Flavor not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching flavor by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/flavors", async (req, res) => {
    const { name, is_favorite } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO flavors (name, is_favorite) VALUES ($1, $2) RETURNING *",
            [name, is_favorite]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating flavor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/api/flavors/:id", async (req, res) => {
    const { id } = req.params;
    const { name, is_favorite } = req.body;
    try {
        const result = await pool.query(
            `UPDATE flavors
       SET name = $1,
           is_favorite = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
            [name, is_favorite, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Flavor not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating flavor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/api/flavors/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM flavors WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Flavor not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting flavor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
