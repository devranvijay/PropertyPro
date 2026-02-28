import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
    bookVisit,
    getMyVisits,
    getIncomingVisits,
    getAllVisits,
    updateVisitStatus
} from '../controllers/visitController';

const router = express.Router();

// Buyer routes
router.post('/', protect, bookVisit);           // Book a visit
router.get('/my', protect, getMyVisits);        // My upcoming visits

// Seller routes
router.get('/incoming', protect, getIncomingVisits);         // Incoming visit requests
router.put('/:id/status', protect, updateVisitStatus);       // Confirm/cancel/complete

// Admin route
router.get('/admin/all', protect, admin, getAllVisits);

export default router;
