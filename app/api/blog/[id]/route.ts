import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
export async function PUT(req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  const deny = requireAdmin(req); if (deny) return deny;
  try { await connectDB(); const { id } = await params; const body = await req.json(); if (body.published && !body.published_at) body.published_at = new Date(); const doc = await BlogPost.findByIdAndUpdate(id, body, { new:true }); if (!doc) return NextResponse.json({ error:'Not found' }, { status:404 }); return NextResponse.json(doc); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
export async function DELETE(req:NextRequest, { params }:{ params:Promise<{id:string}> }) {
  const deny = requireAdmin(req); if (deny) return deny;
  try { await connectDB(); const { id } = await params; await BlogPost.findByIdAndDelete(id); return NextResponse.json({ ok:true }); }
  catch (e:unknown) { return NextResponse.json({ error:String(e) }, { status:500 }); }
}
