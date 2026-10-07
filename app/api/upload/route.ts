import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Media from '@/lib/models/Media';
import { requireAdmin } from '@/lib/auth';

// Photos are stored in MongoDB (works on Vercel, nothing is lost on redeploy).
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
export async function POST(req: NextRequest) {
  const deny = requireAdmin(req); if (deny) return deny;
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: 'Image is larger than 4 MB.' }, { status: 413 });
    await connectDB();
    const doc = await Media.create({ name: file.name, mime: file.type, size: file.size, data: Buffer.from(await file.arrayBuffer()) });
    return NextResponse.json({ url: `/api/media/${doc._id}` });
  } catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
