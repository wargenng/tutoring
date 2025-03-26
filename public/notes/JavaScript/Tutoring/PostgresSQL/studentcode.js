require("dotenv").config();

const express = require("express");
const app = express();
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);

app.get("/api/flavors", async (req, res, next) => {
    const allflavors = await client.query(`SELECT * FROM flavors`);
    res.status(200).json(allflavors.rows);
});

app.get("/api/flavors/:id", async (req, res, next) => {
    try {
        const singleflavor = `SELECT * FROM flavors
    WHERE id = $1`;
        const respone = await client.query(singleflavor, [req.params.id]);
        res.send(respone.rows);
    } catch (error) {
        next(error);
    }
});

app.post("/api/flavors", async (req, res, next) => {
    try {
        const newflavor = /* sql */ `
    INSERT INTO flavors(name, is_favorite) VALUES ($1, $2) RETURNING *`;
        const response = await client.query(newflavor, [
            req.body.name,
            req.body.is_favorite,
        ]);
        res.status(201).send(response.rows[0]);
    } catch (error) {
        next(error);
    }
});

app.delete("/api/flavors/:id", async (req, res, next) => {
    try {
        const deleteflavor = `DELETE FROM flavors
        WHERE id = $1
        `;
        await client.query(deleteflavor, [req.params.id]);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

app.put("/api/notes/:id", async (req, res, next) => {
    try {
        const update = /* sql */ `
      UPDATE flavors
      SET name=$1, updated_at=now()
      WHERE id = $2
      RETURNING *
      `;
        const response = await client.query(update, [
            req.body.name,
            req.params.id,
        ]);
        res.send(response.rows[0]);
    } catch (error) {
        next(error);
    }
});

const init = async () => {
    await client.connect();

    let SQL = /* sql */ `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      is_favorite BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    )
    `;

    await client.query(SQL);
    console.log("tables created");

    SQL = /* sql */ `
    INSERT INTO flavors(name, is_favorite) VALUES('Chocolate', FALSE);
    INSERT INTO flavors(name, is_favorite) VALUES('Vanilla', TRUE);
    INSERT INTO flavors(name) VALUES('Strawberry');
    INSERT INTO flavors(name) VALUES('Vanilla Coffee Bean');
    `;

    await client.query(SQL);
    console.log("data seeded");

    const port = process.env.PORT;
    app.listen(port, () => console.log(`listening on port ${port}`));
};
init();
