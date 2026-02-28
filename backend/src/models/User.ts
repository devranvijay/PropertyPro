import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'buyer' | 'seller' | 'admin';
    favorites: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Property' }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
