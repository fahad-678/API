const express = require("express");

const shopRoutes = require("./routes/shop");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const utilRoutes = require("./routes/util");

const errorHandler = require("./error/error");
const authorization = require("./utils/authorization");
const Path = require("./utils/path");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const shop = express();

shop.use(authorization);

shop.use(bodyParser.json());
shop.use(Path.imagePath);

shop.use(shopRoutes);
shop.use(productRoutes);
shop.use(authRoutes);
shop.use(cartRoutes);
shop.use(utilRoutes);

shop.use(errorHandler.routes);
shop.use(errorHandler.error);

mongoose
    .connect("mongodb+srv://testing:test@cluster0.5z60ejk.mongodb.net/SHOP")
    .then(() => {
        shop.listen(3000);
        console.log("Connected");
    });
