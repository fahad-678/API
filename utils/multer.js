const multer = require("multer");

exports.diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "--" + file.originalname);
    },
});

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype == "image/png" ||
//     file.mimetype == "image/jpg" ||
//     file.mimetype == "image/jpeg"
//   )
//     cb(null, true);
//   else cb(null, false);
// };

// exports.multerHandler = multer({
//   storage: diskStorage,
// })
// .fields([
//   { name: "image", maxCount: 10 },
//   { name: "previewImage", maxCount: 1 },
// ]);
