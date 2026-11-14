import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import AdminActivity from "../models/AdminActivity.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { adminLoginSchema } from "../validators/adminValidator.js";
import authMiddleware from "../middleware/authMiddleware.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import logAdminActivity from "../utils/logAdminActivity.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const validation = adminLoginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Invalid login details",
                errors: validation.error.flatten(),
            });
        }
        const { email, password } = validation.data;
        const admin = await Admin.findOne({ email });

        if (!admin) {
           return res.status(401).json({
            message: "Invalid email or password",
           });
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(500).json({
                message: "Authentication configuration error",
            });
        }

        const token = jwt.sign(
            {
                adminId: admin._id.toString(),
                role: admin.role,
            },
            jwtSecret,
            { expiresIn: "1d" }
        );

        await logAdminActivity(
            admin._id.toString(),
            "LOGIN",
            "Admin logged in successfully",
            req.ip
        );

        

        return res.status(200).json({
           message: "Admin login successful",
           token,
           admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
           },
        });
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({
           message: "Server error during admin login",
        });
    }
});


router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const adminId = (req as AuthRequest).admin?.adminId;

        const admin = await Admin.findById(adminId).select("-password");

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            });
        }


        return res.status(200).json({
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error("Admin profile error:", error);
        return res.status(500).json({
            message: "Failed to load admin profile",
        });
    }
});


// PUT - Update Admin Profile
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const adminId = (req as AuthRequest).admin?.adminId;
        const { name, email } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            !name.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            return res.status(400).json({
                message: "Please provide a valid name and email address",
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        const existingAdmin = await Admin.findOne({
            email: cleanEmail,
            _id: { $ne: adminId },
        });

        if (existingAdmin) {
            return res.status(409).json({
                message: "This email address is already in use",
            });
        }

        const admin = await Admin.findByIdAndUpdate(
            adminId,
            { name: cleanName, email: cleanEmail },
            { new: true, runValidators: true }
        ).select("-password");

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            });
        }

        await logAdminActivity(
            admin._id.toString(),
            "PROFILE_UPDATE",
            "Admin updated their profile",
            req.ip
        );

        return res.status(200).json({
            message: "Admin profile updated successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error("Admin profile update error:", error);
        return res.status(500).json({
            message: "Failed to update admin profile",
        });
    }
});


// GET - Protected Admin Dashboard Statistics
router.get("/dashboard-stats", authMiddleware, async (_req, res) => {
    try {
        const [
            totalProducts,
            totalOrders,
            customers,
            revenueResult,
        ] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            Order.distinct("email"),
            Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" },
                    },
                },
            ]),
        ]);

        return res.status(200).json({
            totalRevenue: revenueResult[0]?.totalRevenue || 0,
            totalOrders,
            totalProducts,
            totalCustomers: customers.length,
        });
    } catch (error) {
        console.error("Dashboard statistics error:", error);

        return res.status(500).json({
            message: "Failed to load dashboard statistics",
        });
    }
});

//GET - Protected Admin Sales Overview

