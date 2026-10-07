import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getContent } from '@/lib/content';
import { getDraftMap, setDraft, delDraft } from '@/lib/store';

const okKey = (k: unknown): k is string => typeof k === 'string' && /^[\w.:\-\/]{1,160}$/.test(k);

// Public: the LIVE values.  Admin only: ?mode=draft gives the unpublished draft.
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('mode') === 'draft') {
    const deny = requireAdmin(req); if (deny) return deny;
    try { return NextResponse.json(await getDraftMap(), { headers: { 'Cache-Control': 'no-store' } }); }
    catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
  }
  return NextResponse.json(await getContent());
}

// Edits only change the DRAFT. Visitors see nothing until you press Publish.
export async function PUT(req: NextRequest) {
  const deny = requireAdmin(req); if (deny) return deny;
  try {
    const { key, value } = await req.json();
    if (!okKey(key) || typeof value !== 'string' || value.length > 20000) return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    await setDraft(key, value);
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  const deny = requireAdmin(req); if (deny) return deny;
  try {
    const key = req.nextUrl.searchParams.get('key');
    if (!okKey(key)) return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    await delDraft(key);
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
