import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
    title: string;
    description: string;
    price: number;
    location: string;
    type: string;
    images: string[];
    amenities: string[];
    owner: mongoose.Types.ObjectId;
    views: number;
    createdAt: Date;
}

const PropertySchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IProperty>('Property', PropertySchema);
