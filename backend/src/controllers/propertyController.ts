import { Request, Response } from 'express';
import Property from '../models/Property';

export const getProperties = async (req: Request, res: Response) => {
    try {
        const { search, minPrice, maxPrice, type, location } = req.query;
        let query: any = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (type) {
            const types = (type as string).split(',');
            query.type = { $in: types };
        }

        if (location) {
            query.location = { $regex: location as string, $options: 'i' };
        }

        const properties = await Property.find(query).populate('owner', 'name email');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getPropertyById = async (req: Request, res: Response) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email');
        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const incrementViews = async (req: Request, res: Response) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json({ views: property.views });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createProperty = async (req: any, res: Response) => {
    try {
        const { title, description, price, location, type, images, amenities } = req.body;

        const property = new Property({
            title,
            description,
            price,
            location,
            type,
            images,
            amenities,
            owner: (req as any).user._id
        });

        const createdProperty = await property.save();
        res.status(201).json(createdProperty);
    } catch (error) {
        res.status(400).json({ message: 'Invalid property data' });
    }
};

export const getMyProperties = async (req: any, res: Response) => {
    try {
        const properties = await Property.find({ owner: req.user._id });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
