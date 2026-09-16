import mongoose, { Schema, type Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string; slug: string; excerpt: string; content: string;
  cover_url: string; author_name: string; tags: string[];
  published: boolean; published_at: Date | null;
}

const BlogPostSchema = new Schema<IBlogPost>({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  excerpt:     { type: String, default: '' },
  content:     { type: String, default: '' },
  cover_url:   { type: String, default: '' },
  author_name: { type: String, default: 'LRBC Team' },
  tags:        [String],
  published:   { type: Boolean, default: false },
  published_at:{ type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.BlogPost ??
  mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
