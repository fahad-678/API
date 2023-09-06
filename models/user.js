const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    { _id: false }
);

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifiedEmail: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    profileImage: [
        {
            _id: Schema.Types.ObjectId,
            path: {
                type: String,
            },
        },
    ],
    phNumber: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    cart: [cartSchema],

    likedProduct: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
