import mongoose, { Schema, Document } from 'mongoose';

export interface ICloudBackup extends Document {
  userId: mongoose.Types.ObjectId;
  provider: 'google-drive' | 'onedrive' | 'dropbox';
  enabled: boolean;
  lastBackup?: Date;
  config?: {
    folderId?: string;
    autoBackup?: boolean;
    backupInterval?: number;
  };
  credentials?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CloudBackupSchema = new Schema<ICloudBackup>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ['google-drive', 'onedrive', 'dropbox'],
      required: true,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    lastBackup: {
      type: Date,
    },
    config: {
      folderId: String,
      autoBackup: { type: Boolean, default: true },
      backupInterval: { type: Number, default: 86400000 }, // 24 hours
    },
    credentials: {
      accessToken: String,
      refreshToken: String,
      expiresAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

CloudBackupSchema.index({ userId: 1, provider: 1 }, { unique: true });

export default mongoose.model<ICloudBackup>('CloudBackup', CloudBackupSchema);
