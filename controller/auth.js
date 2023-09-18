const User = require("../models/user");
const imageHandler = require("../utils/imagePathHandler");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const createError = require("http-errors");

const mail = require("../utils/nodemailer/mail");
const transporter = require("../utils/nodemailer/nodeMail");
const randomString = require("../utils/random");

exports.signup = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(createError.Forbidden(error.array()[0].msg));
    }
    const email = req.body.email;
    const password = req.body.password;
    const random = randomString;
    const name = req.body.name;
    const profileImage = [req.file.path];
    const phNumber = req.body.phNumber;
    const address = req.body.address;

    // await transporter.sendMail(mail.verifyEmail(email, random), (error, info) => {
    //     if (error)
    //         return next(createError.InternalServerError("Mail Not Send"));
    // });

    const hash = await bcrypt.hash(password, 12);

    const user = new User({
        email: email,
        password: hash,
        verifiedEmail: random,
        name: name,
        profileImage: await imageHandler.saveImage(profileImage),
        phNumber: phNumber,
        address: address,
    });

    const newUser = await user.save();

    res.status(200).json(newUser);
};

exports.verifyEmail = async (req, res, next) => {
    const email = req.query.email;
    const random = req.query.random;

    const user = await User.findOne({ email: email });
    if (user.verifiedEmail == random) {
        user.verifiedEmail = "true";
    } else {
        return res.status(400).json("Verification failed");
    }
    const verifiedUser = await user.save();
    res.status(200).json("User Verified");
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (!user) return next(createError.NotFound("User not found"));

    const passwordHash = await bcrypt.compare(password, user.password);
    if (!passwordHash) return next(createError.Unauthorized("Wrong password"));

    const token = await jwt.sign(
        { id: user._id, email: user.email },
        "newSecretKey"
        // { expiresIn: "2h" }
    );
    if (!token) return next(createError.BadRequest());

    res.status(200).json({
        userName: user.name,
        userEmail: user.email,
        token: token,
        status: "success",
    });
};

exports.editProfile = async (req, res, next) => {
    const user = await User.findById(req.userId);

    res.status(200).json(user);
};

exports.updateProfile = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return next(createError.Forbidden());

    const name = req.body.name;
    const password = req.body.password;
    const profileImage = [req.file.path];
    const phNumber = req.body.phNumber;
    const address = req.body.address;

    const hash = await bcrypt.hash(password, 12);

    const user = await User.findById(req.userId);

    if (profileImage) await imageHandler.unlinkImage(user.profileImage);

    user.name = name;
    user.password = hash;
    user.profileImage = await imageHandler.saveImage(profileImage);
    user.phNumber = phNumber;
    user.address = address;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
};
