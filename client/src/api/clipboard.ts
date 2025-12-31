import { apiClient } from './client';

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
  createdAt: string;
  updatedAt: string;
  deviceInfo?: {
    platform: string;
    browser?: string;
  };
}

export const clipboardApi = {
  getItems: (params?: { limit?: number; skip?: number; type?: string; pinned?: boolean }) =>
    apiClient.get<{ success: boolean; data: { items: ClipboardItem[]; total: number } }>('/clipboard', params),

  createItem: (data: {
    content: string;
    type?: string;
    metadata?: any;
    tags?: string[];
    deviceInfo?: any;
  }) =>
    apiClient.post<{ success: boolean; data: ClipboardItem }>('/clipboard', data),

  updateItem: (id: string, data: { isPinned?: boolean; tags?: string[] }) =>
    apiClient.put<{ success: boolean; data: ClipboardItem }>(`/clipboard/${id}`, data),

  deleteItem: (id: string) =>
    apiClient.delete(`/clipboard/${id}`),

  incrementUsage: (id: string) =>
    apiClient.post(`/clipboard/${id}/use`),

  getMostUsed: (limit = 10) =>
    apiClient.get<{ success: boolean; data: ClipboardItem[] }>('/clipboard/most-used', { limit }),

  getStats: () =>
    apiClient.get('/clipboard/stats'),

  search: (query: string, limit = 20) =>
    apiClient.get<{ success: boolean; data: ClipboardItem[] }>('/clipboard/search', { query, limit }),
};
