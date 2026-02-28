import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
    user: mongoose.Types.ObjectId;
    property: mongoose.Types.ObjectId;
    action: 'visit' | 'inquiry' | 'save';
    timestamp: Date;
}

const ActivitySchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    action: { type: String, enum: ['visit', 'inquiry', 'save'], default: 'visit' }
}, { timestamps: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
