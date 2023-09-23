const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const createError = require("http-errors");

exports.saveImage = async (image) => {
    const imagePath = [];
    image.forEach((img) =>
        imagePath.push({
            path: img,
        })
    );
    return imagePath;
};

exports.unlinkImage = async (imgPath) => {
    imgPath.forEach((img) => unlink(img.path));
};

const unlink = async (imgPath) => {
    const Path = path.join(__dirname, "..", imgPath);
    fs.unlinkSync(Path, (err) => {
        next(createError.ServiceUnavailable("Unable to unlink Image"));
    });
};
