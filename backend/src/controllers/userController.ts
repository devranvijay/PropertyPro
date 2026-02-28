import { Request, Response } from 'express';
import User from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User Terminated' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
