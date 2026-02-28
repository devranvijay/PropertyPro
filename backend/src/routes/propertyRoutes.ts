import express from 'express';
import { getProperties, getPropertyById, createProperty, getMyProperties, incrementViews } from '../controllers/propertyController';
import { protect, admin } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.get('/', getProperties);
router.get('/my', protect, getMyProperties);
router.get('/:id', getPropertyById);
router.put('/:id/view', incrementViews);
router.post('/', protect, upload.array('images', 5), createProperty);

export default router;
