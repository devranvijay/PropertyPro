import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    phone: string;
    message: string;
    propertyId?: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    createdAt: Date;
}

const ContactSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IContact>('Contact', ContactSchema);
