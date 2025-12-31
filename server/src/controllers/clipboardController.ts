import { Response } from 'express';
import ClipboardItem from '../models/ClipboardItem';
import { AuthRequest } from '../middleware/auth';
import { getIO } from '../server';

export const getClipboardItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = 50, skip = 0, type, pinned } = req.query;

    const query: any = { userId: req.userId };

    if (type) {
      query.type = type;
    }

    if (pinned !== undefined) {
      query.isPinned = pinned === 'true';
    }

    const items = await ClipboardItem.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await ClipboardItem.countDocuments(query);

    res.json({
      success: true,
      data: {
        items,
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createClipboardItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, type, metadata, tags, deviceInfo } = req.body;

    const item = await ClipboardItem.create({
      userId: req.userId,
      content,
      type: type || 'text',
      metadata,
      tags,
      deviceInfo,
      usageCount: 0,
      isPinned: false,
    });

    // Emit to other devices
    const io = getIO();
    io.to(`user:${req.userId}`).emit('clipboard:new', item);

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateClipboardItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isPinned, tags } = req.body;

    const item = await ClipboardItem.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { isPinned, tags },
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found',
      });
      return;
    }

    // Emit update to other devices
    const io = getIO();
    io.to(`user:${req.userId}`).emit('clipboard:update', item);

    res.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteClipboardItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const item = await ClipboardItem.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found',
      });
      return;
    }

    // Emit delete to other devices
    const io = getIO();
    io.to(`user:${req.userId}`).emit('clipboard:delete', id);

    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const incrementUsageCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const item = await ClipboardItem.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $inc: { usageCount: 1 } },
      { new: true }
    );

    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found',
      });
      return;
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getMostUsed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = 10 } = req.query;

    const items = await ClipboardItem.find({ userId: req.userId })
      .sort({ usageCount: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalItems = await ClipboardItem.countDocuments({ userId: req.userId });

    const mostUsed = await ClipboardItem.find({ userId: req.userId })
      .sort({ usageCount: -1 })
      .limit(5);

    const recentItems = await ClipboardItem.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const itemsByType = await ClipboardItem.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const typeStats = {
      text: 0,
      image: 0,
      file: 0,
      html: 0,
    };

    itemsByType.forEach((item: any) => {
      typeStats[item._id as keyof typeof typeStats] = item.count;
    });

    res.json({
      success: true,
      data: {
        totalItems,
        mostUsed,
        recentItems,
        itemsByType: typeStats,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const searchClipboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, limit = 20 } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
      return;
    }

    const items = await ClipboardItem.find({
      userId: req.userId,
      content: { $regex: query, $options: 'i' },
    })
      .sort({ usageCount: -1, createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
