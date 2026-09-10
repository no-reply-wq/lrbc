import mongoose, { Schema, type Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string; answer: string; icon: string; sort_order: number;
}

const FAQSchema = new Schema<IFAQ>({
  question:   { type: String, required: true },
  answer:     { type: String, required: true },
  icon:       { type: String, default: 'circle-help' },
  sort_order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.FAQ ??
  mongoose.model<IFAQ>('FAQ', FAQSchema);
