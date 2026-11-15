import mongoose, { Schema, Document } from "mongoose";

export interface IContactMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "Unread" | "Read";
    submittedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
    status: {
        type: String,
        enum: ["Unread", "Read"],
        default: "Unread",
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IContactMessage>(
    "ContactMessage",
    contactMessageSchema
);