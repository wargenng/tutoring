// steps/02_authentication.js
/*
  Step 2: Authentication Functions
  - createUser: Registers a new user (with password hashing).
  - authenticate: Validates user credentials and returns a token (using the user's ID).
  - findUserByToken: Retrieves a user based on the token.
*/

const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/acme_review_site_db"
);

const createUser = async ({ username, password, email }) => {
    const SQL = `
    INSERT INTO users(id, username, password, email)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;
    const hashedPassword = await bcrypt.hash(password, 5);
    const response = await client.query(SQL, [
        uuid.v4(),
        username,
        hashedPassword,
        email,
    ]);
    return response.rows[0];
};

const authenticate = async ({ username, password }) => {
    const SQL = `SELECT * FROM users WHERE username = $1`;
    const response = await client.query(SQL, [username]);
    if (!response.rows.length) {
        const error = Error("Not authorized");
        error.status = 401;
        throw error;
    }
    const user = response.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        const error = Error("Not authorized");
        error.status = 401;
        throw error;
    }
    return { token: user.id };
};

const findUserByToken = async (token) => {
    const SQL = `SELECT id, username, email FROM users WHERE id = $1`;
    const response = await client.query(SQL, [token]);
    if (!response.rows.length) {
        const error = Error("Not authorized");
        error.status = 401;
        throw error;
    }
    return response.rows[0];
};

module.exports = { createUser, authenticate, findUserByToken };
