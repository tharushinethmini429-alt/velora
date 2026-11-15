import express from "express";
import Newsletter from "../models/Newsletter.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer subscription
router.post("/subscribe", async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address.",
            });
        }

        await Newsletter.create({ email });

        return res.status(201).json({
            message: "Thank you for subscribing!",
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email is already subscribed.",
            });
        }

        return res.status(500).json({
            message: "Subscription failed. Please try again.",
        });
    }
});

// Admin: view all subscribers
router.get("/", authMiddleware, async (_req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({
            subscribedAt: -1,
        });

        return res.status(200).json(subscribers);
    } catch {
        return res.status(500).json({
            message: "Failed to load subscribers.",
        });
    }
});

export default router;