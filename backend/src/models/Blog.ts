import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
    title: string;
    subTitle?: string;
    description: string;
    category: string[];
    image?: string;
    isPublished: boolean;
    anonymous: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    author: mongoose.Types.ObjectId;
}

const blogSchema: Schema<IBlog> = new Schema(
    {
        title: { type: String, required: true, trim: true },
        subTitle: { type: String, trim: true },
        description: { type: String, required: true },
        category: { type: [String], required: true },
        image: { type: String },
        anonymous: { type: Boolean, required: true, default: false},
        isPublished: { type: Boolean, required: true, default: false },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

const Blog = mongoose.model<IBlog>("Blog", blogSchema);
export default Blog;
