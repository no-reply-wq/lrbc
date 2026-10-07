// All reading/writing of website content lives here.
//   draft   = what you are editing (ContentItem rows) — NEVER shown to visitors
//   release = a published snapshot; the one marked `live` is what visitors see
import { connectDB } from '@/lib/mongodb';
import ContentItem from '@/lib/models/ContentItem';
import Release from '@/lib/models/Release';

export type ContentMap = Record<string, string>;
export type ReleaseInfo = { id: string; label: string; count: number; live: boolean; createdAt: string };

export async function getLiveMap(): Promise<ContentMap> {
  await connectDB();
  const r = await Release.findOne({ live: true }).lean<{ data?: ContentMap } | null>();
  return { ...(r?.data ?? {}) };
}

export async function getDraftMap(): Promise<ContentMap> {
  await connectDB();
  const docs = await ContentItem.find().lean<{ key: string; value: string }[]>();
  const out: ContentMap = {};
  for (const d of docs) out[d.key] = d.value;
  return out;
}

export async function setDraft(key: string, value: string) {
  await connectDB();
  await ContentItem.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true });
}
export async function delDraft(key: string) {
  await connectDB();
  await ContentItem.deleteOne({ key });
}

async function replaceDraft(data: ContentMap) {
  await ContentItem.deleteMany({});
  const rows = Object.entries(data).map(([key, value]) => ({ key, value }));
  if (rows.length) await ContentItem.insertMany(rows);
}

/** Publish: snapshot the draft and make it the live version. */
export async function publish(label: string): Promise<ReleaseInfo> {
  await connectDB();
  const data = await getDraftMap();
  await Release.updateMany({ live: true }, { live: false });
  const r = await Release.create({ label: label || 'Update', data, live: true, count: Object.keys(data).length });
  return toInfo(r);
}

/** Go back to an earlier version: it becomes live again and the draft is reset to it. */
export async function makeLive(id: string): Promise<boolean> {
  await connectDB();
  const r = await Release.findById(id).lean<{ data?: ContentMap } | null>();
  if (!r) return false;
  await Release.updateMany({ live: true }, { live: false });
  await Release.findByIdAndUpdate(id, { live: true });
  await replaceDraft(r.data ?? {});
  return true;
}

/** Throw away unpublished edits: the draft goes back to what is live. */
export async function discardDraft() {
  await connectDB();
  await replaceDraft(await getLiveMap());
}

export async function listReleases(): Promise<ReleaseInfo[]> {
  await connectDB();
  const rows = await Release.find().sort({ createdAt: -1 }).lean<unknown[]>();
  return rows.map(toInfo);
}

export async function deleteRelease(id: string): Promise<'ok' | 'live' | 'missing'> {
  await connectDB();
  const r = await Release.findById(id).lean<{ live?: boolean } | null>();
  if (!r) return 'missing';
  if (r.live) return 'live';
  await Release.deleteOne({ _id: id });
  return 'ok';
}

export async function deleteAllOld() {
  await connectDB();
  await Release.deleteMany({ live: false });
}

function toInfo(r: unknown): ReleaseInfo {
  const x = r as { _id: unknown; label?: string; count?: number; live?: boolean; createdAt?: Date | string };
  return { id: String(x._id), label: x.label ?? '', count: x.count ?? 0, live: !!x.live, createdAt: new Date(x.createdAt ?? Date.now()).toISOString() };
}
