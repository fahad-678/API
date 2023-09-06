const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");

const utilController = require("../controller/productsUtils");
const destHandler = require("../utils/multer");
const Auth = require("../middleware/is-auth");
const validator = require("../utils/validation");

const multerHandler = multer({ storage: destHandler.diskStorage });
const multerFields = multerHandler.fields([{ name: "image", maxCount: 10 }]);

const router = express.Router();

router.get("/Product/like", Auth, utilController.likes);
router.get("/Product/likedProducts", Auth, utilController.userLiked);
router.post(
    "/Product/review",
    Auth,
    multerFields,
    validator.reviewValidator,
    utilController.reviews
);
router.delete("/Product/review", Auth, utilController.deleteReview);

module.exports = router;
