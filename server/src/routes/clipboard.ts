import { Router } from 'express';
import {
  getClipboardItems,
  createClipboardItem,
  updateClipboardItem,
  deleteClipboardItem,
  incrementUsageCount,
  getMostUsed,
  getStats,
  searchClipboard,
} from '../controllers/clipboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getClipboardItems);
router.post('/', createClipboardItem);
router.put('/:id', updateClipboardItem);
router.delete('/:id', deleteClipboardItem);
router.post('/:id/use', incrementUsageCount);
router.get('/most-used', getMostUsed);
router.get('/stats', getStats);
router.get('/search', searchClipboard);

export default router;
