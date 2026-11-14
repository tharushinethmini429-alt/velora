
import { setServers } from "node:dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
    try {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (!email || !password) {
            throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env");
        }
        setServers(["8.8.8.8", "1.1.1.1"]);
        
        await mongoose.connect(process.env.MONGODB_URI as string);
        const hashedPassword = await bcrypt.hash(password, 12);
        await Admin.findOneAndUpdate(
            { email },
            {
                name: "Velora Admin",
                email,
                password: hashedPassword,
                role: "admin",
            },
            { upsert: true, returnDocument: "after", runValidators: true }
        );
        console.log("Admin account created/updated successfully!");
    } catch (error) {
        console.error("Admin creation failed:", error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

createAdmin();
