'use client';

import { useCms } from './ContentProvider';
import ReleasesManager from './ReleasesManager';
import { Pencil, Eye } from 'lucide-react';

const PAGES: { name: string; href: string; note: string }[] = [
  { name: 'Home', href: '/', note: 'Menu, hero, products, testimonials, FAQ, team, footer' },
  { name: 'Mini ERP', href: '/mini-erp', note: 'Every heading, card, FAQ and button' },
  { name: 'Custom ERP', href: '/custom-erp', note: 'Every heading, card, FAQ and button' },
  { name: 'About', href: '/about', note: 'All text, buttons, links and photos' },
  { name: 'Contact', href: '/contact', note: 'All text, buttons, links and photos' },
  { name: 'Why LRBC', href: '/why-lrbc', note: 'All text, buttons, links and photos' },
  { name: 'WorkPilot', href: '/workpilot', note: 'All text, buttons, links and photos' },
  { name: 'LekhaSetu', href: '/lekhasetu', note: 'All text, buttons, links and photos' },
  { name: 'Case Studies', href: '/testimonials-case-studies', note: 'All text, buttons, links and photos' },
];

function go(href: string, mode: 'edit' | 'preview') {
  try { sessionStorage.setItem('lrbc_mode', mode); } catch { /* ignore */ }
  window.location.href = href;
}

export default function WebsitePanel() {
  const { pending } = useCms();
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_1fr]">
      <section>
        <h2 className="text-xl font-semibold">Edit your website</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Open a page and click any text, photo or link to change it. Everything you change stays in a <b>draft</b>:
          visitors keep seeing the current live website until you press <b>Publish</b>.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PAGES.map((p) => (
            <div key={p.href} className="rounded-2xl border border-border bg-card p-4">
              <p className="font-medium">{p.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{p.note}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => go(p.href, 'edit')} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button type="button" onClick={() => go(p.href, 'preview')} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium">
                  <Eye className="h-3.5 w-3.5" /> Preview draft
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-4 text-neutral-900 shadow-sm">
        <h2 className="text-base font-semibold">Publish &amp; version history</h2>
        <p className="mb-3 text-xs text-neutral-500">{pending ? 'You have edits waiting to go live.' : 'Your draft matches the live website.'}</p>
        <ReleasesManager />
      </section>
    </div>
  );
}
