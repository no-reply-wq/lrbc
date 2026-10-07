import mongoose, { Schema, type Document } from 'mongoose';

export interface IContentItem extends Document { key: string; value: string; }

const ContentItemSchema = new Schema<IContentItem>({
  key:   { type: String, required: true, unique: true, index: true },
  value: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.ContentItem ??
  mongoose.model<IContentItem>('ContentItem', ContentItemSchema);
