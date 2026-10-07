import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { makeLive, deleteRelease } from '@/lib/store';

// Go back to this version (it becomes live again)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = requireAdmin(req); if (deny) return deny;
  try {
    const { id } = await params;
    const ok = await makeLive(id);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidateTag('content');
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

// Delete one old version (the live one can't be deleted)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = requireAdmin(req); if (deny) return deny;
  try {
    const { id } = await params;
    const r = await deleteRelease(id);
    if (r === 'live') return NextResponse.json({ error: 'This version is live. Make another version live first.' }, { status: 400 });
    if (r === 'missing') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
