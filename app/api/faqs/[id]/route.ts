import { NextRequest, NextResponse } from 'next/server';
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
