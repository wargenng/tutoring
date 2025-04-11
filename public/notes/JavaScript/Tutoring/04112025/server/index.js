// server/index.js
require("dotenv").config();
const express = require("express");
const app = express();
const {
    client,
    createTables,
    createUser,
    authenticateUser,
    createProduct,
    fetchProducts,
    createCartForUser,
    fetchCartByUserId,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    createOrder,
} = require("./db");

app.use(express.json());

// Simple API Routes

// Authentication Routes
app.post("/api/auth/register", async (req, res, next) => {
    try {
        const user = await createUser(req.body);
        // Create an empty cart for the new user.
        await createCartForUser(user.id);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
});

app.post("/api/auth/login", async (req, res, next) => {
    try {
        // For simplicity, return the user record (in production, return a JWT).
        const user = await authenticateUser(req.body);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

app.get("/api/auth/me", async (req, res, next) => {
    // Simplified: the token is expected to be passed in as the plain user id.
    try {
        const userId = req.headers.authorization; // In production, use proper token parsing
        if (!userId) {
            res.status(401).json({ error: "No token provided" });
            return;
        }
        const SQL = `SELECT id, email, name FROM users WHERE id = $1`;
        const response = await client.query(SQL, [userId]);
        res.json(response.rows[0]);
    } catch (err) {
        next(err);
    }
});

// Product Routes
app.get("/api/products", async (req, res, next) => {
    try {
        const products = await fetchProducts();
        res.json(products);
    } catch (err) {
        next(err);
    }
});

// Cart Routes (assume user is logged in and we pass user_id in headers for simplicity)
app.get("/api/cart", async (req, res, next) => {
    try {
        const user_id = req.headers.authorization;
        const cart = await fetchCartByUserId(user_id);
        res.json(cart);
    } catch (err) {
        next(err);
    }
});

app.post("/api/cart", async (req, res, next) => {
    // Expects: product_id, quantity in the body; user_id from header.
    try {
        const user_id = req.headers.authorization;
        const cart = await fetchCartByUserId(user_id);
        const cartItem = await addItemToCart({
            cart_id: cart.id,
            product_id: req.body.product_id,
            quantity: req.body.quantity,
        });
        res.status(201).json(cartItem);
    } catch (err) {
        next(err);
    }
});

app.put("/api/cart/:itemId", async (req, res, next) => {
    try {
        const updated = await updateCartItem({
            id: req.params.itemId,
            quantity: req.body.quantity,
        });
        res.json(updated);
    } catch (err) {
        next(err);
    }
});

app.delete("/api/cart/:itemId", async (req, res, next) => {
    try {
        await removeCartItem(req.params.itemId);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

// Order (Checkout) Route
app.post("/api/orders", async (req, res, next) => {
    try {
        // For simplicity, we'll assume the total is passed in the body.
        const user_id = req.headers.authorization;
        const order = await createOrder({ user_id, total: req.body.total });
        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
});

// Global error handler & 404 route
app.use((req, res, next) => res.status(404).json({ error: "Route not found" }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
});

// Initialization & Testing (Data Seeding)
const init = async () => {
    try {
        const port = 3000;
        console.log("Connecting to database...");
        await client.connect();
        console.log("Connected to database.");
        await createTables();
        console.log("Tables created.");

        // Seed initial data: one user and some products.
        const user = await createUser({
            email: "john@example.com",
            password: "johnpw",
            name: "John Doe",
        });
        const product1 = await createProduct({
            name: "Cool T-Shirt",
            description: "A trendy t-shirt.",
            price: 19.99,
            image: "https://example.com/tshirt.jpg",
            category: "Apparel",
            stock: 50,
        });
        const product2 = await createProduct({
            name: "Sneakers",
            description: "Stylish sneakers.",
            price: 49.99,
            image: "https://example.com/sneakers.jpg",
            category: "Footwear",
            stock: 30,
        });
        console.log("Seeded users and products.");
        console.log("Customers:", await client.query("SELECT * FROM users"));
        console.log("Products:", await fetchProducts());

        // Create a reservation as a test (optional for explaining checkout flow)
        const reservation = await createReservation({
            customer_id: user.id,
            restaurant_id: "dummy-restaurant-id", // In a full implementation, you'd create restaurants.
            date: "2025-05-01T19:00:00Z",
            party_count: 2,
        });
        console.log("Created test reservation:", reservation);

        // Print sample cURL commands
        console.log("--------CURL Commands ---------");
        console.log(`curl localhost:${port}/api/products`);
        console.log(
            `curl -X POST localhost:${port}/api/cart -H "Content-Type: application/json" -H "Authorization: ${user.id}" -d '{"product_id": ${product1.id}, "quantity": 2}'`
        );
        console.log(
            `curl localhost:${port}/api/orders -X POST -H "Content-Type: application/json" -H "Authorization: ${user.id}" -d '{"total": 39.98}'`
        );

        app.listen(port, () => console.log(`Listening on port ${port}`));
    } catch (error) {
        console.error("Error during initialization:", error);
    }
};

init();
