
import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
    guestId: string;
    productId: mongoose.Types.ObjectId;
    productName: string;
}

const wishlistSchema = new Schema<IWishlist>(
    {
        guestId: {
            type: String,
            required: true,
            trim: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

wishlistSchema.index({ guestId: 1, productId: 1 }, { unique: true });

export default mongoose.model<IWishlist>("Wishlist", wishlistSchema);
