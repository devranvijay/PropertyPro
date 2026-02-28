import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import Contact from '../models/Contact';
import Property from '../models/Property';
import User from '../models/User';

export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, message, propertyId } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        let recipientId;
        let recipientEmail = process.env.EMAIL_TO || 'devchiragyadav@gmail.com';

        if (propertyId) {
            const property = await Property.findById(propertyId).populate('owner');
            if (property && property.owner) {
                recipientId = (property.owner as any)._id;
                recipientEmail = (property.owner as any).email;
            }
        }

        if (!recipientId) {
            const admin = await User.findOne({ role: 'admin' });
            recipientId = admin ? admin._id : null;
            if (admin) recipientEmail = admin.email;
        }

        const contact = new Contact({
            name,
            email,
            phone,
            message,
            propertyId,
            recipient: recipientId
        });

        await contact.save();

        // Nodemailer Setup
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"PropertyPro Notifications" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: `🚀 New Property Inquiry: ${name}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background-color: #6366f1; padding: 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">PropertyPro</h1>
                        <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 14px;">Real Estate Management System</p>
                    </div>
                    
                    <div style="padding: 32px; background-color: #ffffff;">
                        <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">New Inquiry Details</h2>
                        
                        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            <tr>
                                <td style="padding: 12px 0; color: #64748b; font-weight: 600; width: 35%; border-bottom: 1px solid #f1f5f9;">Full Name</td>
                                <td style="padding: 12px 0; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">Email Address</td>
                                <td style="padding: 12px 0; color: #3b82f6; border-bottom: 1px solid #f1f5f9;">
                                    <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #64748b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">Phone Number</td>
                                <td style="padding: 12px 0; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #64748b; font-weight: 600; vertical-align: top; padding-top: 16px;">Message</td>
                                <td style="padding: 16px 0; color: #475569; line-height: 1.6;">${message}</td>
                            </tr>
                        </table>
                        
                        <div style="margin-top: 32px; padding: 20px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
                            <p style="margin: 0; color: #64748b; font-size: 14px;">This inquiry was sent from the PropertyPro Contact Form.</p>
                            <a href="mailto:${email}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Reply to Inquiry</a>
                        </div>
                    </div>
                    
                    <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
                        &copy; ${new Date().getFullYear()} PropertyPro. All rights reserved.
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('[EMAIL SENT] professional notification delivered');

        res.status(201).json({ message: 'Message sent! We will get back to you soon.' });
    } catch (error) {
        console.error('Error in submitContactForm:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getSellerInquiries = async (req: any, res: Response) => {
    try {
        const inquiries = await Contact.find({ recipient: req.user._id })
            .populate('propertyId', 'title location price')
            .sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
