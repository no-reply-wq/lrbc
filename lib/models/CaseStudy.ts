import mongoose, { Schema, type Document } from 'mongoose';

export interface ICaseStudy extends Document {
  client: string; industry: string; challenge: string;
  solution: string; result: string;
  metrics: { label: string; value: string }[];
  tags: string[]; featured: boolean; sort_order: number;
}

const CaseStudySchema = new Schema<ICaseStudy>({
  client:     { type: String, required: true },
  industry:   { type: String, default: '' },
  challenge:  { type: String, default: '' },
  solution:   { type: String, default: '' },
  result:     { type: String, default: '' },
  metrics:    [{ label: String, value: String }],
  tags:       [String],
  featured:   { type: Boolean, default: false },
  sort_order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.CaseStudy ??
  mongoose.model<ICaseStudy>('CaseStudy', CaseStudySchema);
