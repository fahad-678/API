exports.verifyEmail = (to,random) => ({
    from: "shop@gmail.com",
    to: to,
    subject: "Verify Email",
    html: `<p>${random}</p>`,
});
