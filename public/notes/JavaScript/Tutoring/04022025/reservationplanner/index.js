// server/index.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    destroyReservation,
} = require("./db");

app.use(express.json());

// For deployment: Serve static files if a front-end exists.
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
app.use(
    "/assets",
    express.static(path.join(__dirname, "../client/dist/assets"))
);

// ------------------------------
// RESTful Routes
// ------------------------------

// GET /api/customers: Returns an array of customers.
app.get("/api/customers", async (req, res, next) => {
    try {
        const customers = await fetchCustomers();
        res.send(customers);
    } catch (error) {
        next(error);
    }
});

// GET /api/restaurants: Returns an array of restaurants.
app.get("/api/restaurants", async (req, res, next) => {
    try {
        const restaurants = await fetchRestaurants();
        res.send(restaurants);
    } catch (error) {
        next(error);
    }
});

// GET /api/reservations: Returns an array of reservations (with customer and restaurant details).
app.get("/api/reservations", async (req, res, next) => {
    try {
        const SQL = `
      SELECT r.*, c.name AS customer_name, rest.name AS restaurant_name
      FROM reservations r
      JOIN customers c ON r.customer_id = c.id
      JOIN restaurants rest ON r.restaurant_id = rest.id
      ORDER BY r.date DESC
    `;
        const result = await client.query(SQL);
        res.send(result.rows);
    } catch (error) {
        next(error);
    }
});

// POST /api/customers/:id/reservations:
// Creates a reservation for a customer; expects restaurant_id, date, and party_count in the payload.
app.post("/api/customers/:id/reservations", async (req, res, next) => {
    try {
        const customer_id = req.params.id;
        const { restaurant_id, date, party_count } = req.body;
        const reservation = await createReservation({
            customer_id,
            restaurant_id,
            date,
            party_count,
        });
        res.status(201).send(reservation);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/customers/:customer_id/reservations/:id:
// Deletes a reservation (returns 204 on success).
app.delete(
    "/api/customers/:customer_id/reservations/:id",
    async (req, res, next) => {
        try {
            const { id } = req.params; // reservation id
            await destroyReservation({ reservation_id: id });
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
);

// Bonus: Error handling for unknown routes.
app.use((req, res, next) => {
    res.status(404).send({ error: "Route not found" });
});

// Global error handling middleware.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send({
        error: err.message || "An unexpected error occurred.",
    });
});

// ------------------------------
// Server Initialization & Data Seeding
// ------------------------------
const init = async () => {
    try {
        console.log("Connecting to database...");
        await client.connect();
        console.log("Connected to database.");
        await createTables();
        console.log("Tables created.");

        // Seed initial data
        const [customer1, customer2, restaurant1, restaurant2] =
            await Promise.all([
                createCustomer({ name: "Alice", email: "alice@example.com" }),
                createCustomer({ name: "Bob", email: "bob@example.com" }),
                createRestaurant({
                    name: "The Great Steakhouse",
                    location: "123 Main St",
                }),
                createRestaurant({
                    name: "Pasta Paradise",
                    location: "456 Olive Ave",
                }),
            ]);

        console.log(await fetchCustomers());
        console.log(await fetchRestaurants());
        console.log("Data seeded.");

        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Listening on port ${port}`));
    } catch (error) {
        console.error("Error initializing application:", error);
    }
};

init();
