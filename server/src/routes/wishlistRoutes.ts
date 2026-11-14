import express from "express";
import mongoose from "mongoose";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET - Get a visitor's wishlist
router.get("/:guestId", async (req, res) => {
    try {
        const items = await Wishlist.find({
            guestId: req.params.guestId,
        }).sort({ createdAt: -1 });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch wishlist" });
    }
});

// POST - Add a product to a visitor's wishlist
router.post("/", async (req, res) => {
    try {
        const { guestId, productId } = req.body;

        if (
            typeof guestId !== "string" ||
            !guestId.trim() ||
            !mongoose.isValidObjectId(productId)
        ) {
            res.status(400).json({ message: "Invalid wishlist data" });
            return;
        }

        const product = await Product.findById(productId);

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        const item = await Wishlist.findOneAndUpdate(
            { guestId: guestId.trim(), productId: product._id },
            {
                $setOnInsert: {
                    productName: product.name,
                },
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Failed to add wishlist item" });
    }
});

// DELETE - Remove a product from a visitor's wishlist
router.delete("/:guestId/:productId", async (req, res) => {
    try {
        const { guestId, productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            res.status(400).json({ message: "Invalid product ID" });
            return;
        }

        await Wishlist.findOneAndDelete({
            guestId,
            productId,
        });

        res.status(200).json({ message: "Wishlist item removed" });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove wishlist item" });
    }
});

// GET - Admin wishlist analytics
router.get("/admin/analytics", authMiddleware, async (_req, res) => {
    try {
        const totalWishlistItems = await Wishlist.countDocuments();

        const popularProducts = await Wishlist.aggregate([
            {
                $group: {
                    _id: "$productId",
                    productName: { $first: "$productName" },
                    wishlistCount: { $sum: 1 },
                },
            },
            { $sort: { wishlistCount: -1 } },
            { $limit: 10 },
        ]);

        const totalVisitors = await Wishlist.distinct("guestId");

        res.status(200).json({
            totalWishlistItems,
            totalVisitors: totalVisitors.length,
            popularProducts,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to load wishlist analytics" });
    }
});

export default router;
