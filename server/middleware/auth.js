const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
    try {

        // Check for token in Authorization header or cookies
        let token;
        
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else {
            token = req.cookies.token;
        }

        // If no token is found, return an error
        if (!token) {
            return res.status(401).json({ message: "Please Login!" });
        }

        // Verify the token and extract the user ID
        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedObj;

        // Find the user in the database using the extracted user ID
        const user = await User.findById(_id);
        // If the user is not found, return an error
        if (!user) {
            throw new Error("User not found");
        }

        // Attach the user object to the request for further use in the route handlers
        req.user = user;
        // Call the next middleware or route handler
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = userAuth;