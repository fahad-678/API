const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const createError = require("http-errors");

exports.saveImage = async (image) => {
    const imagePath = [];
    image.forEach((img) =>
        imagePath.push({
            _id: new mongoose.Types.ObjectId(),
            path: img,
        })
    );
    return imagePath;
};

exports.unlinkImage = async (imgPath) => {
    console.log(imgPath)
    imgPath.forEach((img) => unlink(img.path));
};

const unlink = async (imgPath) => {
    const Path = path.join(__dirname, "..", imgPath);
    fs.unlinkSync(Path, (err) => {
        next(createError.ServiceUnavailable("Unable to unlink Image"));
    });
};
