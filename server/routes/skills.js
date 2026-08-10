const express = require("express");
const skillsRouter = express.Router();
const userAuth = require("../middleware/auth");
const Skill = require("../models/skills");
const { calculateRustiness } = require('../utils/calculateRustiness');

skillsRouter.get("/skills", userAuth, async (req, res) => {

    try {

        const userId = req.user._id;

        const skills = await Skill.find({ userId });

        if (skills) {
            res.json(skills);
        } else {
            res.status(404).json({ message: "No skills found" });
        }

    } catch (error) {
        res.status(500).json({ message: "Error fetching skills" });
    }

})

skillsRouter.post("/skills", userAuth, async (req, res) => {

    try {

        const { name, category } = req.body;

        const userId = req.user._id;

        const newSkill = new Skill({
            userId,
            name,
            category
        });

        const savedSkill = await newSkill.save();

        res.status(200).json(savedSkill);

    } catch (error) {
        res.status(500).json({ message: "Error creating skill" });
    }

})


//GET /skills/ranked — fetch all the user's skills, map each one to include its calculated rustiness, then sort descending (most rustic first)
skillsRouter.get("/skills/ranked", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const skills = await Skill.find({ userId });

        // Map each skill to include its calculated rustiness
        const skillsWithRustiness = skills.map(skill => {
            const rustiness = calculateRustiness(skill);
            return { ...skill._doc, rustiness };
        });

        // Sort by rustiness in descending order
        skillsWithRustiness.sort((a, b) => b.rustiness - a.rustiness);

        res.json(skillsWithRustiness);

    } catch (error) {
        res.status(500).json({ message: "Error fetching ranked skills" });
    }

});

skillsRouter.post("/skills/:id/practice", userAuth, async (req, res) => {

    try {
        
        const skill = req.params.id;
         
        const userSkill = await Skill.findOne({ _id: skill, userId: req.user._id });

        if (!userSkill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        //Push a new entry into practiceLog (with an optional note from the body), save, return the updated skill
        const { note } = req.body;

        userSkill.practiceLog.push({ note });

        await userSkill.save();

        res.json(userSkill);

    } catch (error) {
        res.status(500).json({ message: "Error logging practice" });
    }

 })

skillsRouter.delete("/skills/:id", userAuth, async (req, res) => {
    
    try {

        //Same ownership check as above before deleting
        const skill = req.params.id;

        const userSkill = await Skill.findOne({ _id: skill, userId: req.user._id });

        if (!userSkill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        await userSkill.deleteOne();

        res.json({ message: "Skill deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting skill" });
    }

})

module.exports = skillsRouter;