import mongoose, { Schema, Document } from 'mongoose';

export interface IDeviceSession extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string;
  deviceName: string;
  platform: string;
  browser?: string;
  lastActive: Date;
  ipAddress?: string;
  socketId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeviceSessionSchema = new Schema<IDeviceSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
    },
    lastActive: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: {
      type: String,
    },
    socketId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

DeviceSessionSchema.index({ userId: 1, deviceId: 1 }, { unique: true });
DeviceSessionSchema.index({ lastActive: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

export default mongoose.model<IDeviceSession>('DeviceSession', DeviceSessionSchema);
