const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { validateSignUpData } = require('../utils/signupDataValidator');

// Create a router for authentication-related routes
const authRouter = express.Router();


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

        res.json({ message: 'User registered successfully', name: savedUser.name, email: savedUser.email });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        //we need to check if the user exists in the database 
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isPasswordMatching = await user.comparePassword(password)

        if (isPasswordMatching) {

            const token = await user.getJWT()

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,        // only sent over HTTPS
                sameSite: "strict",  // blocks CSRF attacks
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });

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