import { z } from "zod";

export const productSchema = z.object({
    name: z.string().trim().min(2, "Product name must be at least 2 characters"),
    category: z.string().trim().min(1, "Category is required"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    price: z.number().positive("Price must be greater than 0"),
    originalPrice: z.number().positive().optional(),
    image: z.string().url("A valid image URL is required"),
    rating: z.number().min(0).max(5).optional(),
    reviewCount: z.number().int().min(0).optional(),
    stock: z.number().int().min(0).default(0),
    isFeatured: z.boolean().default(false),
});

export const productUpdateSchema = productSchema.partial();