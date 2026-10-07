import { NextRequest, NextResponse } from 'next/server';
import { checkCredentials, setAuthCookie } from '@/lib/auth';

// simple in-memory throttle (per server instance) — 6 failures / 10 min / IP
const fails = new Map<string, { n: number; t: number }>();
const WINDOW = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const f = fails.get(ip);
  if (f && Date.now() - f.t < WINDOW && f.n >= 6) {
    return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 });
  }
  try {
    const { email = '', password = '' } = await req.json();
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET) {
      return NextResponse.json({ error: 'Admin login is not configured on the server (set ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET).' }, { status: 500 });
    }
    if (!checkCredentials(String(email), String(password))) {
      const cur = f && Date.now() - f.t < WINDOW ? f : { n: 0, t: Date.now() };
      fails.set(ip, { n: cur.n + 1, t: cur.t });
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
    }
    fails.delete(ip);
    const res = NextResponse.json({ ok: true });
    setAuthCookie(res);
    return res;
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
