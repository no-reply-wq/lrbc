'use client';

import Link from 'next/link';
import { createElement, type ComponentProps, type ReactNode } from 'react';
import { useCms } from './ContentProvider';

/** Editable text. Shows `def` (the original wording) until you change it in the editor. */
export function T({ id, def }: { id: string; def: string }) {
  const { values, editing } = useCms();
  const v = id in values ? values[id] : def;
  if (!editing) return <>{v}</>;
  return <span data-cms="text" data-id={id} data-def={def} className="lrbc-cms-t">{v}</span>;
}

/** Editable photo (plain <img>). */
export function Img({ id, def, alt = '', ...rest }: { id: string; def: string; alt?: string } & Omit<ComponentProps<'img'>, 'src' | 'alt' | 'id'>) {
  const { values, editing } = useCms();
  const src = id in values && values[id] ? values[id] : def;
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...rest} src={src} alt={alt} {...(editing ? { 'data-cms': 'img', 'data-id': id, 'data-def': def } : {})} />;
}

/**
 * Editable text that keeps its own element (so layout and animations never change).
 * Use this for headings, paragraphs, labels. `as` picks the tag (default span).
 */
export function Et({ id, def, as = 'span', reload, className, ...rest }: { id: string; def: string; as?: string; reload?: boolean; className?: string } & Record<string, unknown>) {
  const { values, editing } = useCms();
  const v = id in values ? values[id] : def;
  const attrs = editing ? { 'data-cms': 'text', 'data-id': id, 'data-def': def, ...(reload ? { 'data-reload': '1' } : {}) } : {};
  return createElement(as, { className, ...rest, ...attrs }, v);
}

/** Editable link: the address it goes to and (optionally) its label. */
export function Lnk({ id, href, labelId, label, children, ...rest }: { id: string; href: string; labelId?: string; label?: string; children?: ReactNode } & Omit<ComponentProps<typeof Link>, 'href' | 'id' | 'children'>) {
  const { values, editing } = useCms();
  const h = id in values && values[id] ? values[id] : href;
  const text = labelId ? (labelId in values ? values[labelId] : label ?? '') : null;
  const attrs = editing
    ? ({ 'data-cms': 'link', 'data-id': id, 'data-def': href, ...(labelId ? { 'data-label-id': labelId, 'data-label-def': label ?? '' } : {}) } as object)
    : {};
  return (
    <Link {...rest} href={h} {...attrs}>
      {text !== null ? <>{text}{children}</> : children}
    </Link>
  );
}

/** Wrap any section / card / item so it can be hidden or shown again from the editor. */
export function Hide({ id, children }: { id: string; children: ReactNode }) {
  const { values, editing, save, reset } = useCms();
  const key = `hide:${id}`;
  const hidden = values[key] === '1';
  if (!editing) return hidden ? null : <>{children}</>;
  return (
    <div className={`lrbc-cms-sec${hidden ? ' is-hidden' : ''}`} data-cms-sec={id}>
      <button
        type="button"
        className="lrbc-cms-hide"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); (hidden ? reset(key) : save(key, '1')).catch((er) => alert(er.message)); }}
      >
        {hidden ? 'Hidden — click to show' : 'Hide this'}
      </button>
      {children}
    </div>
  );
}

/** Read an editable value in code (e.g. for a button label or an href). */
export function useVal(id: string, def: string): string {
  const { values } = useCms();
  return id in values ? values[id] : def;
}

/**
 * For components that cannot use <T>/<Et>/<Img> (e.g. next/image, or a text prop):
 *   const src = useVal("page.hero.photo", defaultSrc);
 *   <Image src={src} {...useAttrs("img", "page.hero.photo", defaultSrc)} />
 * `kind` is "text" | "img" | "link".
 */
export function useAttrs(kind: 'text' | 'img' | 'link', id: string, def: string): Record<string, string> {
  const { editing } = useCms();
  return editing ? { 'data-cms': kind, 'data-id': id, 'data-def': def } : {};
}
