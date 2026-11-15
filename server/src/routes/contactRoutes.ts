import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer: submit a contact message
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
            return res.status(400).json({
                message: "Please complete all fields.",
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address.",
            });
        }

        if (message.trim().length > 1000) {
            return res.status(400).json({
                message: "Your message is too long.",
            });
        }

        const newMessage = await ContactMessage.create({
            name,
            email,
            subject,
            message,
        });

        return res.status(201).json({
            message: "Your message has been sent successfully!",
            id: newMessage._id,
        });
    } catch (error) {
        console.error("Contact message error:", error);

        return res.status(500).json({
            message: "Failed to send your message. Please try again.",
        });
    }
});

// Admin: view all contact messages
router.get("/", authMiddleware, async (_req, res) => {
    try {
        const messages = await ContactMessage.find().sort({
            submittedAt: -1,
        });

        return res.status(200).json(messages);
    } catch (error) {
        console.error("Failed to load contact messages:", error);

        return res.status(500).json({
            message: "Failed to load contact messages.",
        });
    }
});


// Admin: update contact message status
router.patch("/:id/status", authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Read", "Unread"].includes(status)) {
            return res.status(400).json({
                message: "Invalid message status.",
            });
        }

        const updatedMessage = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({
                message: "Contact message not found.",
            });
        }

        return res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Failed to update contact message:", error);

        return res.status(500).json({
            message: "Failed to update message status.",
        });
    }
});


export default router;