// server/index.js
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

const {
    client,
    createTables,
    createUser,
    fetchUsers,
    createProduct,
    fetchProducts,
    seedDiscogsProducts,
} = require("./db");

app.use(express.json());

// (Optional) Serve static files if a client exists.
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
app.use(
    "/assets",
    express.static(path.join(__dirname, "../client/dist/assets"))
);

// API Endpoints

// GET /api/users: Return all users.
app.get("/api/users", async (req, res, next) => {
    try {
        const users = await fetchUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
});

// GET /api/products: Return all products.
app.get("/api/products", async (req, res, next) => {
    try {
        const products = await fetchProducts();
        res.json(products);
    } catch (err) {
        next(err);
    }
});

// (Additional endpoints for cart, order, etc. could be added here.)

// Global error handling
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
});

// Initialization, Data Seeding, and Testing
const init = async () => {
    try {
        const port = 3000;
        console.log("Connecting to database...");
        await client.connect();
        console.log("Connected to database.");

        await createTables();
        console.log("Tables created.");

        // Seed some sample user data (e.g., for account creation)
        const user = await createUser({
            email: "john@example.com",
            password: "johnpw",
            name: "John Doe",
        });
        console.log("Seeded user:", user);

        // Call the Discogs seeding function to import products.
        // For this example, we create an array of a few Discogs release IDs.
        const releaseIDs = [33448895 /*, add more IDs as needed */];
        console.log("Seeding products from Discogs...");
        await seedDiscogsProducts(releaseIDs);

        // Log out the seeded products.
        const products = await fetchProducts();
        console.log("Seeded products:");
        console.log(products);

        // Print some sample cURL commands for manual testing.
        console.log("--------CURL Commands ---------");
        console.log(`curl localhost:${port}/api/users`);
        console.log(`curl localhost:${port}/api/products`);

        app.listen(port, () => console.log(`Listening on port ${port}`));
    } catch (error) {
        console.error("Error during initialization:", error);
    }
};

init();
