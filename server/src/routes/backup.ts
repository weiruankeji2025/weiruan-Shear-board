import { Router } from 'express';
import {
  getBackupConfigs,
  createBackupConfig,
  updateBackupConfig,
  deleteBackupConfig,
  triggerBackup,
} from '../controllers/cloudBackupController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getBackupConfigs);
router.post('/', createBackupConfig);
router.put('/:id', updateBackupConfig);
router.delete('/:id', deleteBackupConfig);
router.post('/:id/trigger', triggerBackup);

export default router;
