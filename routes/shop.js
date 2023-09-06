const express = require("express");

const shopController = require("../controller/product");

const router = express.Router();

router.get("/", shopController.getProducts);

router.post("/Product", shopController.getDetails);

module.exports = router;
