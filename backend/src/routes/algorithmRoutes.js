import express from "express";
import Algorithm from "../models/Algorithm.js";


const router = express.Router();

// GET all algorithms
router.get("/", async (req, res) => {
    try {
        const algorithms = await Algorithm.find();
        res.status(200).json(algorithms);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch algorithms", error });
    }
});

// POST a new algorithm
router.post("/", async (req, res) => {
    const { name, description, tags, complexity, input, codes } = req.body;

    try {
        const algorithm = new Algorithm({
            name,
            description,
            tags,
            complexity,
            input,
            codes,
        });

        await algorithm.save();
        res.status(201).json({ message: "Algorithm added successfully", algorithm });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Failed to add algorithm", error });
    }
});

export default router;
