// =============================================================================
// LRBC — ONE SCRIPT TO SET UP EVERYTHING
// Writes every file needed for MongoDB + Admin Panel in one run.
//
// Run from repo root:
//   node setup-all-mongodb.js
// =============================================================================

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from repo root: cd D:\\lrbc-main\\lrbc-main');
  process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (pkg.name !== 'lrbc') {
  console.error('❌  Wrong folder. Must be inside lrbc-main.');
  process.exit(1);
}

function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak');
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  ✅  ' + rel);
}

// ─────────────────────────────────────────────────────────────────────────────
// next.config.ts — remove output:"export"
// ─────────────────────────────────────────────────────────────────────────────
write('next.config.ts', `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // static output mode removed — enables API routes for MongoDB
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
`);

// ─────────────────────────────────────────────────────────────────────────────
// lib/mongodb.ts
// ─────────────────────────────────────────────────────────────────────────────
write('lib/mongodb.ts', `import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? '';

if (!MONGODB_URI) {
  console.warn('[LRBC] MONGODB_URI not set in .env.local');
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
}

let cached = global._mongooseConn ?? null;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached) return cached;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined in .env.local');
  cached = await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  global._mongooseConn = cached;
  console.log('[LRBC] MongoDB connected');
  return cached;
}
`);

// ─────────────────────────────────────────────────────────────────────────────
// Mongoose models
// ─────────────────────────────────────────────────────────────────────────────
write('lib/models/Testimonial.ts', `import mongoose, { Schema, type Document } from 'mongoose';

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
`);

write('lib/models/CaseStudy.ts', `import mongoose, { Schema, type Document } from 'mongoose';

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
`);

write('lib/models/FAQ.ts', `import mongoose, { Schema, type Document } from 'mongoose';

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
`);

write('lib/models/TeamMember.ts', `import mongoose, { Schema, type Document } from 'mongoose';

export interface ITeamMember extends Document {
  name: string; role: string; avatar_url: string;
  linkedin_url: string; object_position: string; sort_order: number;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  name:            { type: String, required: true },
  role:            { type: String, default: '' },
  avatar_url:      { type: String, default: '' },
  linkedin_url:    { type: String, default: '' },
  object_position: { type: String, default: 'center top' },
  sort_order:      { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.TeamMember ??
  mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
`);

write('lib/models/BlogPost.ts', `import mongoose, { Schema, type Document } from 'mongoose';

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
`);

