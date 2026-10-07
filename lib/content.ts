import { unstable_cache } from 'next/cache';
import { getLiveMap, type ContentMap } from '@/lib/store';

export type { ContentMap };

const load = unstable_cache(getLiveMap, ['lrbc-live-content'], { tags: ['content'], revalidate: 300 });

/** The LIVE (published) values. Never throws: if the database is unreachable the site shows its built-in text. */
export async function getContent(): Promise<ContentMap> {
  try { return await load(); } catch { return {}; }
}
