'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';

const EditorOverlay = dynamic(() => import('./EditorOverlay'), { ssr: false });

type Values = Record<string, string>;
export type Mode = 'live' | 'edit' | 'preview';

type Ctx = {
  values: Values;           // what is shown on screen right now
  editing: boolean;         // dashed outlines + editor panel
  admin: boolean;
  mode: Mode;
  setMode: (m: Mode) => void;
  pending: number;          // number of unpublished changes
  save: (key: string, value: string) => Promise<void>;
  reset: (key: string) => Promise<void>;
  publish: (label: string) => Promise<void>;
  discard: () => Promise<void>;
  syncAfterRelease: () => Promise<void>;
};

const noop = async () => {};
const CmsContext = createContext<Ctx>({
  values: {}, editing: false, admin: false, mode: 'live', setMode: () => {}, pending: 0,
  save: noop, reset: noop, publish: noop, discard: noop, syncAfterRelease: noop,
});
export const useCms = () => useContext(CmsContext);

const MODE_KEY = 'lrbc_mode';

async function jsonOrThrow(res: Response, what: string) {
  if (res.status === 401) throw new Error('Your session expired. Please sign in again.');
  if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || `Could not ${what}. Please try again.`); }
  return res.json().catch(() => ({}));
}

export default function ContentProvider({ initial, children }: { initial: Values; children: ReactNode }) {
  const [live, setLive] = useState<Values>(initial);       // published — what visitors see
  const [draft, setDraft] = useState<Values | null>(null);  // unpublished edits (admin only)
  const [admin, setAdmin] = useState(false);
  const [mode, setModeState] = useState<Mode>('live');

  useEffect(() => { setLive(initial); }, [initial]);

  // Is the person looking at the site the signed-in admin? If so, fetch the draft too.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await (await fetch('/api/auth/me', { cache: 'no-store' })).json();
        if (!alive || !me?.admin) return;
        setAdmin(true);
        const d = await fetch('/api/content?mode=draft', { cache: 'no-store' });
        if (d.ok && alive) setDraft(await d.json());
        try {
          const m = sessionStorage.getItem(MODE_KEY) ?? (sessionStorage.getItem('lrbc_edit_mode') === '1' ? 'edit' : 'live');
          if (alive && (m === 'edit' || m === 'preview')) setModeState(m);
        } catch { /* ignore */ }
      } catch { /* ignore */ }
    })();
    return () => { alive = false; };
  }, []);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    try { sessionStorage.setItem(MODE_KEY, m); sessionStorage.removeItem('lrbc_edit_mode'); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('lrbc-editing', mode === 'edit');
    return () => document.documentElement.classList.remove('lrbc-editing');
  }, [mode]);

  const values = mode !== 'live' && draft ? draft : live;

  const pending = useMemo(() => {
    if (!draft) return 0;
    const keys = new Set([...Object.keys(live), ...Object.keys(draft)]);
    let n = 0;
    keys.forEach((k) => { if (live[k] !== draft[k]) n++; });
    return n;
  }, [live, draft]);

  const save = useCallback(async (key: string, value: string) => {
    await jsonOrThrow(await fetch('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) }), 'save');
    setDraft((d) => ({ ...(d ?? {}), [key]: value }));
  }, []);

  const reset = useCallback(async (key: string) => {
    await jsonOrThrow(await fetch(`/api/content?key=${encodeURIComponent(key)}`, { method: 'DELETE' }), 'reset');
    setDraft((d) => { const n = { ...(d ?? {}) }; delete n[key]; return n; });
  }, []);

  // After publish / going back to an older version the draft equals the live version
  const syncAfterRelease = useCallback(async () => {
    const r = await fetch('/api/content?mode=draft', { cache: 'no-store' });
    if (r.ok) { const d = await r.json(); setDraft(d); setLive(d); }
  }, []);

  const publish = useCallback(async (label: string) => {
    await jsonOrThrow(await fetch('/api/releases', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'publish', label }) }), 'publish');
    setLive(draft ?? {});
  }, [draft]);

  const discard = useCallback(async () => {
    await jsonOrThrow(await fetch('/api/releases', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'discard' }) }), 'discard');
    setDraft({ ...live });
  }, [live]);

  const ctx = useMemo<Ctx>(() => ({
    values, editing: mode === 'edit', admin, mode, setMode, pending, save, reset, publish, discard, syncAfterRelease,
  }), [values, mode, admin, setMode, pending, save, reset, publish, discard, syncAfterRelease]);

  return (
    <CmsContext.Provider value={ctx}>
      {children}
      {admin && <EditorOverlay />}
    </CmsContext.Provider>
  );
}
