import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
    sendInquiry,
    getSentInquiries,
    getReceivedInquiries,
    getAllInquiries,
    markAsRead,
    replyToInquiry
} from '../controllers/inquiryController';

const router = express.Router();

// Buyer routes
router.post('/', protect, sendInquiry);         // Send inquiry
router.get('/sent', protect, getSentInquiries); // My sent inquiries

// Seller routes
router.get('/received', protect, getReceivedInquiries);  // Received inquiries
router.put('/:id/read', protect, markAsRead);            // Mark as read
router.put('/:id/reply', protect, replyToInquiry);       // Reply to inquiry

// Admin route
router.get('/admin/all', protect, admin, getAllInquiries);

export default router;
