// steps/05_comments.js
/*
  Step 5: Comments Functions
  - createComment: Inserts a new comment on a review.
  - fetchCommentsByUser: Retrieves all comments by a user.
  - updateComment: Updates a comment.
  - deleteComment: Deletes a comment.
*/

const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/acme_review_site_db"
);

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
    createComment,
    fetchCommentsByUser,
    updateComment,
    deleteComment,
};
