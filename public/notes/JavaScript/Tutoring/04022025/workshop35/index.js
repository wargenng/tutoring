require("dotenv").config();
const {
    client,
    createTables,
    createProduct,
    createUser,
    createFavorite,
    fetchProducts,
    fetchUsers,
    fetchFavoritesByUserId,
    destroyFavorite,
} = require("./db");
const express = require("express");
const app = express();

app.use(express.json());

/*
  API ROUTES
*/

// GET /api/products: Retrieve all products.
app.get("/api/products", async (req, res, next) => {
    try {
        const products = await fetchProducts();
        res.send(products);
    } catch (ex) {
        next(ex);
    }
});

// GET /api/users: Retrieve all users.
app.get("/api/users", async (req, res, next) => {
    try {
        const users = await fetchUsers();
        res.send(users);
    } catch (ex) {
        next(ex);
    }
});

// GET /api/users/:id/favorites: Retrieve favorites for a given user.
app.get("/api/users/:id/favorites", async (req, res, next) => {
    try {
        const favorites = await fetchFavoritesByUserId(req.params.id);
        res.send(favorites);
    } catch (ex) {
        next(ex);
    }
});

// POST /api/users/:id/favorites: Create a new favorite for a user.
// Expects a JSON body with "product_id".
app.post("/api/users/:id/favorites", async (req, res, next) => {
    try {
        const favorite = await createFavorite({
            user_id: req.params.id,
            product_id: req.body.product_id,
        });
        res.status(201).send(favorite);
    } catch (ex) {
        next(ex);
    }
});

// DELETE /api/users/:userId/favorites/:id: Delete a favorite.
app.delete("/api/users/:userId/favorites/:id", async (req, res, next) => {
    try {
        await destroyFavorite({
            user_id: req.params.userId,
            id: req.params.id,
        });
        res.sendStatus(204);
    } catch (ex) {
        next(ex);
    }
});

/*
  Global Error Handling Middleware
*/
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send({
        error: err.message || "An unexpected error occurred.",
    });
});

/*
  INITIALIZATION & DATA SEEDING WITH TESTING
*/
const init = async () => {
    const port = 3000;
    await client.connect();
    console.log("Connected to database");

    await createTables();
    console.log("Created tables yay");

    // Seed the database with products and users.
    const [jeans, tshirt, shoes, socks, bob, sam, millie, nigel] =
        await Promise.all([
            createProduct({ name: "jeans" }),
            createProduct({ name: "tshirt" }),
            createProduct({ name: "shoes" }),
            createProduct({ name: "socks" }),
            createUser({ username: "bobuser", password: "bobpw" }),
            createUser({ username: "samuser", password: "sampw" }),
            createUser({ username: "millieuser", password: "milliepw" }),
            createUser({ username: "nigeluser", password: "nigelpw" }),
        ]);
    console.log("Seeded with products and users!");

    console.log("Products:", await fetchProducts());
    console.log("Users:", await fetchUsers());

    // Test favorites: Fetch favorites before adding.
    console.log(
        "Attempt to fetch favorites before adding:",
        await fetchFavoritesByUserId(nigel.id)
    );

    // Create a favorite for Nigel.
    const favorite = await createFavorite({
        product_id: shoes.id,
        user_id: nigel.id,
    });
    console.log("Favorite created:", favorite);

    // Fetch favorites after adding.
    console.log(
        "Favorites after adding:",
        await fetchFavoritesByUserId(nigel.id)
    );

    // Delete the favorite.
    await destroyFavorite({ user_id: nigel.id, id: favorite.id });
    console.log("Favorite deleted for Nigel.");

    // Print some sample cURL commands to test the API routes.
    console.log("--------CURL Commands ---------");
    console.log(`curl localhost:${port}/api/users`);
    console.log(`curl localhost:${port}/api/products`);
    console.log(`curl localhost:${port}/api/users/${nigel.id}/favorites`);

    const favoriteToDelete = await createFavorite({
        user_id: millie.id,
        product_id: jeans.id,
    });

    console.log("==== RUN TO TEST DELETE ====");
    console.log(`curl localhost:${port}/api/users/${millie.id}/favorites`);
    console.log(
        `curl -X DELETE localhost:${port}/api/users/${millie.id}/favorites/${favoriteToDelete.id} -v`
    );
    console.log(`curl localhost:${port}/api/users/${millie.id}/favorites`);

    app.listen(port, () => console.log(`Listening on port ${port}`));
};

init();
