import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  serviceId: string;
  date: Date;
  time: string;
  stylist: string;
  duration: number;
  price: number;
  paymentMethod: 'stripe' | 'paypal' | 'mobile-money' | 'pending' | 'manual';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  confirmationNumber: string;
  addons: Array<{ id: string; name: string; price: number }>;
  userId?: mongoose.Types.ObjectId;
  notes?: string;
  hairColor?: string;
  stripeSessionId?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  reminder2hSent?: boolean;
  reminder30mSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    clientName: {
      type: String,
      required: [true, 'Please provide a client name'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    clientPhone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    service: {
      type: String,
      required: [true, 'Please select a service'],
    },
    serviceId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
    },
    time: {
      type: String,
      required: [true, 'Please select a time'],
    },
    stylist: {
      type: String,
      required: [true, 'Please select a stylist'],
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal', 'mobile-money', 'pending', 'manual'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    confirmationNumber: {
      type: String,
      unique: true,
      index: true,
      default: () => `SLNG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    },
    addons: [
      {
        id: String,
        name: String,
        price: Number,
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
    },
    hairColor: {
      type: String,
    },
    stripeSessionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    reminder2hSent: {
      type: Boolean,
      default: false,
    },
    reminder30mSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
