const Cart = require("../models/cart");
const User = require("../models/user");

exports.cart = async (req, res, next) => {
    const user = await User.findById(req.userId);

    if (user) res.status(200).json(user.cart[0].products);
    else res.status(200).json("No Products");
};

exports.addToCart = async (req, res, next) => {
    const prodId = req.query.prodId;
    const quantity = req.query.quantity;

    const user = await User.findById(req.userId);

    if (user.cart.length === 0) {
        user.cart = new Cart({
            products: { product: prodId, quantity: quantity },
        });
    } else {
        user.cart[0].products.push({ product: prodId, quantity: quantity });
    }

    await user.save();
    res.status(200).json(user);
};

exports.deleteCartItem = async (req, res, next) => {
    const prodId = req.query.prodId;

    const user = await User.findById(req.userId);

    user.cart[0].products.pull({ product: prodId });

    await user.save();
    res.status(200).json(user);
};
