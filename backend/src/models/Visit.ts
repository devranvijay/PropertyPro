import mongoose, { Schema, Document } from 'mongoose';

export interface IVisit extends Document {
    propertyId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    visitorName: string;
    visitorEmail: string;
    visitorPhone: string;
    visitDate: string;
    visitTime: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    sellerNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

const VisitSchema: Schema = new Schema({
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    visitorName: { type: String, required: true },
    visitorEmail: { type: String, required: true },
    visitorPhone: { type: String, default: '' },
    visitDate: { type: String, required: true },
    visitTime: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    sellerNote: { type: String },
}, { timestamps: true });

export default mongoose.model<IVisit>('Visit', VisitSchema);
