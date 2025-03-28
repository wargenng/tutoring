// steps/03_items.js
/*
  Step 3: Items Functions
  - createItem: Inserts a new item.
  - fetchItems: Retrieves all items.
  - fetchItemById: Retrieves a single item by ID.
*/

const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/acme_review_site_db"
);

const createItem = async ({ name, description }) => {
    const SQL = `
    INSERT INTO items(id, name, description)
    VALUES($1, $2, $3)
    RETURNING *
  `;
    const response = await client.query(SQL, [uuid.v4(), name, description]);
    return response.rows[0];
};

const fetchItems = async () => {
    const SQL = `SELECT * FROM items ORDER BY name ASC`;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchItemById = async (id) => {
    const SQL = `SELECT * FROM items WHERE id = $1`;
    const response = await client.query(SQL, [id]);
    return response.rows[0];
};

module.exports = { createItem, fetchItems, fetchItemById };
