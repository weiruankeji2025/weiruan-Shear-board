import axios from 'axios';
import ClipboardItem from '../models/ClipboardItem';
import { ICloudBackup } from '../models/CloudBackup';

export const performBackup = async (userId: string, backupConfig: ICloudBackup): Promise<void> => {
  try {
    // Get all clipboard items for the user
    const items = await ClipboardItem.find({ userId }).sort({ createdAt: -1 });

    const backupData = {
      timestamp: new Date().toISOString(),
      itemCount: items.length,
      items: items.map(item => ({
        content: item.content,
        type: item.type,
        metadata: item.metadata,
        usageCount: item.usageCount,
        isPinned: item.isPinned,
        tags: item.tags,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    };

    const backupJson = JSON.stringify(backupData, null, 2);

    switch (backupConfig.provider) {
      case 'google-drive':
        await backupToGoogleDrive(backupJson, backupConfig);
        break;
      case 'onedrive':
        await backupToOneDrive(backupJson, backupConfig);
        break;
      case 'dropbox':
        await backupToDropbox(backupJson, backupConfig);
        break;
      default:
        throw new Error('Unsupported backup provider');
    }
  } catch (error: any) {
    throw new Error(`Backup failed: ${error.message}`);
  }
};

async function backupToGoogleDrive(data: string, config: ICloudBackup): Promise<void> {
  if (!config.credentials?.accessToken) {
    throw new Error('Google Drive access token not found');
  }

  const fileName = `clipboard-backup-${new Date().toISOString()}.json`;
  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    parents: config.config?.folderId ? [config.config.folderId] : [],
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([data], { type: 'application/json' }));

  await axios.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', form, {
    headers: {
      Authorization: `Bearer ${config.credentials.accessToken}`,
    },
  });
}

async function backupToOneDrive(data: string, config: ICloudBackup): Promise<void> {
  if (!config.credentials?.accessToken) {
    throw new Error('OneDrive access token not found');
  }

  const fileName = `clipboard-backup-${new Date().toISOString()}.json`;
  const folderPath = config.config?.folderId || 'root';

  await axios.put(
    `https://graph.microsoft.com/v1.0/me/drive/${folderPath}:/${fileName}:/content`,
    data,
    {
      headers: {
        Authorization: `Bearer ${config.credentials.accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
}

async function backupToDropbox(data: string, config: ICloudBackup): Promise<void> {
  if (!config.credentials?.accessToken) {
    throw new Error('Dropbox access token not found');
  }

  const fileName = `clipboard-backup-${new Date().toISOString()}.json`;
  const path = config.config?.folderId
    ? `${config.config.folderId}/${fileName}`
    : `/${fileName}`;

  await axios.post(
    'https://content.dropboxapi.com/2/files/upload',
    data,
    {
      headers: {
        Authorization: `Bearer ${config.credentials.accessToken}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path,
          mode: 'add',
          autorename: true,
          mute: false,
        }),
      },
    }
  );
}

export const scheduleAutoBackup = async (userId: string, backupConfig: ICloudBackup): Promise<void> => {
  if (!backupConfig.config?.autoBackup) {
    return;
  }

  const interval = backupConfig.config.backupInterval || 86400000; // Default 24 hours

  setInterval(async () => {
    try {
      await performBackup(userId, backupConfig);
      backupConfig.lastBackup = new Date();
      await backupConfig.save();
    } catch (error) {
      console.error('Auto backup failed:', error);
    }
  }, interval);
};
