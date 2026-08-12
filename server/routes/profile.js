const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/auth");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.json({ name: user.name, email: user.email, createdAt: user.createdAt });
    } catch (error) {
        res.status(401).send("ERROR : " + error.message);
    }
})

module.exports = profileRouter;