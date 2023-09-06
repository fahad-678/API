const { body } = require("express-validator");
const User = require("../models/user");

exports.emailValidator = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Write a Valid Email")
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: value });
            if (user) return Promise.reject("Email Already Exists");
        }),
];
const userDataValidator = [
    body("password")
        .trim()
        .isLength({ min: 5, max: 50 })
        .withMessage("Password must be greater than 5 letters"),
    body("name").trim().isLength({ min: 1, max: 20 }).withMessage("Enter Name"),
    body("phNumber").trim(),
    body("address").trim(),
];

exports.loginValidator = userDataValidator;

exports.updateProfile = userDataValidator;

exports.productValidator = [
    body("title")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Minimum size 3 & Maximum size 50"),
    body("description")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Minimum size 3 & Maximum size 50"),
    body("price")
        .trim()
        .isNumeric({ min: 0 })
        .withMessage("Minimum price is 0"),
    body("quantity")
        .trim()
        .isNumeric({ min: 0 })
        .withMessage("Must be Greater than 0"),
];

exports.reviewValidator = [
    body("text")
        .trim()
        .isLength({ min: 0, max: 100 })
        .withMessage("Maximum size 100"),
    body("stars")
        .trim()
        .isNumeric({ min: 0, max: 5 })
        .withMessage("Minimum 0 && Maximum 5"),
];
