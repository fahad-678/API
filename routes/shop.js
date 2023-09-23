const express = require("express");

const shopController = require("../controller/product");

const router = express.Router();

router.get("/", shopController.getProducts);

router.post("/:prodId", shopController.getDetails);

module.exports = router;
    