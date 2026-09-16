import mongoose, { Schema, type Document } from 'mongoose';

export interface ISiteContent extends Document {
  key: string;       // unique e.g. "home_hero", "about_story"
  page: string;      // "home" | "about" | "lekhasetu" | "contact" | "testimonials"
  section: string;   // human-readable e.g. "Hero Section"
  data: Record<string, unknown>;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>({
  key:     { type: String, required: true, unique: true },
  page:    { type: String, required: true },
  section: { type: String, required: true },
  data:    { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.models.SiteContent ??
  mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
