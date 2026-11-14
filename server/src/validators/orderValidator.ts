import { z } from "zod";

export const orderSchema = z.object({
    customerName: z.string().trim().min(2, "Customer name is required"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().trim().min(10, "Enter a valid phone number"),
    address: z.string().trim().min(5, "Address is required"),

    items: z.array(
        z.object({
            productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
            quantity: z.number().int().positive("Quantity must be at least 1"),
        })
    ).min(1, "An order must contain at least one product"),

    paymentMethod: z.enum(["Cash on Delivery", "Card"]),
});