const randomString = require("randomstring");

module.exports = randomString.generate({ charset: "numeric", length: 6 });
