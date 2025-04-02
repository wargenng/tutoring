// steps/02_customers.js
const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
    process.env.DATABASE_URL ||
        "postgres://localhost/acme_reservation_planner_db"
);

const createCustomer = async ({ name, email }) => {
    const SQL = `
    INSERT INTO customers(id, name, email)
    VALUES($1, $2, $3)
    RETURNING *
  `;
    const response = await client.query(SQL, [uuid.v4(), name, email]);
    return response.rows[0];
};

const fetchCustomers = async () => {
    const SQL = `SELECT * FROM customers ORDER BY name ASC`;
    const response = await client.query(SQL);
    return response.rows;
};

module.exports = { createCustomer, fetchCustomers };
