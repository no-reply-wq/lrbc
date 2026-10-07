import mongoose, { Schema, type Document } from 'mongoose';

export interface IMedia extends Document { name: string; mime: string; size: number; data: Buffer; }

const MediaSchema = new Schema<IMedia>({
  name: { type: String, default: '' },
  mime: { type: String, required: true },
  size: { type: Number, default: 0 },
  data: { type: Buffer, required: true },
}, { timestamps: true });

export default mongoose.models.Media ??
  mongoose.model<IMedia>('Media', MediaSchema);
