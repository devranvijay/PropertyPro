import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
    propertyId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    recipientId: mongoose.Types.ObjectId;
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    message: string;
    status: 'unread' | 'read' | 'replied';
    reply?: string;
    repliedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const InquirySchema: Schema = new Schema({
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderPhone: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
    reply: { type: String },
    repliedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model<IInquiry>('Inquiry', InquirySchema);
