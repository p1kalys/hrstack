import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
    title?: string;
    description?: string;
    location?: string;
    company?: string;
    imageUrl?: string;
    link?: string;
    isApproved: boolean;
}

const jobSchema = new Schema<IJob>(
    {
        title: { type: String },
        description: { type: String },
        company: { type: String },
        location: { type: String },
        link: { type: String },
        imageUrl: { type: String },
        isApproved: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<IJob>('Job', jobSchema);
