const { HttpError, Forbidden } = require("http-errors");

exports.routes = (req, res, next) =>
    res.status(404).json({ errorMsg: `Route not found.` });

exports.error = async(error, req, res, next) => {
    if (error instanceof Forbidden) {
        return res
            .status(403)
            .json({ Error: error, Msg: "Please Fill Right Information" });
    }
    if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ Error: error.message });
    }
    if (error.name == "SyntaxError") {
        return res.status(422).json({ Msg: `Invalid json object.` });
    }
    console.log(error);
    return res.status(500).json({ errorMsg: "Something went wrong" });
};
