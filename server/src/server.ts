import "dotenv/config";
import { setServers } from "node:dns";
import express from "express";
import cors from "cors";

import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Product API routes
app.use("/api/products", productRoutes);

// Order API routes
app.use("/api/orders", orderRoutes);

// Wishlist API routes
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// Welcome API
app.get("/", (_req, res) => {
    res.json({
        message: "Welcome to Velora API!"
    });
});

// Health check API
app.get("/api/health", (_req, res) => {
    res.json({
        status: "success",
        message: "Velora backend is running!"
    });
});


// Connect to MongoDB
setServers(["8.8.8.8", "8.8.4.4"]);



mongoose.connect(process.env.MONGODB_URI as string)
.then(() => {
    console.log("MongoDB connected successfully!");
    
    app.listen(PORT, () => {
        console.log(`Velora server running on http://localhost:${PORT}`);
    });
})
.catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
});
