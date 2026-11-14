import express from "express";
import Order from "../models/Order.js";
import { orderSchema } from "../validators/orderValidator.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import logAdminActivity from "../utils/logAdminActivity.js";


const router = express.Router();

// GET - Get all orders
router.get("/", authMiddleware, async (_req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

// GET - Get one order
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: "Invalid order ID" });
    }
});

// POST - Create a new order
router.post("/", async (req, res) => {
    const validation = orderSchema.safeParse(req.body);

    if (!validation.success) {
        res.status(400).json({
            message: "Invalid order data",
            errors: validation.error.issues,
        });
        return;
    }

    const session = await mongoose.startSession();

    try {
        let createdOrder = null;

        await session.withTransaction(async () => {
            const { items, ...customerDetails } = validation.data;
            const orderItems = [];

            for (const item of items) {
                const product = await Product.findOneAndUpdate(
                    {
                        _id: item.productId,
                        stock: { $gte: item.quantity },
                    },
                    {
                        $inc: { stock: -item.quantity },
                    },
                    {
                        new: true,
                        session,
                    }
                );

                if (!product) {
                    throw new Error(
                        `Product ${item.productId} not found or insufficient stock`
                    );
                }

                orderItems.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                });
            }

            const totalAmount = orderItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            const orders = await Order.create(
                [{
                    ...customerDetails,
                    items: orderItems,
                    totalAmount,
                    status: "Pending",
                }],
                { session }
            );

            createdOrder = orders[0];
        });

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error
                ? error.message
                : "Failed to create order",
        });
    } finally {
        await session.endSession();
    }
});
// PUT - Update order status
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        await logAdminActivity(
            (req as AuthRequest).admin!.adminId,
            "ORDER_STATUS_UPDATED",
            `Updated order status to: ${order.status}`,
            req.ip
        );

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: "Failed to update order" });
    }
});

// DELETE - Delete an order
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        await logAdminActivity(
            (req as AuthRequest).admin!.adminId,
            "ORDER_DELETED",
            `Deleted order: ${order._id}`,
            req.ip
        );
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete order" });
    }
});

export default router;