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

const init = async () => {
    const port = 3000;
    await client.connect();
    console.log("connected to database");

    await createTables();
    console.log("created tables yay");

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
    console.log("seeded with products and users!");

    console.log(await fetchProducts());
    console.log(await fetchUsers());

    console.log(
        "attempt to fetch fav before adding",
        await fetchFavoritesByUserId(nigel.id)
    );
    const favorite = await createFavorite({
        product_id: shoes.id,
        user_id: nigel.id,
    });
    console.log("attempt to fetch fav after adding", favorite);

    await fetchFavoritesByUserId(nigel.id);
    await destroyFavorite({ user_id: nigel.id, id: favorite.id });

    console.log("--------CURL Commands ---------");
    console.log(`curl localhost:${port}/api/users`);

    console.log(`curl localhost:${port}/api/users/${nigel.id}/favorites`);

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

    app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
