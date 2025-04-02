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

// For deployment: serve static files (if a front-end exists)
app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
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
        res.send(await fetchCustomers());
    } catch (ex) {
        next(ex);
    }
});

// GET /api/restaurants: Returns an array of restaurants.
app.get("/api/restaurants", async (req, res, next) => {
    try {
        res.send(await fetchRestaurants());
    } catch (ex) {
        next(ex);
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
    } catch (ex) {
        next(ex);
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
    } catch (ex) {
        next(ex);
    }
});

// DELETE /api/customers/:customer_id/reservations/:id:
// Deletes a reservation.
app.delete(
    "/api/customers/:customer_id/reservations/:id",
    async (req, res, next) => {
        try {
            await destroyReservation({ reservation_id: req.params.id });
            res.sendStatus(204);
        } catch (ex) {
            next(ex);
        }
    }
);

// ------------------------------
// Global Error Handling Middleware
// ------------------------------
app.use((req, res, next) => {
    res.status(404).send({ error: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send({
        error: err.message || "An unexpected error occurred.",
    });
});

// ------------------------------
// Initialization & Testing
// ------------------------------
const init = async () => {
    try {
        const port = 3000;
        console.log("Connecting to database...");
        await client.connect();
        console.log("Connected to database.");

        await createTables();
        console.log("Tables created.");

        // Seed initial data: create two customers and two restaurants.
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
        console.log("Seeded customers and restaurants:");
        console.log(await fetchCustomers());
        console.log(await fetchRestaurants());

        // Testing: Fetch reservations (should be empty at first)
        console.log("Fetching reservations before creating any:");
        const preReservations = await client.query(
            `SELECT * FROM reservations`
        );
        console.log(preReservations.rows);

        // Testing: Create a reservation for Alice at The Great Steakhouse.
        const reservation = await createReservation({
            customer_id: customer1.id,
            restaurant_id: restaurant1.id,
            date: "2025-05-01T19:00:00Z",
            party_count: 4,
        });
        console.log("Created reservation:", reservation);

        // Fetch and log all reservations after creation.
        console.log("Fetching reservations after creation:");
        const allReservations = await client.query(`
      SELECT r.*, c.name AS customer_name, rest.name AS restaurant_name
      FROM reservations r
      JOIN customers c ON r.customer_id = c.id
      JOIN restaurants rest ON r.restaurant_id = rest.id
      ORDER BY r.date DESC
    `);
        console.log(allReservations.rows);

        // Testing: Delete the reservation.
        await destroyReservation({ reservation_id: reservation.id });
        console.log("Reservation deleted.");

        // Fetch reservations to confirm deletion.
        console.log("Fetching reservations after deletion:");
        const reservationsAfterDeletion = await client.query(
            `SELECT * FROM reservations`
        );
        console.log(reservationsAfterDeletion.rows);

        // Print out cURL commands for further testing.
        console.log("--------CURL Commands ---------");
        console.log(`curl localhost:${port}/api/customers`);
        console.log(`curl localhost:${port}/api/restaurants`);
        console.log(`curl localhost:${port}/api/reservations`);
        console.log(
            `curl -X POST localhost:${port}/api/customers/${customer1.id}/reservations -H "Content-Type: application/json" -d '{"restaurant_id": "${restaurant2.id}", "date": "2025-06-15T18:30:00Z", "party_count": 2}'`
        );
        console.log(
            `curl -X DELETE localhost:${port}/api/customers/${customer1.id}/reservations/${reservation.id} -v`
        );

        app.listen(port, () => console.log(`Listening on port ${port}`));
    } catch (error) {
        console.error("Error during initialization:", error);
    }
};

init();
