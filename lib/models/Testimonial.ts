import mongoose, { Schema, type Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string; designation: string; company: string;
  image_url: string; quote: string; rating: number;
  featured: boolean; sort_order: number;
  createdAt: Date; updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  name:        { type: String, required: true },
  designation: { type: String, default: '' },
  company:     { type: String, default: '' },
  image_url:   { type: String, default: '' },
  quote:       { type: String, required: true },
  rating:      { type: Number, default: 5, min: 1, max: 5 },
  featured:    { type: Boolean, default: false },
  sort_order:  { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Testimonial ??
  mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
