// server/db.js
require("dotenv").config();
const pg = require("pg");
const uuid = require("uuid");

// Connect to PostgreSQL using DATABASE_URL from the .env file (or a default value)
const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/simple_ecommerce_db"
);

/*
  createTables:
  - Drops existing tables and creates new ones for users, products, carts, cart_items, and orders.
  (For this simple example, we focus on users and products.)
*/
const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart_items;
    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    
    CREATE TABLE users (
      id UUID PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price NUMERIC(10,2) NOT NULL,
      image TEXT,
      category VARCHAR(100),
      stock INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    -- Additional tables (for carts, orders, etc.) can be created here if needed.
  `;
    await client.query(SQL);
};

/* USER FUNCTIONS */

// Create a new user
const createUser = async ({ email, password, name }) => {
    const SQL = `
    INSERT INTO users(id, email, password, name)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;
    // For simplicity, not hashing here; in production you must hash passwords.
    const response = await client.query(SQL, [
        uuid.v4(),
        email,
        password,
        name,
    ]);
    return response.rows[0];
};

// Fetch all users
const fetchUsers = async () => {
    const SQL = `SELECT * FROM users ORDER BY name ASC`;
    const response = await client.query(SQL);
    return response.rows;
};

/* PRODUCT FUNCTIONS */

// Create a new product
const createProduct = async ({
    name,
    description,
    price,
    image,
    category,
    stock,
}) => {
    const SQL = `
    INSERT INTO products(name, description, price, image, category, stock, created_at)
    VALUES($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
  `;
    const response = await client.query(SQL, [
        name,
        description,
        price,
        image,
        category,
        stock,
    ]);
    return response.rows[0];
};

// Fetch all products
const fetchProducts = async () => {
    const SQL = `SELECT * FROM products ORDER BY name ASC`;
    const response = await client.query(SQL);
    return response.rows;
};

/*
  seedDiscogsProducts:
  - Accepts an array of release IDs from Discogs.
  - For each release, calls the Discogs API and maps desired fields into a product.
  - Inserts the product into the products table.
*/
// Using native fetch in Node.js (v18+)
const seedDiscogsProducts = async (releaseIDs) => {
    for (const releaseId of releaseIDs) {
        try {
            const response = await fetch(
                `https://api.discogs.com/releases/${releaseId}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const release = await response.json();

            // Map Discogs fields to your product schema.
            const title = release.title || "Untitled";
            const description = `Released: ${
                release.released || "Unknown"
            }, Year: ${release.year || "Unknown"}, Artist: ${
                release.artists?.[0]?.name || "Unknown"
            }`;
            const price = release.lowest_price || 9.99; // Placeholder
            const image =
                release.images && release.images.length > 0
                    ? release.images[0].uri
                    : null;
            const category =
                release.genres && release.genres.length > 0
                    ? release.genres[0]
                    : "Unknown";
            const stock = 100; // Placeholder

            // Insert into your database (using a createProduct function)
            await createProduct({
                name: title,
                description,
                price,
                image,
                category,
                stock,
            });
            console.log(`Inserted product: ${title}`);
        } catch (error) {
            console.error(`Error seeding release ${releaseId}:`, error.message);
        }
    }
};

module.exports = {
    client,
    createTables,
    createUser,
    fetchUsers,
    createProduct,
    fetchProducts,
    seedDiscogsProducts,
};
