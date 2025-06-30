const jsonwebtoken = require("jsonwebtoken");
const ServiceProviderModel = require("../models/ServiceProvider");
const BlackListToken = require("../models/BlackListToken");

module.exports.ServiceProviderAuth = async function(req, res, next) {
    try {
        let token = req.cookies.token || (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const isBlacklisted = await BlackListToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ error: "Token is blacklisted, please login again" });
        }

        let decoded;
        try {
            decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired token, please login again" });
        }

        const { _id } = decoded;
        if (!_id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
        }
        const serviceProvider = await ServiceProviderModel.findById(_id);
        if (!serviceProvider) {
            return res.status(401).json({ message: "Unauthorized: Service Provider not found" });
        }
        req.serviceProvider = serviceProvider;
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
