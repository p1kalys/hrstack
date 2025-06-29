import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
    name: string;
    content: string;
    isApproved: boolean;
    anonymous: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    blog: mongoose.Types.ObjectId;
}

const commentSchema: Schema<IComment> = new Schema(
    {
        name: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        anonymous: { type: Boolean, required: true, default: false},
        isApproved: { type: Boolean, required: true, default: false },
        blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    },
    { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
