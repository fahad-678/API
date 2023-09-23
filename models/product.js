const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    imgPath: [
        {
            path: {
                type: String,
                required: true,
            },
        },
    ],
    previewImage: [
        {
            path: {
                type: String,
                required: true,
            },
        },
    ],

    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    userLiked: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    reviews: {
        users: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                text: {
                    type: String,
                },
                stars: {
                    type: Number,
                    required: true,
                },
                imgPath: [
                    {
                        _id: Schema.Types.ObjectId,
                        path: {
                            type: String,
                        },
                    },
                ],
            },
        ],
    },
});

module.exports = mongoose.model("Product", productSchema);
