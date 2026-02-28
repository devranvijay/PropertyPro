import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
    createOffer,
    getMyOffers,
    getReceivedOffers,
    getAllOffers,
    updateOfferStatus
} from '../controllers/offerController';

const router = express.Router();

// Buyer routes
router.post('/', protect, createOffer);             // Submit an offer
router.get('/my', protect, getMyOffers);            // See my submitted offers

// Seller routes
router.get('/received', protect, getReceivedOffers); // Offers received on my properties
router.put('/:id/status', protect, updateOfferStatus); // Accept/reject/counter

// Admin route
router.get('/admin/all', protect, admin, getAllOffers);

export default router;
