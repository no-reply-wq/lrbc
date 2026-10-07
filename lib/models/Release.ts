import mongoose, { Schema, type Document } from 'mongoose';

// One "published version" of the website content. Exactly one release is live at a time.
export interface IRelease extends Document {
  label: string; data: Record<string, string>; live: boolean; count: number; createdAt: Date;
}

const ReleaseSchema = new Schema<IRelease>({
  label: { type: String, default: '' },
  data:  { type: Schema.Types.Mixed, default: {} },
  live:  { type: Boolean, default: false, index: true },
  count: { type: Number, default: 0 },
}, { timestamps: true, minimize: false });

export default mongoose.models.Release ??
  mongoose.model<IRelease>('Release', ReleaseSchema);
