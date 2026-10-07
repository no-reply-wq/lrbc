'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useCms } from './ContentProvider';
import ReleasesManager from './ReleasesManager';
import { compressImage } from '@/lib/imageCompress';

type Target = { kind: 'text' | 'img' | 'link'; id: string; def: string; labelId?: string; labelDef?: string; reload?: boolean };
type Row = { key: string; type: 'sec' | 'text' | 'img' | 'link'; title: string; sub: string; el: HTMLElement; hidden?: boolean };

const short = (s: string, n = 70) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

function readRows(): Row[] {
  const out: Row[] = [];
  const seen = new Set<string>();
  document.querySelectorAll<HTMLElement>('[data-cms],[data-cms-sec]').forEach((el) => {
    if (el.closest('[data-cms-panel]')) return;
    if (el.dataset.cmsSec) {
      const id = el.dataset.cmsSec;
      if (seen.has('s' + id)) return; seen.add('s' + id);
      out.push({ key: 's' + id, type: 'sec', title: id.split('.').slice(-2).join(' › '), sub: el.classList.contains('is-hidden') ? 'hidden on the website' : 'section / card — can be hidden', el, hidden: el.classList.contains('is-hidden') });
      return;
    }
    const kind = el.dataset.cms as 'text' | 'img' | 'link';
    const id = el.dataset.id ?? '';
    if (seen.has(id)) return; seen.add(id);
    if (kind === 'img') out.push({ key: id, type: 'img', title: 'Photo', sub: id, el });
    else if (kind === 'link') out.push({ key: id, type: 'link', title: short(el.textContent?.trim() || 'Link', 50), sub: '→ ' + (el.getAttribute('href') ?? ''), el });
    else out.push({ key: id, type: 'text', title: short(el.textContent?.trim() || '(empty)'), sub: id, el });
  });
  return out;
}

