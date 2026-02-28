import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
    propertyId: mongoose.Types.ObjectId;
    buyerId: mongoose.Types.ObjectId;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    offerAmount: number;
    note?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'countered';
    counterAmount?: number;
    sellerNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OfferSchema: Schema = new Schema({
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, default: '' },
    offerAmount: { type: Number, required: true },
    note: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'countered'], default: 'pending' },
    counterAmount: { type: Number },
    sellerNote: { type: String },
}, { timestamps: true });

export default mongoose.model<IOffer>('Offer', OfferSchema);
