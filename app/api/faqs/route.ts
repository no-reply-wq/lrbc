import { NextRequest, NextResponse } from 'next/server';
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