export default function EditorOverlay() {
  const { mode, setMode, pending, values, save, reset } = useCms();
  const editing = mode === 'edit';
  const [t, setT] = useState<Target | null>(null);
  const [val, setVal] = useState('');
  const [lab, setLab] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [panel, setPanel] = useState<'none' | 'outline' | 'publish'>('none');
  const [rows, setRows] = useState<Row[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const openTarget = useCallback((hit: HTMLElement) => {
    const kind = hit.dataset.cms as Target['kind'];
    const id = hit.dataset.id ?? '';
    const def = hit.dataset.def ?? '';
    const labelId = hit.dataset.labelId; const labelDef = hit.dataset.labelDef ?? '';
    setT({ kind, id, def, labelId, labelDef, reload: hit.dataset.reload === '1' });
    setVal(id in values ? values[id] : def);
    setLab(labelId ? (labelId in values ? values[labelId] : labelDef) : '');
    setMsg(null);
  }, [values]);

  // click anything dashed on the page to edit it
  useEffect(() => {
    if (!editing) { setT(null); setPanel((p) => (p === 'outline' ? 'none' : p)); return; }
    const onClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el || el.closest('[data-cms-panel]') || el.closest('.lrbc-cms-hide')) return;
      const hit = el.closest('[data-cms]') as HTMLElement | null;
      if (!hit) return;
      e.preventDefault(); e.stopPropagation();
      openTarget(hit);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [editing, openTarget]);

  // the outline lists everything editable on this page, top to bottom, exactly as the page is laid out
  useEffect(() => {
    if (panel !== 'outline' || !editing) return;
    const upd = () => setRows(readRows());
    upd();
    const iv = setInterval(upd, 1200);
    return () => clearInterval(iv);
  }, [panel, editing, values]);

  function jump(r: Row) {
    r.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    r.el.classList.add('lrbc-cms-flash');
    setTimeout(() => r.el.classList.remove('lrbc-cms-flash'), 1400);
    if (r.type !== 'sec') setTimeout(() => openTarget(r.el), 350);
  }

  async function doSave(v = val) {
    if (!t) return;
    setBusy(true); setMsg(null);
    try {
      await save(t.id, v);
      if (t.labelId) await save(t.labelId, lab);
      setMsg({ ok: true, text: t.reload ? 'Saved to draft — refreshing…' : 'Saved to draft. Not live until you Publish.' });
      if (t.reload) setTimeout(() => window.location.reload(), 500);
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
    setBusy(false);
  }
  async function doReset() {
    if (!t) return;
    setBusy(true); setMsg(null);
    try {
      await reset(t.id); if (t.labelId) { await reset(t.labelId); setLab(t.labelDef ?? ''); }
      setVal(t.def); setMsg({ ok: true, text: t.reload ? 'Back to the original — refreshing…' : 'Back to the original (in draft).' });
      if (t.reload) setTimeout(() => window.location.reload(), 500);
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
    setBusy(false);
  }
  async function onFile(f: File | undefined) {
    if (!f || !t) return;
    setBusy(true); setMsg(null);
    try {
      const small = await compressImage(f);
      const form = new FormData(); form.append('file', small);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (res.status === 401) throw new Error('Your session expired. Please sign in again.');
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Upload failed.');
      const { url } = await res.json();
      setVal(url);
      await save(t.id, url);
      setMsg({ ok: true, text: 'Photo uploaded to draft. Not live until you Publish.' });
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  }
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    try { sessionStorage.removeItem('lrbc_mode'); } catch { /* ignore */ }
    window.location.reload();
  }

  const label = t?.kind === 'img' ? 'Photo' : t?.kind === 'link' ? 'Link' : 'Text';

  return (
    <>
      {mode === 'preview' && (
        <div data-cms-panel className="lrbc-cms-banner">
          Previewing your unpublished draft — visitors cannot see this yet.
          <button type="button" className="lrbc-cms-btn on small" onClick={() => setMode('edit')}>Back to editing</button>
          <button type="button" className="lrbc-cms-btn ghost small" onClick={() => setPanel('publish')}>Publish…</button>
          <button type="button" className="lrbc-cms-btn ghost small" onClick={() => setMode('live')}>Exit preview</button>
        </div>
      )}

      <div data-cms-panel role="toolbar" aria-label="Website editor" className="lrbc-cms-bar">
        <button type="button" onClick={() => setMode(editing ? 'live' : 'edit')} className={`lrbc-cms-btn ${editing ? 'on' : ''}`}>
          {editing ? '● Editing — click to stop' : '✎ Edit this page'}
        </button>
        {editing && <button type="button" onClick={() => setPanel(panel === 'outline' ? 'none' : 'outline')} className={`lrbc-cms-btn ${panel === 'outline' ? 'on' : 'ghost'}`}>☰ Page outline</button>}
        <button type="button" onClick={() => setMode(mode === 'preview' ? 'live' : 'preview')} className={`lrbc-cms-btn ${mode === 'preview' ? 'on' : 'ghost'}`}>👁 Preview</button>
        <button type="button" onClick={() => setPanel(panel === 'publish' ? 'none' : 'publish')} className={`lrbc-cms-btn ${pending ? 'warn' : 'ghost'}`}>
          {pending ? `Publish (${pending})` : 'Publish & history'}
        </button>
        <a href="/12245-admin" className="lrbc-cms-btn ghost">Dashboard</a>
        <button type="button" onClick={logout} className="lrbc-cms-btn ghost">Log out</button>
      </div>

      {editing && !t && panel === 'none' && (
        <p data-cms-panel className="lrbc-cms-hint">Click any dashed text, photo or link to change it. Changes stay in your draft until you Publish.</p>
      )}

      {panel === 'outline' && editing && (
        <div data-cms-panel role="dialog" aria-label="Page outline" className="lrbc-cms-panel lrbc-cms-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Page outline</p>
              <p className="text-xs text-neutral-500">Everything on this page, top to bottom (menu first). Click to jump to it and edit.</p>
            </div>
            <button type="button" onClick={() => setPanel('none')} aria-label="Close" className="text-xl leading-none text-neutral-500 hover:text-neutral-900">×</button>
          </div>
          <ul className="mt-3 space-y-1">
            {rows.map((r) => (
              <li key={r.key}>
                <button type="button" onClick={() => jump(r)} className={`w-full rounded-lg px-2.5 py-1.5 text-left hover:bg-indigo-50 ${r.type === 'sec' ? 'bg-neutral-100 font-semibold' : ''}`}>
                  <span className="block text-[12.5px] leading-snug">
                    {r.type === 'sec' ? '▣ ' : r.type === 'img' ? '🖼 ' : r.type === 'link' ? '🔗 ' : ''}{r.title}{r.hidden ? ' (hidden)' : ''}
                  </span>
                  <span className="block truncate font-mono text-[10px] text-neutral-400">{r.sub}</span>
                </button>
              </li>
            ))}
            {rows.length === 0 && <li className="text-xs text-neutral-500">Nothing editable found on this page yet.</li>}
          </ul>
        </div>
      )}

      {panel === 'publish' && (
        <div data-cms-panel role="dialog" aria-label="Publish and history" className="lrbc-cms-panel lrbc-cms-wide">
          <div className="mb-3 flex items-start justify-between gap-3">
            <p className="text-base font-semibold">Publish &amp; version history</p>
            <button type="button" onClick={() => setPanel('none')} aria-label="Close" className="text-xl leading-none text-neutral-500 hover:text-neutral-900">×</button>
          </div>
          <ReleasesManager />
        </div>
      )}

      {editing && t && panel !== 'publish' && (
        <div data-cms-panel role="dialog" aria-label={`Edit ${label}`} className="lrbc-cms-panel">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Edit {label.toLowerCase()}</p>
              <p className="mt-0.5 break-all font-mono text-[10px] text-neutral-500">{t.id}</p>
            </div>
            <button type="button" onClick={() => setT(null)} aria-label="Close" className="text-xl leading-none text-neutral-500 hover:text-neutral-900">×</button>
          </div>

          {t.kind === 'text' && (
            <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={6} className="lrbc-cms-input mt-3" />
          )}
          {t.kind === 'link' && (
            <div className="mt-3 space-y-2">
              {t.labelId && (<><label className="text-xs font-medium text-neutral-600">Words shown</label><input value={lab} onChange={(e) => setLab(e.target.value)} className="lrbc-cms-input" /></>)}
              <label className="text-xs font-medium text-neutral-600">Goes to (page or web address)</label>
              <input value={val} onChange={(e) => setVal(e.target.value)} className="lrbc-cms-input" placeholder="/contact or https://…" />
            </div>
          )}
          {t.kind === 'img' && (
            <div className="mt-3 space-y-3">
              {val && <img src={val} alt="" className="max-h-40 w-full rounded-lg border object-contain" />}
              <input ref={fileRef} type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="block w-full text-xs" />
              <input value={val} onChange={(e) => setVal(e.target.value)} className="lrbc-cms-input" placeholder="…or paste an image address (URL)" />
            </div>
          )}

          {msg && <p role="status" className={`mt-3 text-xs ${msg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg.text}</p>}

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => doSave()} className="lrbc-cms-btn on">{busy ? 'Please wait…' : 'Save to draft'}</button>
            <button type="button" disabled={busy} onClick={doReset} className="lrbc-cms-btn ghost dark">Back to original</button>
          </div>
        </div>
      )}
    </>
  );
}
