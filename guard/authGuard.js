const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if(!token) {
        return res.status(401).json({mesage: "Access Denied."})
    }
    try {
        const decoded = jwt.verify(
            token.split(" ")[1],
            "b2df9426acb4bb8b88a66d983b"
        );
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Error verifying Token", error);
        return res.status(401).json({mesage: "Invalid Token."})
    }
}

module.exports = verifyToken;