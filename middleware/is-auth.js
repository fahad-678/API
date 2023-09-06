const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = async (req, res, next) => {
    const getheader = req.get("Authorization");
    if (!getheader) next(createError.Unauthorized("Authorization Failed"));
    const token = getheader.split(" ")[1];

    decodedToken = jwt.verify(token, "newSecretKey");
    if (!decodedToken) next(createError.Unauthorized("Please Login Again."));

    req.userId = decodedToken.id;
    next();
};
