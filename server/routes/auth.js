const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { validateSignUpData, validateLoginData } = require('../utils/authValidation');

// Create a router for authentication-related routes
const authRouter = express.Router();

// Define cookie options for setting the JWT token in the cookie
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
};

authRouter.post("/register", async (req, res) => {
    try {
        //Check if the data is valid ---
        validateSignUpData(req);

        // Extract the name, email, and password from the request body
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving it to the database
        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({ name, email, password: passwordHash });

        const savedUser = await user.save();

        //after signup the user will be automatically logged in and for that we need to generate a JWT token for the user and send it to the frontend in the cookie so
        //that the frontend can use that token to authenticate the user in subsequent requests
        //generating a JWT token for the  signed-up user
        const token = await savedUser.getJWT();

        //setting the token in the cookie with an expiry time of 8 hours (8 * 3600000 milliseconds)
        res.cookie("token", token, COOKIE_OPTIONS);

        res.json({ message: 'User registered successfully', name: savedUser.name, email: savedUser.email });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        //Check if the data is valid and missing ---
        validateLoginData(req);

        const { email, password } = req.body;

        //we need to check if the user exists in the database 
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isPasswordMatching = await user.comparePassword(password)

        if (isPasswordMatching) {

            const token = await user.getJWT()

            res.cookie("token", token, COOKIE_OPTIONS);

            res.json({ message: "login Successful", data: { name: user.name, emailId: user.email } });

        } else {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})

//Logout - API - telling the browser: “This cookie is already expired → remove it” 
authRouter.post("/logout", (req, res) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successful");

})


module.exports = authRouter;