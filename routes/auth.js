const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controller/auth");
const destHandler = require("../utils/multer");
const Auth = require("../middleware/is-auth");
const validator = require("../utils/validation");

const multerHandler = multer({ storage: destHandler.diskStorage });
const multerFields = multerHandler.single("profileImage");

router.post(
    "/signup",
    multerFields,
    validator.emailValidator,
    validator.loginValidator,
    authController.signup
);
router.put("/signup", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/profile", Auth, authController.editProfile);
router.put(
    "/profile",
    Auth,
    multerFields,
    validator.loginValidator,
    authController.updateProfile
);

module.exports = router;
