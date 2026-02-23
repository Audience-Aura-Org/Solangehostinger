import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    bookingId: mongoose.Types.ObjectId;
    clientName: string;
    type: 'reminder_2h' | 'reminder_30m' | 'cancellation_request' | 'booking_confirmation';
    status: 'sent' | 'pending' | 'failed';
    message: string;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
        clientName: { type: String, required: true },
        type: {
            type: String,
            enum: ['reminder_2h', 'reminder_30m', 'cancellation_request', 'booking_confirmation'],
            required: true
        },
        status: { type: String, enum: ['sent', 'pending', 'failed'], default: 'sent' },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
