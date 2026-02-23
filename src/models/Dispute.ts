import mongoose, { Schema, Document } from 'mongoose';

export interface IDispute extends Document {
    bookingId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    clientEmail: string;
    subject: string;
    reason: string;
    status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
    adminNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const DisputeSchema = new Schema<IDispute>(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        clientEmail: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'resolved', 'rejected'],
            default: 'pending',
        },
        adminNotes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);
