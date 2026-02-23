import mongoose, { Schema, Document } from 'mongoose';

export interface IAddon extends Document {
    name: string;
    description?: string;
    price: number;
    duration?: number; // extra minutes added to service
    linkedCategories: string[]; // service IDs this addon applies to
    linkedSizes: string[];      // specific size IDs ('all' means any)
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AddonSchema = new Schema<IAddon>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        price: { type: Number, required: true, min: 0 },
        duration: { type: Number, default: 0 },
        linkedCategories: { type: [String], default: [] },
        linkedSizes: { type: [String], default: [] },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Addon || mongoose.model<IAddon>('Addon', AddonSchema);
