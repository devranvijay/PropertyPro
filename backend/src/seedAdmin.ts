import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/propertypro');

        const existingAdmin = await User.findOne({ email: 'superadmin@propertypro.com' });
        if (existingAdmin) {
            console.log('Super Admin already exists.');
            process.exit();
        }

        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        const admin = new User({
            name: 'Super Admin',
            email: 'superadmin@propertypro.com',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('Super Admin created successfully!');
        console.log('Email: superadmin@propertypro.com');
        console.log('Pass: Admin@123');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
