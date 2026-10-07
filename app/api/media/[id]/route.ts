import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Media from '@/lib/models/Media';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return new NextResponse('Not found', { status: 404 });
    await connectDB();
    const doc = await Media.findById(id).lean<{ mime: string; data: { buffer?: ArrayBuffer } | Buffer }>();
    if (!doc) return new NextResponse('Not found', { status: 404 });
    const buf = Buffer.isBuffer(doc.data) ? doc.data : Buffer.from((doc.data as { buffer: ArrayBuffer }).buffer ?? (doc.data as unknown as ArrayBuffer));
    return new NextResponse(new Uint8Array(buf), {
      headers: { 'Content-Type': doc.mime, 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  } catch { return new NextResponse('Error', { status: 500 }); }
}
