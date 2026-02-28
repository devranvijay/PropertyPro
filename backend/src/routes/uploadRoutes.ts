import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', upload.array('images', 10), (req, res) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    const filePaths = (req.files as Express.Multer.File[]).map(
        (file) => `/uploads/${file.filename}`
    );

    res.json({
        message: 'Images uploaded successfully',
        imageUrls: filePaths,
    });
});

export default router;
