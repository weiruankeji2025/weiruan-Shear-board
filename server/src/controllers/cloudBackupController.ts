import { Response } from 'express';
import CloudBackup from '../models/CloudBackup';
import { AuthRequest } from '../middleware/auth';
import { performBackup } from '../services/cloudBackupService';

export const getBackupConfigs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const configs = await CloudBackup.find({ userId: req.userId }).select('-credentials');

    res.json({
      success: true,
      data: configs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createBackupConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { provider, config } = req.body;

    const existingConfig = await CloudBackup.findOne({
      userId: req.userId,
      provider,
    });

    if (existingConfig) {
      res.status(400).json({
        success: false,
        error: 'Backup configuration for this provider already exists',
      });
      return;
    }

    const backupConfig = await CloudBackup.create({
      userId: req.userId,
      provider,
      enabled: false,
      config,
    });

    res.status(201).json({
      success: true,
      data: backupConfig,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateBackupConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { enabled, config, credentials } = req.body;

    const updateData: any = {};

    if (enabled !== undefined) {
      updateData.enabled = enabled;
    }

    if (config) {
      updateData.config = config;
    }

    if (credentials) {
      updateData.credentials = credentials;
    }

    const backupConfig = await CloudBackup.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updateData,
      { new: true, runValidators: true }
    ).select('-credentials');

    if (!backupConfig) {
      res.status(404).json({
        success: false,
        error: 'Backup configuration not found',
      });
      return;
    }

    res.json({
      success: true,
      data: backupConfig,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteBackupConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const backupConfig = await CloudBackup.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!backupConfig) {
      res.status(404).json({
        success: false,
        error: 'Backup configuration not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Backup configuration deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const triggerBackup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const backupConfig = await CloudBackup.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!backupConfig) {
      res.status(404).json({
        success: false,
        error: 'Backup configuration not found',
      });
      return;
    }

    if (!backupConfig.enabled) {
      res.status(400).json({
        success: false,
        error: 'Backup is not enabled',
      });
      return;
    }

    await performBackup(req.userId!, backupConfig);

    backupConfig.lastBackup = new Date();
    await backupConfig.save();

    res.json({
      success: true,
      message: 'Backup completed successfully',
      data: {
        lastBackup: backupConfig.lastBackup,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Backup failed',
    });
  }
};
