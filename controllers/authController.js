const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const auth = (req, res, next) => {
    try {
        let token = req.headers.auth.split(' ')[1];
        console.log('token')
        let decode = jwt.verify(token, 'secret')
        req.user = decode
        next();
    } catch (err) {
        res.send(new AppError(401, "fail", "Auth Failed!"))
    }
}

module.exports = { auth };