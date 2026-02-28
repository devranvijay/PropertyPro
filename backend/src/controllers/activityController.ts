import { Request, Response } from 'express';
import Activity from '../models/Activity';

export const logActivity = async (req: any, res: Response) => {
    try {
        const { propertyId, action } = req.body;

        const activity = await Activity.create({
            user: (req as any).user._id,
            property: propertyId,
            action: action || 'visit'
        });

        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ message: 'Error logging activity' });
    }
};

export const getActivities = async (req: Request, res: Response) => {
    try {
        const activities = await Activity.find({})
            .populate('user', 'name email')
            .populate('property', 'title location')
            .sort({ createdAt: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
