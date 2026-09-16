import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteContent from '@/lib/models/SiteContent';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    await connectDB();
    const { key } = await params;
    const doc = await SiteContent.findOne({ key }).lean();
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    await connectDB();
    const { key } = await params;
    const body = await req.json();
    const doc = await SiteContent.findOneAndUpdate(
      { key },
      { $set: { data: body.data, section: body.section } },
      { new: true, upsert: true }
    );
    return NextResponse.json(doc);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
