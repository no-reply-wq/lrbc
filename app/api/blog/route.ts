import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
export async function GET(req:NextRequest) {
  try { await connectDB(); const all = req.nextUrl.searchParams.get('all')==='1'; if (all) { const deny = requireAdmin(req); if (deny) return deny; } const docs = await BlogPost.find(all?{}:{published:true}).sort({ published_at:-1, createdAt:-1 }).lean(); return NextResponse.json(docs); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function POST(req:NextRequest) {
  const deny = requireAdmin(req); if (deny) return deny;
  try { await connectDB(); const body = await req.json(); if (body.published && !body.published_at) body.published_at = new Date(); const doc = await BlogPost.create(body); return NextResponse.json(doc, { status:201 }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
