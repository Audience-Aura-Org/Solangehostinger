import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminSettings extends Document {
  heroTitle: string;
  heroSubtitle: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  tiktok: string;
  media: Array<{
    id: string;
    label: string;
    url: string;
    type: 'video' | 'image';
  }>;
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  services: Array<{
    id: string;
    name: string;
    description: string;
    sizes: Array<{
      id: string;
      size: string;
      price: number;
      duration: number;
    }>;
  }>;
  updatedAt: Date;
}

const AdminSettingsSchema = new Schema<IAdminSettings>(
  {
    heroTitle: { type: String, default: 'Luxury Hair Braiding Experience' },
    heroSubtitle: { type: String, default: 'Premium braiding services with liquid glass salon aesthetics' },
    email: { type: String, default: 'concierge@solange.maison' },
    phone: { type: String, default: '+1.800.555.0199' },
    address: { type: String, default: '' },
    instagram: { type: String, default: 'https://instagram.com/solangehair' },
    tiktok: { type: String, default: 'https://tiktok.com/@solangehair' },
    media: [
      {
        id: { type: String },
        label: { type: String },
        url: { type: String },
        type: { type: String, enum: ['video', 'image'], default: 'video' },
      },
    ],
    businessHours: {
      monday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
      tuesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
      wednesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
      thursday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
      friday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
      saturday: { open: { type: String, default: '10:00' }, close: { type: String, default: '16:00' }, closed: { type: Boolean, default: false } },
      sunday: { open: { type: String, default: '10:00' }, close: { type: String, default: '16:00' }, closed: { type: Boolean, default: true } },
    },
    services: [
      {
        id: String,
        name: String,
        description: String,
        sizes: [
          {
            id: String,
            size: String,
            price: Number,
            duration: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Delete cached model to prevent "OverwriteModelError" during hot reload
delete (mongoose.models as Record<string, unknown>).AdminSettings;

export default mongoose.model<IAdminSettings>('AdminSettings', AdminSettingsSchema);
