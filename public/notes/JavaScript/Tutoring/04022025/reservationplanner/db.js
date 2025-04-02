// server/db.js
require("dotenv").config();
const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
    process.env.DATABASE_URL ||
        "postgres://localhost/acme_reservation_planner_db"
);

/*
  createTables:
  - Drops existing tables (reservations, customers, restaurants)
  - Creates tables for customers, restaurants, and reservations.
*/
const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS restaurants;
    
    CREATE TABLE customers(
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE
    );
    
    CREATE TABLE restaurants(
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      location VARCHAR(255)
    );
    
    CREATE TABLE reservations(
      id UUID PRIMARY KEY,
      customer_id UUID REFERENCES customers(id) NOT NULL,
      restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
      date TIMESTAMP NOT NULL,
      party_count INTEGER NOT NULL CHECK (party_count > 0)
    );
  `;
    await client.query(SQL);
};

/*
  createCustomer:
  - Inserts a new customer and returns the created record.
*/
const createCustomer = async ({ name, email }) => {
    const SQL = `
    INSERT INTO customers(id, name, email)
    VALUES($1, $2, $3)
    RETURNING *
  `;
    const response = await client.query(SQL, [uuid.v4(), name, email]);
    return response.rows[0];
};

/*
  createRestaurant:
  - Inserts a new restaurant and returns the created record.
*/
const createRestaurant = async ({ name, location }) => {
    const SQL = `
    INSERT INTO restaurants(id, name, location)
    VALUES($1, $2, $3)
    RETURNING *
  `;
    const response = await client.query(SQL, [uuid.v4(), name, location]);
    return response.rows[0];
};

/*
  fetchCustomers:
  - Returns an array of all customers.
*/
const fetchCustomers = async () => {
    const SQL = `SELECT * FROM customers ORDER BY name ASC`;
    const response = await client.query(SQL);
    return response.rows;
};

/*
  fetchRestaurants:
  - Returns an array of all restaurants.
*/
const fetchRestaurants = async () => {
    const SQL = `SELECT * FROM restaurants ORDER BY name ASC`;
    const response = await client.query(SQL);
    return response.rows;
};

/*
  createReservation:
  - Inserts a new reservation for a customer and returns the created record.
*/
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

/*
  destroyReservation:
  - Deletes a reservation from the database.
*/
const destroyReservation = async ({ reservation_id }) => {
    const SQL = `
    DELETE FROM reservations
    WHERE id = $1
    RETURNING *
  `;
    const response = await client.query(SQL, [reservation_id]);
    return response.rows[0];
};

module.exports = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    destroyReservation,
};
