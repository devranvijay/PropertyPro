import express from 'express';
import User from '../models/User';
import { protect, admin } from '../middleware/authMiddleware';
import { getAllUsers, deleteUser, updateUserRole } from '../controllers/userController';

const router = express.Router();

// Toggle Save Property
router.post('/toggle-save', protect, async (req: any, res) => {
    try {
        const { propertyId } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isSaved = user.favorites.includes(propertyId);

        if (isSaved) {
            user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
        } else {
            user.favorites.push(propertyId);
        }

        await user.save();
        res.json({ isSaved: !isSaved, message: isSaved ? 'Removed from favorites' : 'Added to favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get My Saved Properties
router.get('/saved', protect, async (req: any, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin Routes
router.get('/all', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);

export default router;