router.get("/sales-overview", authMiddleware, async (req, res) => {
    try {
        const now = new Date();
        const period = req.query.period || "monthly";

        let startDate: Date;
        let endDate: Date;
        let groupBy: "day" | "month" | "year";

        if (period === "weekly") {
            startDate = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() - 6
            ));
            endDate = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() + 1
            ));
            groupBy = "day";

        } else if (period === "monthly") {
            startDate = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth() - 5,
                1
            ));
            endDate = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth() + 1,
                1
            ));
            groupBy = "month";

        } else if (period === "yearly") {
            startDate = new Date(Date.UTC(
                now.getUTCFullYear() - 4,
                0,
                1
            ));
            endDate = new Date(Date.UTC(
                now.getUTCFullYear() + 1,
                0,
                1
            ));
            groupBy = "year";

        } else if (period === "custom") {
            const { startDate: start, endDate: end } = req.query;

            if (typeof start !== "string" || typeof end !== "string") {
                return res.status(400).json({
                    message: "Please provide start and end dates",
                });
            }

            const parsedStart = new Date(`${start}T00:00:00.000Z`);
            const parsedEnd = new Date(`${end}T00:00:00.000Z`);

            if (
                Number.isNaN(parsedStart.getTime()) ||
                Number.isNaN(parsedEnd.getTime()) ||
                parsedStart.toISOString().slice(0, 10) !== start ||
                parsedEnd.toISOString().slice(0, 10) !== end ||
                parsedStart > parsedEnd
            ) {
                return res.status(400).json({
                    message: "Invalid date range",
                });
            }

            startDate = parsedStart;
            endDate = new Date(parsedEnd);
            endDate.setUTCDate(endDate.getUTCDate() + 1);

            const days =
                (endDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24);

            groupBy = days <= 31 ? "day" : days <= 366 ? "month" : "year";

        } else {
            return res.status(400).json({
                message: "Invalid sales overview period",
            });
        }

        const dateFormat =
            groupBy === "day" ? "%Y-%m-%d" :
            groupBy === "month" ? "%Y-%m" : "%Y";

        const results = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: dateFormat,
                            date: "$createdAt",
                            timezone: "UTC",
                        },
                    },
                    revenue: { $sum: "$totalAmount" },
                    orders: { $sum: 1 },
                },
            },
        ]);

        const salesMap = new Map(
            results.map((item) => [item._id, item])
        );

        const salesData = [];
        const current = new Date(startDate);

        while (current < endDate) {
            let key = "";
            let label = "";

            if (groupBy === "day") {
                key = current.toISOString().slice(0, 10);
                label = current.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                });
                current.setUTCDate(current.getUTCDate() + 1);

            } else if (groupBy === "month") {
                key = current.toISOString().slice(0, 7);
                label = current.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                });
                current.setUTCMonth(current.getUTCMonth() + 1);

            } else {
                key = String(current.getUTCFullYear());
                label = key;
                current.setUTCFullYear(current.getUTCFullYear() + 1);
            }

            const result = salesMap.get(key);

            salesData.push({
                month: label,
                revenue: result?.revenue || 0,
                orders: result?.orders || 0,
            });
        }

        return res.status(200).json(salesData);

    } catch (error) {
        console.error("Sales overview error:", error);

        return res.status(500).json({
            message: "Failed to load sales overview",
        });
    }
});



router.put("/change-password", authMiddleware, async (req, res) => {
    try {
        const adminId = (req as AuthRequest).admin?.adminId;

        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (
            typeof currentPassword !== "string" ||
            typeof newPassword !== "string" ||
            typeof confirmPassword !== "string"
        ) {
            return res.status(400).json({
                message: "All password fields are required",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must contain at least 8 characters",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New passwords do not match",
            });
        }

        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Current password is incorrect",
            });
        }

        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        await logAdminActivity(
            admin._id.toString(),
            "PASSWORD_CHANGE",
            "Admin changed their password",
            req.ip
        );

        return res.status(200).json({
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Password change error:", error);
        return res.status(500).json({
            message: "Failed to change password",
        });
    }
});

// POST - Admin logout
router.post("/logout", authMiddleware, async (req, res) => {
    try {
        const adminId = (req as AuthRequest).admin!.adminId;

        await logAdminActivity(
            adminId,
            "LOGOUT",
            "Admin logged out successfully",
            req.ip
        );

        return res.status(200).json({
            message: "Admin logged out successfully",
        });
    } catch (error) {
        console.error("Admin logout error:", error);

        return res.status(500).json({
            message: "Failed to log admin logout",
        });
    }
});

// GET - Admin activity history
router.get("/activities", authMiddleware, async (_req, res) => {
    try {
        const activities = await AdminActivity.find()
            .populate("adminId", "name email")
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch admin activities",
        });
    }
});


export default router;   
