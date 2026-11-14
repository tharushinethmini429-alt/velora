import mongoose, { Schema, Document } from "mongoose";

export interface IAdminActivity extends Document {
    adminId: mongoose.Types.ObjectId;
    action: string;
    description: string;
    ipAddress?: string;
}

const adminActivitySchema = new Schema<IAdminActivity>(
    {
        adminId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        action: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        ipAddress: {
            type: String,
            default: "Unknown",
        },
    },
    {
        timestamps: true,
    }
);

const AdminActivity = mongoose.model<IAdminActivity>(
    "AdminActivity",
    adminActivitySchema
);

export default AdminActivity;
