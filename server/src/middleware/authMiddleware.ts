import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    admin?: {
        adminId: string;
        role: "admin";
    };
}

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authReq = req as AuthRequest;
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. No token provided.",
            });
        }
        
        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET;
        
        if (!jwtSecret) {
            return res.status(500).json({
                message: "Authentication configuration error.",
            });
        }
        
        const decoded = jwt.verify(token, jwtSecret);
        
        if (
            typeof decoded === "string" ||
            decoded.role !== "admin" ||
            typeof decoded.adminId !== "string"
        ) {
            return res.status(403).json({
                message: "Admin access required.",
            });
        }
        authReq.admin = {
            adminId: decoded.adminId,
            role: "admin",
        };
        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token.",
        });
    }
};

export default authMiddleware;
