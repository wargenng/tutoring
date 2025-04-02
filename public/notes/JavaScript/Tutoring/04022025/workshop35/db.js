const pg = require("pg");
const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/the_acme_store_db"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    
    CREATE TABLE users (
        id UUID PRIMARY KEY,
        username VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL
    );
    CREATE TABLE products (
        id UUID PRIMARY KEY,
        name VARCHAR(200)
    );
    CREATE TABLE favorites (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        product_id UUID REFERENCES products(id) NOT NULL,
        CONSTRAINT unique_user_id_and_product_id UNIQUE (user_id, product_id)
    );`;
    await client.query(SQL);
};

const createProduct = async ({ name }) => {
    const SQL = `
        INSERT INTO products(id, name) VALUES($1, $2) RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};

const createUser = async ({ username, password }) => {
    const SQL = `
        INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *;
    `;
    const response = await client.query(SQL, [
        uuid.v4(),
        username,
        await bcrypt.hash(password, 5),
    ]);
    return response.rows[0];
};

const createFavorite = async ({ product_id, user_id }) => {
    const SQL = `
        INSERT INTO favorites(id, product_id, user_id) VALUES($1, $2, $3) RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), product_id, user_id]);
    return response.rows[0];
};

const fetchProducts = async () => {
    const SQL = `
        SELECT * FROM products;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchUsers = async () => {
    const SQL = `
        SELECT * FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchFavoritesByUserId = async (user_id) => {
    const SQL = `
        SELECT * FROM favorites WHERE user_id = $1;
    `;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
};

const destroyFavorite = async ({ user_id, id }) => {
    //id in this context is the favorites ID
    const SQL = `
        DELETE FROM favorites WHERE user_id=$1 AND id=$2;
    `;
    await client.query(SQL, [user_id, id]);
};

module.exports = {
    client,
    createTables,
    createProduct,
    createUser,
    createFavorite,
    fetchProducts,
    fetchUsers,
    fetchFavoritesByUserId,
    destroyFavorite,
};
