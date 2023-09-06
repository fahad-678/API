const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");

const productController = require("../controller/product");
const destHandler = require("../utils/multer");
const Auth = require("../middleware/is-auth");
const validator = require("../utils/validation");

const multerHandler = multer({ storage: destHandler.diskStorage });
const multerFields = multerHandler.fields([
    { name: "image", maxCount: 10 },
    { name: "previewImage", maxCount: 1 },
]);

const router = express.Router();

router.get(
    "/Product",
    Auth,
    multerFields,
    validator.productValidator,
    productController.addProduct
);

router.post("/Product:prodId", Auth, productController.getEditProduct);
router.put(
    "/Product",
    Auth,
    multerFields,
    validator.productValidator,
    productController.editProduct
);

router.delete("/Product:prodId", Auth, productController.deleteProduct);

module.exports = router;
