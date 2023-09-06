const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: `smtp.mailtrap.io`,
    port: 2525,
    auth: {
        user: "fake1236565@gmail.com",
        pass: "fake6565",
        accessToken: "b5ee11a946e86c108649410d0bb34a346"
    },
});



module.exports = transporter;
