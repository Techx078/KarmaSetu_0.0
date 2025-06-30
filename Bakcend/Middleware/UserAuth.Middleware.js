const jsonwebtoken = require("jsonwebtoken");
const UserModel = require("../models/User");
const BlackListToken = require("../models/BlackListToken");

module.exports.UserAuth = async function (req, res, next) {
    try{
        let token = req.cookies.token || (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));
        if (!token){
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Check if the token is blacklisted
        const isBlacklisted = await BlackListToken.findOne({ token });
        if (isBlacklisted){
            return res.status(401).json({ error: "Token is blacklisted, please login again" });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired token, please login again" });
        }

        // Extract user ID from token
        const { _id } = decoded;
        if (!_id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
        }

        const User = await UserModel.findById(_id);
        if (!User) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        req.User = User;
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
