import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    location?: string;
    date: Date;
    link?: string;
    physical: boolean;
    isApproved: boolean;
}

const eventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        location: { type: String },
        date: { type: Date, required: true },
        link: { type: String },
        physical: { type: Boolean, default: false },
        isApproved: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<IEvent>('Event', eventSchema);
