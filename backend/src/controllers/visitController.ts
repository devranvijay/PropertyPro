import { Request, Response } from 'express';
import Visit from '../models/Visit';
import Property from '../models/Property';

// POST /api/visits — visitor books a visit
export const bookVisit = async (req: any, res: Response) => {
    try {
        const { propertyId, visitorName, visitorPhone, visitDate, visitTime } = req.body;

        if (!propertyId || !visitDate || !visitTime) {
            return res.status(400).json({ message: 'Property, date and time are required.' });
        }

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found.' });

        const visit = new Visit({
            propertyId,
            userId: req.user._id,
            visitorName: visitorName || req.user.name,
            visitorEmail: req.user.email,
            visitorPhone: visitorPhone || '',
            visitDate,
            visitTime,
        });

        await visit.save();
        res.status(201).json({ message: 'Visit scheduled! Seller will confirm shortly.', visit });
    } catch (error) {
        console.error('bookVisit error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/visits/my — visitor views their upcoming visits
export const getMyVisits = async (req: any, res: Response) => {
    try {
        const visits = await Visit.find({ userId: req.user._id })
            .populate('propertyId', 'title location price images')
            .sort({ visitDate: 1 });
        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/visits/incoming — seller sees incoming visit requests for their properties
export const getIncomingVisits = async (req: any, res: Response) => {
    try {
        const myProperties = await Property.find({ owner: req.user._id }).select('_id');
        const propertyIds = myProperties.map(p => p._id);

        const visits = await Visit.find({ propertyId: { $in: propertyIds } })
            .populate('propertyId', 'title location price images')
            .sort({ visitDate: 1 });

        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/visits/admin — admin sees all visits
export const getAllVisits = async (req: any, res: Response) => {
    try {
        const visits = await Visit.find()
            .populate('propertyId', 'title location price')
            .sort({ createdAt: -1 });
        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// PUT /api/visits/:id/status — seller confirms or cancels a visit
export const updateVisitStatus = async (req: any, res: Response) => {
    try {
        const { status, sellerNote } = req.body;
        const visit = await Visit.findByIdAndUpdate(
            req.params.id,
            { status, sellerNote },
            { new: true }
        ).populate('propertyId', 'title location');

        if (!visit) return res.status(404).json({ message: 'Visit not found.' });
        res.json({ message: 'Visit status updated.', visit });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};
