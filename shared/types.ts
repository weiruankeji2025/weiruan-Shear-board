// Shared types between client and server

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'local' | 'google' | 'microsoft' | 'tiktok';
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClipboardItem {
  _id: string;
  userId: string;
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
  createdAt: Date;
  updatedAt: Date;
  deviceInfo?: {
    platform: string;
    browser?: string;
  };
}

export interface CloudBackup {
  _id: string;
  userId: string;
  provider: 'google-drive' | 'onedrive' | 'dropbox';
  enabled: boolean;
  lastBackup?: Date;
  config?: {
    folderId?: string;
    autoBackup?: boolean;
    backupInterval?: number;
  };
}

export interface DeviceSession {
  _id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  platform: string;
  browser?: string;
  lastActive: Date;
  ipAddress?: string;
}

export interface SyncEvent {
  type: 'create' | 'update' | 'delete';
  itemId: string;
  item?: ClipboardItem;
  timestamp: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

export interface ClipboardStats {
  totalItems: number;
  mostUsed: ClipboardItem[];
  recentItems: ClipboardItem[];
  itemsByType: {
    text: number;
    image: number;
    file: number;
    html: number;
  };
}