// ─────────────────────────────────────────────────────────────────────────────
// lib/db.ts — browser-safe fetch wrappers
// ─────────────────────────────────────────────────────────────────────────────
write('lib/db.ts', `// lib/db.ts — runs in the BROWSER, calls /api routes
export type Testimonial = {
  _id?: string; name: string; designation: string; company: string;
  image_url: string; quote: string; rating: number;
  featured: boolean; sort_order?: number;
};
export type CaseStudy = {
  _id?: string; client: string; industry: string; challenge: string;
  solution: string; result: string;
  metrics: { label: string; value: string }[];
  tags: string[]; featured: boolean; sort_order?: number;
};
export type FAQ = {
  _id?: string; question: string; answer: string;
  icon: string; sort_order?: number;
};
export type TeamMember = {
  _id?: string; name: string; role: string; avatar_url: string;
  linkedin_url: string; object_position: string; sort_order?: number;
};
export type BlogPost = {
  _id?: string; title: string; slug: string; excerpt: string;
  content: string; cover_url: string; author_name: string;
  tags: string[]; published: boolean; published_at?: string | null;
};

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }, ...options,
  });
  if (!res.ok) throw new Error('API error ' + res.status + ': ' + await res.text());
  return res.json();
}

export const getTestimonials  = () => api<Testimonial[]>('/api/testimonials');
export const addTestimonial   = (t: Omit<Testimonial,'_id'>) => api<Testimonial>('/api/testimonials', { method:'POST', body:JSON.stringify(t) });
export const updateTestimonial= (id:string, t:Partial<Testimonial>) => api<Testimonial>(\`/api/testimonials/\${id}\`, { method:'PUT', body:JSON.stringify(t) });
export const deleteTestimonial= (id:string) => api<{ok:boolean}>(\`/api/testimonials/\${id}\`, { method:'DELETE' });

export const getCaseStudies   = () => api<CaseStudy[]>('/api/case-studies');
export const addCaseStudy     = (cs:Omit<CaseStudy,'_id'>) => api<CaseStudy>('/api/case-studies', { method:'POST', body:JSON.stringify(cs) });
export const updateCaseStudy  = (id:string, cs:Partial<CaseStudy>) => api<CaseStudy>(\`/api/case-studies/\${id}\`, { method:'PUT', body:JSON.stringify(cs) });
export const deleteCaseStudy  = (id:string) => api<{ok:boolean}>(\`/api/case-studies/\${id}\`, { method:'DELETE' });

export const getFAQs    = () => api<FAQ[]>('/api/faqs');
export const addFAQ     = (f:Omit<FAQ,'_id'>) => api<FAQ>('/api/faqs', { method:'POST', body:JSON.stringify(f) });
export const updateFAQ  = (id:string, f:Partial<FAQ>) => api<FAQ>(\`/api/faqs/\${id}\`, { method:'PUT', body:JSON.stringify(f) });
export const deleteFAQ  = (id:string) => api<{ok:boolean}>(\`/api/faqs/\${id}\`, { method:'DELETE' });

export const getTeamMembers   = () => api<TeamMember[]>('/api/team');
export const addTeamMember    = (m:Omit<TeamMember,'_id'>) => api<TeamMember>('/api/team', { method:'POST', body:JSON.stringify(m) });
export const updateTeamMember = (id:string, m:Partial<TeamMember>) => api<TeamMember>(\`/api/team/\${id}\`, { method:'PUT', body:JSON.stringify(m) });
export const deleteTeamMember = (id:string) => api<{ok:boolean}>(\`/api/team/\${id}\`, { method:'DELETE' });

export const getBlogPosts  = (all=false) => api<BlogPost[]>(\`/api/blog\${all?'?all=1':''}\`);
export const addBlogPost   = (p:Omit<BlogPost,'_id'>) => api<BlogPost>('/api/blog', { method:'POST', body:JSON.stringify(p) });
export const updateBlogPost= (id:string, p:Partial<BlogPost>) => api<BlogPost>(\`/api/blog/\${id}\`, { method:'PUT', body:JSON.stringify(p) });
export const deleteBlogPost= (id:string) => api<{ok:boolean}>(\`/api/blog/\${id}\`, { method:'DELETE' });

export async function uploadImage(file:File, folder='general'): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  const res = await fetch('/api/upload', { method:'POST', body:form });
  if (!res.ok) throw new Error('Upload failed: ' + await res.text());
  const { url } = await res.json();
  return url;
}
`);

