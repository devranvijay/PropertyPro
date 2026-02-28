import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'propertypro',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    } as any,
});

const upload = multer({ storage });

router.post('/', upload.array('images', 10), (req, res) => {
    if (!req.files || (req.files as any).length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    // Cloudinary returns the full URL in file.path
    const filePaths = (req.files as any[]).map((file) => file.path);

    res.json({
        message: 'Images uploaded to Cloudinary successfully',
        imageUrls: filePaths,
    });
});

export default router;
