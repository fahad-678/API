const Product = require("../models/product");
const User = require("../models/user");
const imageHandler = require("../utils/imagePathHandler");
const createError = require("http-errors");

exports.likes = async (req, res, next) => {
    const prodId = req.query.prodId;

    const product = await Product.findById(prodId);
    const user = await User.findById(req.userId);
    let like = true;

    const index = user.likedProduct.indexOf(prodId);
    const prodIndex = product.userLiked.indexOf(prodId);

    if (index != -1) {
        user.likedProduct.splice(index, 1);
        product.userLiked.splice(prodIndex, 1);
        like = false;
    } else {
        user.likedProduct.push(prodId);
        product.userLiked.push(req.userId);
    }

    await product.save();
    await user.save();
    res.status(200).json({ like: like });
};

exports.userLiked = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const likedProduct = await user.likedProduct.populate();
    res.status(200).json(likedProduct);
};

exports.reviews = async (req, res, next) => {
    const prodId = req.body.prodId;
    const text = req.body.text;
    const stars = req.body.stars;
    const image = req.files["image"].map((f) => f.path);

    if(!image) return next(createError.InternalServerError("Invalid Image"))

    const product = await Product.findById(prodId);
    const user = await User.findById(req.userId);

    const index = user.reviews.indexOf(prodId);
    const productIndex = product.reviews.users.findIndex((userObj) =>
        userObj.user.equals(req.userId)
    );

    if (index == -1) {
        product.reviews.users.push({
            user: req.userId,
            text: text,
            stars: stars,
            imgPath: await imageHandler.saveImage(image),
        });
        user.reviews.push(prodId);
    } else {
        await imageHandler.unlinkImage(
            product.reviews.users[productIndex].imgPath
        );

        product.reviews.users[productIndex].text = text;
        product.reviews.users[productIndex].stars = stars;
        product.reviews.users[productIndex].imgPath =
            await imageHandler.saveImage(image);
    }
    await product.save();
    await user.save();

    res.status(200).json("Review created");
};

exports.deleteReview = async (req, res, next) => {
    const prodId = req.query.prodId;

    const product = await Product.findById(prodId);
    const user = await User.findById(req.userId);

    const index = user.reviews.indexOf(prodId);
    const productIndex = product.reviews.users.findIndex((userObj) =>
        userObj.user.equals(req.userId)
    );
    if (product.reviews.users[productIndex].imgPath[0])
        await imageHandler.unlinkImage(
            product.reviews.users[productIndex].imgPath
        );

    user.reviews.splice(index, 1);
    product.reviews.users.splice(productIndex, 1);

    await product.save();
    await user.save();

    res.status(200).json("Review Deleted");
};
