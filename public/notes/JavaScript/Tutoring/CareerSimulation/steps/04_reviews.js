// steps/04_reviews.js
/*
  Step 4: Reviews Functions
  - createReview: Adds a new review.
  - fetchReviewsByItem: Gets all reviews for a specific item.
  - fetchReviewsByUser: Gets all reviews written by a user.
  - updateReview: Updates a review.
  - deleteReview: Deletes a review.
*/

const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/acme_review_site_db"
);

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

const deleteReview = async ({ user_id, review_id }) => {
    const SQL = `
    DELETE FROM reviews
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
    const response = await client.query(SQL, [review_id, user_id]);
    return response.rows[0];
};

module.exports = {
    createReview,
    fetchReviewsByItem,
    fetchReviewsByUser,
    updateReview,
    deleteReview,
};
