// steps/01_dbSetup.js
require("dotenv").config();
const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
    process.env.DATABASE_URL ||
        "postgres://localhost/acme_reservation_planner_db"
);

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
    console.log("Tables created.");
};

client
    .connect()
    .then(() => createTables())
    .catch(console.error);
