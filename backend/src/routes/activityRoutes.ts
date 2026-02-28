import express from 'express';
import { logActivity, getActivities } from '../controllers/activityController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/log', protect, logActivity);
router.get('/admin/tracking', protect, admin, getActivities);

export default router;
