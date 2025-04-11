// server/db.js
require("dotenv").config();
const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

// Connect using DATABASE_URL from environment or default locally.
const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/simple_ecommerce_db"
);

/*
  createTables:
  - Drops existing tables (order dependent) and creates new ones for:
    • users
    • products
    • carts
    • cart_items
    • orders
*/
const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart_items;
    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price NUMERIC(10,2) NOT NULL,
      image TEXT,
      category VARCHAR(100),
      stock INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE carts(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE cart_items(
      id SERIAL PRIMARY KEY,
      cart_id UUID REFERENCES carts(id) NOT NULL,
      product_id INTEGER REFERENCES products(id) NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0)
    );
    
    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      total NUMERIC(10,2) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Created',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
    await client.query(SQL);
};

/* USER FUNCTIONS */

// Create a new user (hashes the password)
const createUser = async ({ email, password, name }) => {
    const SQL = `
    INSERT INTO users(id, email, password, name)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await client.query(SQL, [
        uuid.v4(),
        email,
        hashedPassword,
        name,
    ]);
    return response.rows[0];
};

// (Simple) Authenticate a user—return the user record if valid.
const authenticateUser = async ({ email, password }) => {
    const SQL = `SELECT * FROM users WHERE email = $1`;
    const response = await client.query(SQL, [email]);
    if (!response.rows.length) {
        const error = Error("Invalid credentials");
        error.status = 401;
        throw error;
    }
    const user = response.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        const error = Error("Invalid credentials");
        error.status = 401;
        throw error;
    }
    return user;
};

/* PRODUCT FUNCTIONS */

const createProduct = async ({
    name,
    description,
    price,
    image,
    category,
    stock,
}) => {
    const SQL = `
    INSERT INTO products(name, description, price, image, category, stock)
    VALUES($1, $2, $3, $4, $5, $6)
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

const fetchProducts = async () => {
    const SQL = `SELECT * FROM products ORDER BY name ASC`;
    const response = await client.query(SQL);
    return response.rows;
};

/* CART FUNCTIONS */

// When a user registers, you might create an empty cart for them.
const createCartForUser = async (user_id) => {
    const SQL = `
    INSERT INTO carts(id, user_id)
    VALUES($1, $2)
    RETURNING *
  `;
    const response = await client.query(SQL, [uuid.v4(), user_id]);
    return response.rows[0];
};

const fetchCartByUserId = async (user_id) => {
    const SQL = `SELECT * FROM carts WHERE user_id = $1`;
    const response = await client.query(SQL, [user_id]);
    return response.rows[0];
};

const addItemToCart = async ({ cart_id, product_id, quantity }) => {
    const SQL = `
    INSERT INTO cart_items(cart_id, product_id, quantity)
    VALUES($1, $2, $3)
    RETURNING *
  `;
    const response = await client.query(SQL, [cart_id, product_id, quantity]);
    return response.rows[0];
};

const updateCartItem = async ({ id, quantity }) => {
    const SQL = `
    UPDATE cart_items
    SET quantity = $1
    WHERE id = $2
    RETURNING *
  `;
    const response = await client.query(SQL, [quantity, id]);
    return response.rows[0];
};

const removeCartItem = async (id) => {
    const SQL = `DELETE FROM cart_items WHERE id = $1 RETURNING *`;
    const response = await client.query(SQL, [id]);
    return response.rows[0];
};

/* ORDER FUNCTIONS */

const createOrder = async ({ user_id, total }) => {
    const SQL = `
    INSERT INTO orders(id, user_id, total)
    VALUES($1, $2, $3)
    RETURNING *
  `;
    const response = await client.query(SQL, [uuid.v4(), user_id, total]);
    return response.rows[0];
};

module.exports = {
    client,
    createTables,
    createUser,
    authenticateUser,
    createProduct,
    fetchProducts,
    fetchCustomers: async () => {
        const SQL = `SELECT * FROM users ORDER BY name ASC`;
        const response = await client.query(SQL);
        return response.rows;
    },
    createCartForUser,
    fetchCartByUserId,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    createOrder,
};
