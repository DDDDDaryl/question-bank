import mongoose from 'mongoose';

export interface ISystemSettings {
  allowNewRegistrations: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const systemSettingsSchema = new mongoose.Schema<ISystemSettings>(
  {
    allowNewRegistrations: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const SystemSettings = mongoose.models.SystemSettings || mongoose.model<ISystemSettings>('SystemSettings', systemSettingsSchema); 