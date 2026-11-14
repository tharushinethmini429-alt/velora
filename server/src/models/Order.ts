import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    customerName: string;
    email: string;
    phone: string;
    address: string;
    items: {
        productId: mongoose.Types.ObjectId;
        name: string;
        price: number;
        quantity: number;
    }[];
    totalAmount: number;
    paymentMethod: string;
    status: string;
}

const orderSchema = new Schema<IOrder>(
    {
        customerName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;