require("dotenv").config();
const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

// Use the DATABASE_URL environment variable or a default connection string.
const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/acme_review_site_db"
);

/*
  createTables:
    - Drops existing tables (comments, reviews, items, users).
    - Creates four tables:
      • users: holds user info (with a UUID primary key).
      • items: holds items to be reviewed.
      • reviews: holds user reviews for each item; each user can review an item only once.
      • comments: holds comments on reviews.
*/
const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS items;
    DROP TABLE IF EXISTS users;
    
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100) UNIQUE
    );
    
    CREATE TABLE items(
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      average_rating NUMERIC DEFAULT 0
    );
    
    CREATE TABLE reviews(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      item_id UUID REFERENCES items(id) NOT NULL,
      review_text TEXT,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT unique_user_item UNIQUE (user_id, item_id)
    );
    
    CREATE TABLE comments(
      id UUID PRIMARY KEY,
      review_id UUID REFERENCES reviews(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      comment_text TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
    await client.query(SQL);
};

/*
  createUser:
    - Inserts a new user with a UUID.
    - Hashes the password using bcrypt.
*/
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

/*
  authenticate:
    - Checks if a user exists with the provided username.
    - Compares the provided password with the hashed password.
    - If valid, returns an object with a token (here, we use the user's id as the token).
*/
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

/*
  findUserByToken:
    - Given a token (user id), returns the user's public data.
*/
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

/*
  createItem:
    - Inserts a new item into the items table.
*/
const createItem = async ({ name, description }) => {
    const SQL = `
    INSERT INTO items(id, name, description)
    VALUES($1, $2, $3)
    RETURNING *
  `;
    const response = await client.query(SQL, [uuid.v4(), name, description]);
    return response.rows[0];
};

/*
  fetchItems & fetchItemById:
    - Returns all items or a single item by id.
*/
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

/*
  createReview:
    - Inserts a new review for an item.
*/
const createReview = async ({ user_id, item_id, review_text, rating }) => {
    const SQL = `
    INSERT INTO reviews(id, user_id, item_id, review_text, rating)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
  `;
    const response = await client.query(SQL, [
        uuid.v4(),
        user_id,
        item_id,
        review_text,
        rating,
    ]);
    return response.rows[0];
};

/*
  fetchReviewsByItem & fetchReviewsByUser:
    - Retrieves reviews for a specific item or written by a specific user.
*/
const fetchReviewsByItem = async (item_id) => {
    const SQL = `
    SELECT r.*, u.username
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.item_id = $1
    ORDER BY r.created_at DESC
  `;
    const response = await client.query(SQL, [item_id]);
    return response.rows;
};

const fetchReviewsByUser = async (user_id) => {
    const SQL = `
    SELECT r.*, i.name AS item_name
    FROM reviews r
    LEFT JOIN items i ON r.item_id = i.id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC
  `;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
};

/*
  updateReview:
    - Updates a review's text and rating.
*/
const updateReview = async ({ user_id, review_id, review_text, rating }) => {
    const SQL = `
    UPDATE reviews
    SET review_text = $1, rating = $2, updated_at = NOW()
    WHERE id = $3 AND user_id = $4
    RETURNING *
  `;
    const response = await client.query(SQL, [
        review_text,
        rating,
        review_id,
        user_id,
    ]);
    return response.rows[0];
};

/*
  deleteReview:
    - Deletes a review by a given user.
*/
const deleteReview = async ({ user_id, review_id }) => {
    const SQL = `
    DELETE FROM reviews
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
    const response = await client.query(SQL, [review_id, user_id]);
    return response.rows[0];
};

/*
  createComment:
    - Inserts a new comment on a review.
*/
const createComment = async ({ review_id, user_id, comment_text }) => {
    const SQL = `
    INSERT INTO comments(id, review_id, user_id, comment_text)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;
    const response = await client.query(SQL, [
        uuid.v4(),
        review_id,
        user_id,
        comment_text,
    ]);
    return response.rows[0];
};

/*
  fetchCommentsByUser:
    - Retrieves all comments written by a user.
*/
const fetchCommentsByUser = async (user_id) => {
    const SQL = `
    SELECT c.*, r.review_text, i.name AS item_name
    FROM comments c
    LEFT JOIN reviews r ON c.review_id = r.id
    LEFT JOIN items i ON r.item_id = i.id
    WHERE c.user_id = $1
    ORDER BY c.created_at DESC
  `;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
};

/*
  updateComment & deleteComment:
    - Update or delete a comment by a user.
*/
const updateComment = async ({ user_id, comment_id, comment_text }) => {
    const SQL = `
    UPDATE comments
    SET comment_text = $1, updated_at = NOW()
    WHERE id = $2 AND user_id = $3
    RETURNING *
  `;
    const response = await client.query(SQL, [
        comment_text,
        comment_id,
        user_id,
    ]);
    return response.rows[0];
};

const deleteComment = async ({ user_id, comment_id }) => {
    const SQL = `
    DELETE FROM comments
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
    const response = await client.query(SQL, [comment_id, user_id]);
    return response.rows[0];
};

module.exports = {
    client,
    createTables,
    createUser,
    authenticate,
    findUserByToken,
    createItem,
    fetchItems,
    fetchItemById,
    createReview,
    fetchReviewsByItem,
    fetchReviewsByUser,
    updateReview,
    deleteReview,
    createComment,
    fetchCommentsByUser,
    updateComment,
    deleteComment,
};
