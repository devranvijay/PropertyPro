import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry';
import Property from '../models/Property';
import User from '../models/User';

// POST /api/inquiries — buyer sends inquiry
export const sendInquiry = async (req: any, res: Response) => {
    try {
        const { propertyId, message, senderPhone } = req.body;

        if (!propertyId || !message) {
            return res.status(400).json({ message: 'Property and message are required.' });
        }

        const property = await Property.findById(propertyId).populate('owner');
        if (!property) return res.status(404).json({ message: 'Property not found.' });

        // Find recipient: property owner or admin fallback
        let recipientId = (property.owner as any)?._id;
        if (!recipientId) {
            const admin = await User.findOne({ role: 'admin' });
            recipientId = admin?._id;
        }

        if (!recipientId) {
            return res.status(400).json({ message: 'Could not find a recipient for this inquiry.' });
        }

        const inquiry = new Inquiry({
            propertyId,
            senderId: req.user._id,
            recipientId,
            senderName: req.user.name,
            senderEmail: req.user.email,
            senderPhone: senderPhone || '',
            message,
        });

        await inquiry.save();
        res.status(201).json({ message: 'Inquiry sent! The seller will reply soon.', inquiry });
    } catch (error) {
        console.error('sendInquiry error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/inquiries/sent — buyer sees inquiries they've sent
export const getSentInquiries = async (req: any, res: Response) => {
    try {
        const inquiries = await Inquiry.find({ senderId: req.user._id })
            .populate('propertyId', 'title location price images')
            .sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/inquiries/received — seller sees inquiries they received
export const getReceivedInquiries = async (req: any, res: Response) => {
    try {
        const inquiries = await Inquiry.find({ recipientId: req.user._id })
            .populate('propertyId', 'title location price images')
            .sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/inquiries/admin — admin sees all
export const getAllInquiries = async (req: any, res: Response) => {
    try {
        const inquiries = await Inquiry.find()
            .populate('propertyId', 'title location price')
            .sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// PUT /api/inquiries/:id/read — mark as read
export const markAsRead = async (req: any, res: Response) => {
    try {
        await Inquiry.findByIdAndUpdate(req.params.id, { status: 'read' });
        res.json({ message: 'Marked as read.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// PUT /api/inquiries/:id/reply — seller replies
export const replyToInquiry = async (req: any, res: Response) => {
    try {
        const { reply } = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { reply, status: 'replied', repliedAt: new Date() },
            { new: true }
        ).populate('propertyId', 'title location');

        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
        res.json({ message: 'Reply sent.', inquiry });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};
