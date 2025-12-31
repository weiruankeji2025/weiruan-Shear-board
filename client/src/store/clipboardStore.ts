import { create } from 'zustand';
import { ClipboardItem } from '../api/clipboard';

interface ClipboardState {
  items: ClipboardItem[];
  mostUsed: ClipboardItem[];
  stats: any;
  isLoading: boolean;
  setItems: (items: ClipboardItem[]) => void;
  addItem: (item: ClipboardItem) => void;
  updateItem: (id: string, updates: Partial<ClipboardItem>) => void;
  removeItem: (id: string) => void;
  setMostUsed: (items: ClipboardItem[]) => void;
  setStats: (stats: any) => void;
  setLoading: (loading: boolean) => void;
}

export const useClipboardStore = create<ClipboardState>((set) => ({
  items: [],
  mostUsed: [],
  stats: null,
  isLoading: false,

  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => ({
      items: [item, ...state.items],
    })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item._id === id ? { ...item, ...updates } : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item._id !== id),
    })),

  setMostUsed: (items) => set({ mostUsed: items }),

  setStats: (stats) => set({ stats }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
