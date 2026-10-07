'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCms } from './ContentProvider';

type Rel = { id: string; label: string; count: number; live: boolean; createdAt: string };

const fmt = (iso: string) => new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

/** Publish box + version history (go back / delete). Used inside the editor and in the admin dashboard. */
export default function ReleasesManager({ onChanged }: { onChanged?: () => void }) {
  const { pending, publish, discard, syncAfterRelease } = useCms();
  const [rels, setRels] = useState<Rel[] | null>(null);
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/releases', { cache: 'no-store' });
      if (r.ok) setRels(await r.json()); else setRels([]);
    } catch { setRels([]); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function run(name: string, fn: () => Promise<void>, ok: string) {
    setBusy(name); setMsg(null);
    try { await fn(); setMsg({ ok: true, text: ok }); await load(); onChanged?.(); }
    catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
    setBusy('');
  }
  const call = async (url: string, method: string, body?: unknown) => {
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.error || 'Something went wrong.'); }
  };

  const live = rels?.find((r) => r.live);

  return (
    <div className="text-sm">
      {/* publish */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
        <p className="font-semibold">{pending > 0 ? `${pending} unpublished change${pending === 1 ? '' : 's'}` : 'No unpublished changes'}</p>
        <p className="mt-0.5 text-xs text-neutral-500">Visitors see none of your edits until you press <b>Publish to live website</b>.</p>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Name this version (optional), e.g. “New hero text”" className="lrbc-cms-input mt-2" maxLength={80} />
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" disabled={!!busy || pending === 0} onClick={() => run('pub', async () => { await publish(label); setLabel(''); }, 'Published — your website is updated.')} className="lrbc-cms-btn on">
            {busy === 'pub' ? 'Publishing…' : 'Publish to live website'}
          </button>
          <button type="button" disabled={!!busy || pending === 0} onClick={() => { if (confirm('Throw away all unpublished edits and go back to the live version?')) run('disc', discard, 'Unpublished edits removed.'); }} className="lrbc-cms-btn ghost dark">
            Discard changes
          </button>
        </div>
      </div>

      {msg && <p role="status" className={`mt-2 text-xs ${msg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg.text}</p>}

      {/* history */}
      <div className="mt-4 flex items-center justify-between">
        <p className="font-semibold">Published versions</p>
        {rels && rels.filter((r) => !r.live).length > 0 && (
          <button type="button" disabled={!!busy} onClick={() => { if (confirm('Delete ALL old versions? The live version stays. This cannot be undone.')) run('delall', () => call('/api/releases', 'DELETE'), 'Old versions deleted.'); }} className="text-xs text-red-600 underline">
            Delete all old versions
          </button>
        )}
      </div>
      <p className="text-xs text-neutral-500">{live ? `Live now: “${live.label || 'Update'}” · ${fmt(live.createdAt)}` : 'Nothing published yet — the website is showing its original content.'}</p>
      <ul className="mt-2 max-h-64 space-y-2 overflow-auto">
        {rels === null && <li className="text-xs text-neutral-500">Loading…</li>}
        {rels?.length === 0 && <li className="text-xs text-neutral-500">No versions yet.</li>}
        {rels?.map((r) => (
          <li key={r.id} className={`rounded-lg border p-2.5 ${r.live ? 'border-emerald-300 bg-emerald-50' : 'border-neutral-200'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{r.label || 'Update'} {r.live && <span className="ml-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">LIVE</span>}</p>
                <p className="text-[11px] text-neutral-500">{fmt(r.createdAt)} · {r.count} edited item{r.count === 1 ? '' : 's'}</p>
              </div>
              {!r.live && (
                <div className="flex shrink-0 gap-1">
                  <button type="button" disabled={!!busy} onClick={() => { if (confirm(`Make “${r.label || 'Update'}” the live website again?\nYour current draft will be replaced by this version.`)) run('rest' + r.id, async () => { await call(`/api/releases/${r.id}`, 'POST'); await syncAfterRelease(); }, 'That version is live again.'); }} className="lrbc-cms-btn on small">Make live</button>
                  <button type="button" disabled={!!busy} onClick={() => { if (confirm('Delete this old version? This cannot be undone.')) run('del' + r.id, () => call(`/api/releases/${r.id}`, 'DELETE'), 'Version deleted.'); }} className="lrbc-cms-btn ghost dark small">Delete</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