// ─────────────────────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────────────────────
write('app/api/testimonials/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';
export async function GET() {
  try { await connectDB(); const docs = await Testimonial.find().sort({ sort_order:1, createdAt:1 }).lean(); return NextResponse.json(docs); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function POST(req:NextRequest) {
  try { await connectDB(); const body = await req.json(); const doc = await Testimonial.create(body); return NextResponse.json(doc, { status:201 }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
`);

write('app/api/testimonials/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';
export async function PUT(req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  try { await connectDB(); const { id } = await params; const body = await req.json(); const doc = await Testimonial.findByIdAndUpdate(id, body, { new:true }); if (!doc) return NextResponse.json({ error:'Not found' }, { status:404 }); return NextResponse.json(doc); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function DELETE(_req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  try { await connectDB(); const { id } = await params; await Testimonial.findByIdAndDelete(id); return NextResponse.json({ ok:true }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
`);

write('app/api/case-studies/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CaseStudy from '@/lib/models/CaseStudy';
export async function GET() {
  try { await connectDB(); const docs = await CaseStudy.find().sort({ sort_order:1, createdAt:1 }).lean(); return NextResponse.json(docs); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function POST(req:NextRequest) {
  try { await connectDB(); const body = await req.json(); const doc = await CaseStudy.create(body); return NextResponse.json(doc, { status:201 }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
`);

write('app/api/case-studies/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CaseStudy from '@/lib/models/CaseStudy';
export async function PUT(req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  try { await connectDB(); const { id } = await params; const body = await req.json(); const doc = await CaseStudy.findByIdAndUpdate(id, body, { new:true }); if (!doc) return NextResponse.json({ error:'Not found' }, { status:404 }); return NextResponse.json(doc); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function DELETE(_req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  try { await connectDB(); const { id } = await params; await CaseStudy.findByIdAndDelete(id); return NextResponse.json({ ok:true }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
`);

write('app/api/faqs/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FAQ from '@/lib/models/FAQ';
export async function GET() {
  try { await connectDB(); const docs = await FAQ.find().sort({ sort_order:1, createdAt:1 }).lean(); return NextResponse.json(docs); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function POST(req:NextRequest) {
  try { await connectDB(); const body = await req.json(); const doc = await FAQ.create(body); return NextResponse.json(doc, { status:201 }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
`);

write('app/api/faqs/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FAQ from '@/lib/models/FAQ';
export async function PUT(req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  try { await connectDB(); const { id } = await params; const body = await req.json(); const doc = await FAQ.findByIdAndUpdate(id, body, { new:true }); if (!doc) return NextResponse.json({ error:'Not found' }, { status:404 }); return NextResponse.json(doc); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function DELETE(_req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  try { await connectDB(); const { id } = await params; await FAQ.findByIdAndDelete(id); return NextResponse.json({ ok:true }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
`);

write('app/api/team/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';
export async function GET() {
  try { await connectDB(); const docs = await TeamMember.find().sort({ sort_order:1 }).lean(); return NextResponse.json(docs); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function POST(req:NextRequest) {
  try { await connectDB(); const body = await req.json(); const doc = await TeamMember.create(body); return NextResponse.json(doc, { status:201 }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
`);

write('app/api/team/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';
export async function PUT(req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  try { await connectDB(); const { id } = await params; const body = await req.json(); const doc = await TeamMember.findByIdAndUpdate(id, body, { new:true }); if (!doc) return NextResponse.json({ error:'Not found' }, { status:404 }); return NextResponse.json(doc); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function DELETE(_req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  try { await connectDB(); const { id } = await params; await TeamMember.findByIdAndDelete(id); return NextResponse.json({ ok:true }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
`);

write('app/api/blog/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
export async function GET(req:NextRequest) {
  try { await connectDB(); const all = req.nextUrl.searchParams.get('all')==='1'; const docs = await BlogPost.find(all?{}:{published:true}).sort({ published_at:-1, createdAt:-1 }).lean(); return NextResponse.json(docs); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function POST(req:NextRequest) {
  try { await connectDB(); const body = await req.json(); if (body.published && !body.published_at) body.published_at = new Date(); const doc = await BlogPost.create(body); return NextResponse.json(doc, { status:201 }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
`);

write('app/api/blog/[id]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
export async function PUT(req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  try { await connectDB(); const { id } = await params; const body = await req.json(); if (body.published && !body.published_at) body.published_at = new Date(); const doc = await BlogPost.findByIdAndUpdate(id, body, { new:true }); if (!doc) return NextResponse.json({ error:'Not found' }, { status:404 }); return NextResponse.json(doc); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function DELETE(_req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  try { await connectDB(); const { id } = await params; await BlogPost.findByIdAndDelete(id); return NextResponse.json({ ok:true }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
`);

write('app/api/upload/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
export async function POST(req:NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error:'No file' }, { status:400 });
    const folder   = (form.get('folder') as string) ?? 'general';
    const ext      = file.name.split('.').pop() ?? 'jpg';
    const name     = Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
    const dir      = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(dir, { recursive:true });
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: '/uploads/' + folder + '/' + name });
  } catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
`);

// ─────────────────────────────────────────────────────────────────────────────
// app/testimonials-case-studies/page.tsx — with Load More + _id fix
// ─────────────────────────────────────────────────────────────────────────────
write('app/testimonials-case-studies/page.tsx', `"use client";

import { useEffect, useState } from "react";
import { HeroHeader }   from "@/components/header";
import FooterSection    from "@/components/footer-section";
import NewHeroSection   from "@/components/new-components/new-hero";
import { getTestimonials, getCaseStudies, type Testimonial, type CaseStudy } from "@/lib/db";
import { Star, Quote, TrendingUp, ArrowRight, ChevronDown } from "lucide-react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const T_PAGE  = 4;
const CS_PAGE = 2;

const FALLBACK_T: Testimonial[] = [
  { _id:"f1", name:"Varun Bathwal", designation:"CEO", company:"ARV", image_url:"/images/Varun.jpeg", rating:5, featured:true,
    quote:"The unique part about their offerings is that they spend time in understanding your business and its details, and offer products which have been made specifically for our needs rather than pushing any standard product." },
  { _id:"f2", name:"Kanul Verma", designation:"Executive Director", company:"Hitco Group", image_url:"/images/Kanul.jpeg", rating:5, featured:true,
    quote:"Team LRBC is highly capable and possesses extensive knowledge across various subjects, particularly in the area of process optimisation for business owners." },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={\`h-4 w-4 \${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}\`} />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="group relative flex flex-col gap-5 rounded-3xl border border-border bg-card/60 p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
      {t.featured && <span className="absolute right-5 top-5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Featured</span>}
      <Quote className="h-8 w-8 text-primary/60" />
      <p className="flex-1 text-base leading-7 text-foreground/90">{t.quote}</p>
      <StarRow rating={t.rating} />
      <div className="flex items-center gap-3 pt-1 border-t border-border/50">
        {t.image_url ? (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <img src={t.image_url} alt={t.name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{t.name[0]}</div>
        )}
        <div>
          <p className="font-semibold text-sm">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.designation} · {t.company}</p>
        </div>
      </div>
    </div>
  );
}

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <div className="relative rounded-3xl border border-border bg-card/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-400 to-pink-400" />
      <div className="p-7 sm:p-9 flex flex-col gap-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {cs.featured && <Badge variant="secondary" className="text-xs rounded-full">Featured</Badge>}
              <Badge variant="outline" className="text-xs rounded-full">{cs.industry}</Badge>
            </div>
            <h3 className="text-2xl font-semibold">{cs.client}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cs.tags.map(tag => <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{tag}</span>)}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {[{ label:"Challenge", text:cs.challenge, color:"text-red-500" }, { label:"Solution", text:cs.solution, color:"text-blue-500" }, { label:"Result", text:cs.result, color:"text-green-500" }]
            .map(({ label, text, color }) => (
              <div key={label} className="rounded-2xl bg-muted/40 p-5">
                <p className={\`text-xs font-semibold uppercase tracking-wider mb-2 \${color}\`}>{label}</p>
                <p className="text-sm text-foreground/80 leading-6">{text}</p>
              </div>
          ))}
        </div>
        {cs.metrics.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {cs.metrics.map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-1 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-center min-w-[130px]">
                <span className="text-xl font-bold text-primary">{m.value}</span>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadMoreBtn({ onClick, remaining }: { onClick: () => void; remaining: number }) {
  return (
    <div className="flex justify-center mt-8">
      <button onClick={onClick}
        className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5">
        <ChevronDown className="h-4 w-4" />
        Load {remaining} more
      </button>
    </div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [caseStudies,  setCaseStudies]  = useState<CaseStudy[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [tVisible,     setTVisible]     = useState(T_PAGE);
  const [csVisible,    setCsVisible]    = useState(CS_PAGE);

  useEffect(() => {
    async function load() {
      try {
        const [t, cs] = await Promise.all([getTestimonials(), getCaseStudies()]);
        setTestimonials(t.length > 0 ? t : FALLBACK_T);
        setCaseStudies(cs);
      } catch { setTestimonials(FALLBACK_T); setCaseStudies([]); }
      finally  { setLoading(false); }
    }
    load();
  }, []);

  const shownT  = testimonials.slice(0, tVisible);
  const shownCs = caseStudies.slice(0, csVisible);
  const moreT   = testimonials.length - tVisible;
  const moreCs  = caseStudies.length  - csVisible;

  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />
      <NewHeroSection
        title={<h1 className="mx-auto max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl xl:text-[5.25rem]"><span className="overflow-hidden">Real Results.</span><span className="overflow-hidden">Real Clients.</span></h1>}
        subtitle="Hear directly from the businesses we have helped and see the numbers behind each engagement."
        buttonText="Book a Discovery Call" buttonHref="/contact"
        badgeText="Testimonials and Case Studies"
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Client Voices</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">What Our Clients Say</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">Every quote came directly from a founder, director, or operations leader we have worked with.</p>
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="rounded-3xl border border-border bg-card/40 h-64 animate-pulse" />)}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              {shownT.map(t => <TestimonialCard key={t._id ?? t.name} t={t} />)}
            </div>
            {moreT > 0 && <LoadMoreBtn remaining={Math.min(moreT, T_PAGE)} onClick={() => setTVisible(v => v + T_PAGE)} />}
          </>
        )}
      </section>

      <div className="mx-auto max-w-6xl px-6"><div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" /></div>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Deep Dives</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">The Work, In Detail</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">Each case study shows the specific problem, the system we built, and the measurable outcome.</p>
        </div>
        {loading ? (
          <div className="flex flex-col gap-8">
            {Array.from({ length: 2 }).map((_, i) => <div key={i} className="rounded-3xl border border-border bg-card/40 h-72 animate-pulse" />)}
          </div>
        ) : caseStudies.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No case studies yet. Add them from the <Link href="/12245-admin" className="text-primary underline">admin panel</Link>.</p>
        ) : (
          <>
            <div className="flex flex-col gap-8">
              {shownCs.map(cs => <CaseStudyCard key={cs._id ?? cs.client} cs={cs} />)}
            </div>
            {moreCs > 0 && <LoadMoreBtn remaining={Math.min(moreCs, CS_PAGE)} onClick={() => setCsVisible(v => v + CS_PAGE)} />}
          </>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-10 text-center shadow-sm">
          <TrendingUp className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h3 className="text-2xl sm:text-3xl font-semibold mb-3">Ready to become the next case study?</h3>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto text-sm sm:text-base">Book a discovery call and let us map out what a Business Operating System looks like for your operations.</p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/contact?openForm=true">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
`);

// ─────────────────────────────────────────────────────────────────────────────
// Verify
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n── Verification ──');
const checks = [
  ['next.config.ts',                                    '"export"'],               // should NOT exist
  ['lib/mongodb.ts',                                    'connectDB'],
  ['lib/models/Testimonial.ts',                         'TestimonialSchema'],
  ['lib/models/BlogPost.ts',                            'BlogPostSchema'],
  ['lib/db.ts',                                         'getTestimonials'],
  ['app/api/testimonials/route.ts',                     'Testimonial.find'],
  ['app/api/testimonials/[id]/route.ts',                'findByIdAndUpdate'],
  ['app/api/case-studies/route.ts',                     'CaseStudy.find'],
  ['app/api/faqs/route.ts',                             'FAQ.find'],
  ['app/api/team/route.ts',                             'TeamMember.find'],
  ['app/api/blog/route.ts',                             'BlogPost.find'],
  ['app/api/upload/route.ts',                           'writeFile'],
  ['app/testimonials-case-studies/page.tsx',            'LoadMoreBtn'],
  ['app/testimonials-case-studies/page.tsx',            '_id'],
];

let allOk = true;
checks.forEach(([file, needle]) => {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) { console.error('  ✗  MISSING FILE: ' + file); allOk = false; return; }
  const content = fs.readFileSync(abs, 'utf8');
  if (file === 'next.config.ts') {
    if (!content.includes('"export"')) console.log('  ✓  next.config.ts → output:"export" removed');
    else { console.error('  ✗  next.config.ts still has output:"export"'); allOk = false; }
    return;
  }
  if (content.includes(needle)) console.log('  ✓  ' + path.basename(file) + ' → ' + needle);
  else { console.error('  ✗  MISSING "' + needle + '" in ' + file); allOk = false; }
});

if (!allOk) { console.error('\n❌  Some checks failed'); process.exit(1); }

console.log(`
══════════════════════════════════════════════════════════════════
  All files written successfully.

  ── YOUR EXACT .env.local content ────────────────────────────────
  Open .env.local in VS Code and make sure it contains:

  MONGODB_URI=mongodb+srv://adhikariparamita321_db_user:M3pQsMvbtAtoXYBO@cluster0.n1scqfx.mongodb.net/lrbc?retryWrites=true&w=majority
  NEXT_PUBLIC_ADMIN_PIN=lrbc2025

  ── THEN RUN ─────────────────────────────────────────────────────
  pnpm dev

  ── TEST ─────────────────────────────────────────────────────────
  http://localhost:3000/12245-admin          (admin panel)
  http://localhost:3000/testimonials-case-studies  (public page)
══════════════════════════════════════════════════════════════════
`);
