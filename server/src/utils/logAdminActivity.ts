import AdminActivity from "../models/AdminActivity.js";

const logAdminActivity = async (
    adminId: string,
    action: string,
    description: string,
    ipAddress?: string
) => {
    try {
        await AdminActivity.create({
            adminId,
            action,
            description,
            ipAddress: ipAddress || "Unknown",
        });
    } catch (error) {
        console.error("Admin activity logging failed:", error);
    }
};

export default logAdminActivity;
