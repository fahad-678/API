const Product = require("../models/product");
const User = require("../models/user");
const imageHandler = require("../utils/imagePathHandler");
const createError = require("http-errors");

const { validationResult } = require("express-validator");

//  --------------------------------------------------------------------------------------------------------------  //

exports.getProducts = async (req, res, next) => {
    const currentPage = req.query.currentPage || 1;
    const perPage = req.query.perPage || 17;

    const products = await Product.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);

    const totalPages = await Product.find().countDocuments();

    if (!products || !totalPages)
        return next(createError.InternalServerError("Cannot reach Database"));

    res.status(200).json({
        message: "Products Fetched",
        products: products,
        totalPages: totalPages,
        status: "success",
    });
};

exports.getAdminProducts = async (req, res, next) => {
    const userProducts = await User.findById(req.userId).populate("products");
    res.status(200).json({
        products: userProducts.products,
        status: "success",
    });
};

//  --------------------------------------------------------------------------------------------------------------  //

exports.getDetails = async (req, res, next) => {
    const prodId = req.params.prodId;
    const product = await Product.findById(prodId);

    if (!product)
        return next(createError.InternalServerError("Cannot reach Database"));

    res.status(200).json({ product: product, status: "success" });
};

//  --------------------------------------------------------------------------------------------------------------  //

exports.addProduct = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty())
        return next(createError.Forbidden(error.array()[0].msg))();

    const title = req.body.title;
    const image = req.files["image"].map((f) => f.path);
    const previewImage = req.files["previewImage"].map((f) => f.path);
    const price = req.body.price;
    const description = req.body.description;
    const quantity = req.body.quantity;

    if (!req.files)
        return next(createError.UnsupportedMediaType("Invalid File Type"));

    const product = new Product({
        title: title,
        imgPath: await imageHandler.saveImage(image),
        previewImage: await imageHandler.saveImage(previewImage),
        price: price,
        description: description,
        quantity: quantity,
    });
    const newProduct = await product.save();

    const user = await User.findById(req.userId);

    user.products.push(product._id);

    const updatedUser = await user.save();

    res.status(200).json({ newProduct, updatedUser });
};

//  --------------------------------------------------------------------------------------------------------------  //

exports.getEditProduct = async (req, res, next) => {
    const prodId = req.params.prodId;
    const product = await Product.findById(prodId);

    res.status(200).json(product);
};

//  --------------------------------------------------------------------------------------------------------------  //

exports.editProduct = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty())
        return next(createError.Forbidden(error.array()[0].msg));

    const prodId = req.query.prodId;
    const title = req.body.title;
    const image = req.files["image"].map((f) => f.path);
    const previewImage = req.files["previewImage"].map((f) => f.path);
    const price = req.body.price;
    const description = req.body.description;
    const quantity = req.body.quantity;

    const product = await Product.findById(prodId);

    await imageHandler.unlinkImage(product.imgPath);
    await imageHandler.unlinkImage(product.previewImage);

    product.title = title;
    product.imgPath = await imageHandler.saveImage(image);
    product.previewImage = await imageHandler.saveImage(previewImage);
    product.price = price;
    product.description = description;
    product.quantity = quantity;

    const newProduct = await product.save();
    res.status(200).json(newProduct);
};

//  --------------------------------------------------------------------------------------------------------------  //

exports.deleteProduct = async (req, res, next) => {
    const prodId = req.params.prodId;
    const product = await Product.findById(prodId);
    if (!product) {
        return createError.NotFound("Product Not Found");
    }
    await imageHandler.unlinkImage(product.imgPath);
    await imageHandler.unlinkImage(product.previewImage);
    await Product.findByIdAndRemove(prodId);
    const userProduct = await User.findById(req.userId);
    userProduct.products.map((a) => {
        if (a.toString() == prodId) {
            userProduct.products.splice(userProduct.products.indexOf(a), 1);
        }
    });
    const user = await userProduct.save();
    res.status(200).json({ deleted: true, user: user });
};
    