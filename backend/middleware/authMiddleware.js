const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token not found" });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = {
    authenticateUser
};
