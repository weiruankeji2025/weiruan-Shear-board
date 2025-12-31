import mongoose, { Schema, Document } from 'mongoose';

export interface IClipboardItem extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'file' | 'html';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    source?: string;
  };
  usageCount: number;
  isPinned: boolean;
  tags?: string[];
  deviceInfo?: {
    platform: string;
    browser?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ClipboardItemSchema = new Schema<IClipboardItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'html'],
      default: 'text',
    },
    metadata: {
      fileName: String,
      fileSize: Number,
      mimeType: String,
      source: String,
    },
    usageCount: {
      type: Number,
      default: 0,
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    tags: [String],
    deviceInfo: {
      platform: String,
      browser: String,
    },
  },
  {
    timestamps: true,
  }
);

ClipboardItemSchema.index({ userId: 1, createdAt: -1 });
ClipboardItemSchema.index({ userId: 1, usageCount: -1 });
ClipboardItemSchema.index({ userId: 1, isPinned: -1, createdAt: -1 });

export default mongoose.model<IClipboardItem>('ClipboardItem', ClipboardItemSchema);
