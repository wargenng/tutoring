// steps/04_reservations.js
const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
    process.env.DATABASE_URL ||
        "postgres://localhost/acme_reservation_planner_db"
);

const createReservation = async ({
    customer_id,
    restaurant_id,
    date,
    party_count,
}) => {
    const SQL = `
    INSERT INTO reservations(id, customer_id, restaurant_id, date, party_count)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
  `;
    const response = await client.query(SQL, [
        uuid.v4(),
        customer_id,
        restaurant_id,
        date,
        party_count,
    ]);
    return response.rows[0];
};

const destroyReservation = async ({ reservation_id }) => {
    const SQL = `
    DELETE FROM reservations
    WHERE id = $1
    RETURNING *
  `;
    const response = await client.query(SQL, [reservation_id]);
    return response.rows[0];
};

module.exports = { createReservation, destroyReservation };
