import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import activityRoutes from './routes/activityRoutes';
import contactRoutes from './routes/contactRoutes';
import uploadRoutes from './routes/uploadRoutes';
import userRoutes from './routes/userRoutes';
import offerRoutes from './routes/offerRoutes';
import visitRoutes from './routes/visitRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import path from 'path';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: false, // Help with CORS/images
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Static folder for uploads
app.use('/uploads', express.static(path.join(path.resolve(), '/uploads')));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'PropertyPro API is running' });
});

// Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

export default app;
