const jwt = require("jsonwebtoken");
const User = require("../models/User");

// check if the user is authenticated or not by verifying the token in the request cookies
const userAuth = async (req, res, next) => {
    try {

        //read the token from the request cookies and if the token is not present then throw an error
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please Login!");
        }

        //verify the token and get the decoded object from the token
        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

        //get the user id from the decoded object and find the user in the database and if the user is not found then throw an error
        const { _id } = decodedObj;

        //find the user
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        //attached user to the request object so that we can access it in the next middleware or route handler
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

module.exports = userAuth;