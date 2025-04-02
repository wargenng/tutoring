// steps/03_restaurants.js
const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
    process.env.DATABASE_URL ||
        "postgres://localhost/acme_reservation_planner_db"
);

const createRestaurant = async ({ name, location }) => {
    const SQL = `
    INSERT INTO restaurants(id, name, location)
    VALUES($1, $2, $3)
    RETURNING *
  `;
    const response = await client.query(SQL, [uuid.v4(), name, location]);
    return response.rows[0];
};

const fetchRestaurants = async () => {
    const SQL = `SELECT * FROM restaurants ORDER BY name ASC`;
    const response = await client.query(SQL);
    return response.rows;
};

module.exports = { createRestaurant, fetchRestaurants };
