const express = require("express");

const cartHandler = require("../controller/cart");
const Auth = require("../middleware/is-auth");

const router = express.Router();

router.post("/cart", Auth, cartHandler.cart);
router.get("/cart", Auth, cartHandler.addToCart);
router.delete("/cart", Auth, cartHandler.deleteCartItem);

module.exports = router;
