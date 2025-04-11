// discogsSeeder.js
require("dotenv").config();
const axios = require("axios");
const { Client } = require("pg");

// Connect to your local database:
const client = new Client({
    connectionString:
        process.env.DATABASE_URL || "postgres://localhost/your_db",
});

// Define the base URL for Discogs API.
const DISCOS_API_BASE = "https://api.discogs.com";

// Example list of release IDs to seed.
const releaseIDs = [33448895 /* add more release IDs here */];

const seedDiscogsData = async () => {
    try {
        await client.connect();
        console.log("Connected to DB");

        // Loop over each release ID
        for (const releaseId of releaseIDs) {
            try {
                // Get release data from Discogs.
                const response = await axios.get(
                    `${DISCOS_API_BASE}/releases/${releaseId}`
                );
                const release = response.data;

                // Map fields from Discogs to your own product schema.
                const title = release.title || "Untitled";
                const year = release.year || "Unknown";
                const mainArtist =
                    release.artists && release.artists.length > 0
                        ? release.artists[0].name
                        : "Unknown Artist";
                const mainLabel =
                    release.labels && release.labels.length > 0
                        ? release.labels[0].name
                        : "Unknown Label";
                const genre =
                    release.genres && release.genres.length > 0
                        ? release.genres[0]
                        : "Unknown";
                const imageUrl =
                    release.images && release.images.length > 0
                        ? release.images[0].uri
                        : null;

                // Insert this data into your own products table.
                // Assume you have a products table with fields:
                // (id, name, description, price, image, category, stock, created_at)
                const SQL = `
          INSERT INTO products(name, description, price, image, category, stock, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
          RETURNING *
        `;
                const values = [
                    title,
                    `Year: ${year}, Artist: ${mainArtist}, Label: ${mainLabel}`,
                    9.99, // placeholder price
                    imageUrl,
                    genre,
                    100, // placeholder stock
                ];

                const insertRes = await client.query(SQL, values);
                console.log("Inserted:", insertRes.rows[0]);
            } catch (innerErr) {
                console.error(
                    `Error fetching or inserting release ${releaseId}:`,
                    innerErr.message
                );
            }
        }

        console.log("Seeding complete");
    } catch (err) {
        console.error("Error during seeding:", err);
    } finally {
        await client.end();
        console.log("Disconnected from DB");
    }
};

seedDiscogsData();
