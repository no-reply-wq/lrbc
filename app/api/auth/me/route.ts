import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET() {
  let admin = false;
  try { admin = await isAdmin(); } catch { admin = false; }
  return NextResponse.json({ admin }, { headers: { 'Cache-Control': 'no-store' } });
}
