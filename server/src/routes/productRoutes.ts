import express from "express";
import Product from "../models/Product.js";
import { productSchema, productUpdateSchema } from "../validators/productValidator.js";
import authMiddleware from "../middleware/authMiddleware.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import logAdminActivity from "../utils/logAdminActivity.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";


const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (_req, file, callback) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error("Only JPG, PNG, and WebP images are allowed"));
        }
    },
});


// POST - Upload product image to Cloudinary
router.post(
    "/upload-image",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                res.status(400).json({ message: "Please select an image" });
                return;
            }

            const uploadResult = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "velora/products",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                stream.end(req.file!.buffer);
            });

            res.status(200).json({
                message: "Image uploaded successfully",
                imageUrl: uploadResult.secure_url,
            });
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            res.status(500).json({
                message: "Failed to upload image",
            });
        }
    }
);


// GET - Get all products
router.get("/", async (_req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Fetch products error:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

// GET - Get one product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch product" });
    }
});

// POST - Add a new product
router.post("/", authMiddleware, async (req, res) => {
    const validation = productSchema.safeParse(req.body);

    if (!validation.success) {
        res.status(400).json({
            message: "Invalid product data",
            errors: validation.error.issues,
        });
        return;
    }

    try {
        const product = await Product.create(validation.data);

        await logAdminActivity(
            (req as AuthRequest).admin!.adminId,
            "PRODUCT_CREATED",
            `Created product: ${product.name}`,
            req.ip
        );


        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: "Failed to create product" });
    }
});

// PUT - Update a product
router.put("/:id", authMiddleware, async (req, res) => {
    const validation = productUpdateSchema.safeParse(req.body);

    if (!validation.success) {
        res.status(400).json({
            message: "Invalid product update data",
            errors: validation.error.issues,
        });
        return;
    }

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                ...validation.data,
                originalPrice:
                validation.data.originalPrice == null
                ? undefined
                : validation.data.originalPrice,
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        await logAdminActivity(
            (req as AuthRequest).admin!.adminId,
            "PRODUCT_UPDATED",
            `Updated product: ${product.name}`,
            req.ip
        );

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: "Failed to update product" });
    }
});

// DELETE - Delete a product
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        await logAdminActivity(
            (req as AuthRequest).admin!.adminId,
            "PRODUCT_DELETED",
            `Deleted product: ${product.name}`,
            req.ip
        );

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete product" });
    }
});

export default router;
