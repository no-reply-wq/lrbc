import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { listReleases, publish, discardDraft, deleteAllOld } from '@/lib/store';

export const dynamic = 'force-dynamic';

// List of published versions (newest first)
export async function GET(req: NextRequest) {
  const deny = requireAdmin(req); if (deny) return deny;
  try { return NextResponse.json(await listReleases()); }
  catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

// { action: 'publish', label }  → draft becomes the live website
// { action: 'discard' }          → drop unpublished edits
export async function POST(req: NextRequest) {
  const deny = requireAdmin(req); if (deny) return deny;
  try {
    const body = await req.json().catch(() => ({}));
    if (body.action === 'publish') {
      const r = await publish(String(body.label ?? '').slice(0, 80));
      revalidateTag('content');
      return NextResponse.json(r, { status: 201 });
    }
    if (body.action === 'discard') { await discardDraft(); return NextResponse.json({ ok: true }); }
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

// Delete every old (not live) version
export async function DELETE(req: NextRequest) {
  const deny = requireAdmin(req); if (deny) return deny;
  try { await deleteAllOld(); return NextResponse.json({ ok: true }); }
  catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
