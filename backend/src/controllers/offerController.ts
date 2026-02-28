import { Request, Response } from 'express';
import Offer from '../models/Offer';
import Property from '../models/Property';

// POST /api/offers — buyer submits an offer
export const createOffer = async (req: any, res: Response) => {
    try {
        const { propertyId, offerAmount, note, buyerPhone } = req.body;

        if (!propertyId || !offerAmount) {
            return res.status(400).json({ message: 'Property and offer amount are required.' });
        }

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found.' });

        const offer = new Offer({
            propertyId,
            buyerId: req.user._id,
            buyerName: req.user.name,
            buyerEmail: req.user.email,
            buyerPhone: buyerPhone || '',
            offerAmount: Number(offerAmount),
            note: note || '',
        });

        await offer.save();
        res.status(201).json({ message: 'Offer submitted successfully!', offer });
    } catch (error) {
        console.error('createOffer error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/offers/my — buyer sees their own offers
export const getMyOffers = async (req: any, res: Response) => {
    try {
        const offers = await Offer.find({ buyerId: req.user._id })
            .populate('propertyId', 'title location price images')
            .sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/offers/received — seller sees offers on their properties
export const getReceivedOffers = async (req: any, res: Response) => {
    try {
        const myProperties = await Property.find({ owner: req.user._id }).select('_id');
        const propertyIds = myProperties.map(p => p._id);

        const offers = await Offer.find({ propertyId: { $in: propertyIds } })
            .populate('propertyId', 'title location price images')
            .sort({ createdAt: -1 });

        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/offers/admin — admin sees all offers
export const getAllOffers = async (req: any, res: Response) => {
    try {
        const offers = await Offer.find()
            .populate('propertyId', 'title location price')
            .sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// PUT /api/offers/:id/status — seller updates offer status
export const updateOfferStatus = async (req: any, res: Response) => {
    try {
        const { status, sellerNote, counterAmount } = req.body;
        const offer = await Offer.findByIdAndUpdate(
            req.params.id,
            { status, sellerNote, counterAmount },
            { new: true }
        ).populate('propertyId', 'title location price');

        if (!offer) return res.status(404).json({ message: 'Offer not found.' });
        res.json({ message: 'Offer status updated.', offer });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};
