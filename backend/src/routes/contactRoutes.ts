import express from 'express';
import { submitContactForm, getSellerInquiries } from '../controllers/contactController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', submitContactForm);
router.get('/my', protect, getSellerInquiries);

export default router;
