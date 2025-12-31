import { useEffect, useCallback, useRef } from 'react';
import { clipboardApi } from '../api/clipboard';
import { useClipboardStore } from '../store/clipboardStore';
import { useSocket } from './useSocket';
import toast from 'react-hot-toast';

export const useClipboard = () => {
  const { items, addItem, updateItem, removeItem, setItems, setLoading } = useClipboardStore();
  const { socket } = useSocket();
  const lastClipboardContent = useRef<string>('');

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await clipboardApi.getItems({ limit: 100 });
      if (response.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error('Failed to load clipboard items:', error);
    } finally {
      setLoading(false);
    }
  }, [setItems, setLoading]);

  const createItem = useCallback(async (content: string, type: 'text' | 'image' | 'file' | 'html' = 'text') => {
    try {
      const deviceInfo = {
        platform: navigator.platform,
        browser: navigator.userAgent,
      };

      const response = await clipboardApi.createItem({
        content,
        type,
        deviceInfo,
      });

      if (response.success) {
        addItem(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to create clipboard item:', error);
      throw error;
    }
  }, [addItem]);

  const togglePin = useCallback(async (id: string, isPinned: boolean) => {
    try {
      const response = await clipboardApi.updateItem(id, { isPinned: !isPinned });
      if (response.success) {
        updateItem(id, { isPinned: !isPinned });
        toast.success(isPinned ? 'Unpinned' : 'Pinned');
      }
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  }, [updateItem]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await clipboardApi.deleteItem(id);
      removeItem(id);
      toast.success('Item deleted');
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }, [removeItem]);

  const copyToClipboard = useCallback(async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      await clipboardApi.incrementUsage(id);
      updateItem(id, { usageCount: (items.find(i => i._id === id)?.usageCount || 0) + 1 });
      toast.success('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy');
    }
  }, [items, updateItem]);

  // Monitor system clipboard
  useEffect(() => {
    const monitorClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && text !== lastClipboardContent.current) {
          lastClipboardContent.current = text;

          const isDuplicate = items.some(item => item.content === text);
          if (!isDuplicate) {
            await createItem(text, 'text');
          }
        }
      } catch (error) {
        // Clipboard access denied or not focused
      }
    };

    const interval = setInterval(monitorClipboard, 2000);

    return () => clearInterval(interval);
  }, [items, createItem]);

  // Listen for sync events
  useEffect(() => {
    if (!socket) return;

    socket.on('clipboard:new', (item) => {
      addItem(item);
      toast.success('New clipboard item synced');
    });

    socket.on('clipboard:update', (item) => {
      updateItem(item._id, item);
    });

    socket.on('clipboard:delete', (id) => {
      removeItem(id);
    });

    return () => {
      socket.off('clipboard:new');
      socket.off('clipboard:update');
      socket.off('clipboard:delete');
    };
  }, [socket, addItem, updateItem, removeItem]);

  return {
    items,
    loadItems,
    createItem,
    togglePin,
    deleteItem,
    copyToClipboard,
  };
};
