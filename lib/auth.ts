import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const COOKIE = 'lrbc_admin';
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret(): string {
  const s = process.env.AUTH_SECRET ?? '';
  if (s.length < 16) throw new Error('AUTH_SECRET is not set (use at least 16 characters).');
  return s;
}
const sign = (v: string) => crypto.createHmac('sha256', secret()).update(v).digest('base64url');

function safeEq(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkCredentials(email: string, password: string): boolean {
  const E = process.env.ADMIN_EMAIL ?? '';
  const P = process.env.ADMIN_PASSWORD ?? '';
  if (!E || !P) return false;
  const okE = safeEq(email.trim().toLowerCase(), E.trim().toLowerCase());
  const okP = safeEq(password, P);
  return okE && okP;
}

export function makeToken(): string {
  const exp = Date.now() + MAX_AGE * 1000;
  const body = `admin.${exp}`;
  return `${body}.${sign(body)}`;
}

export function verifyToken(token?: string | null): boolean {
  try {
    if (!token) return false;
    const i = token.lastIndexOf('.');
    if (i < 0) return false;
    const body = token.slice(0, i);
    const sig = token.slice(i + 1);
    if (!safeEq(sig, sign(body))) return false;
    const exp = Number(body.split('.')[1]);
    return Number.isFinite(exp) && exp > Date.now();
  } catch { return false; }
}

export function setAuthCookie(res: NextResponse) {
  res.cookies.set(COOKIE, makeToken(), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: MAX_AGE,
  });
}
export function clearAuthCookie(res: NextResponse) {
  res.cookies.set(COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value);
}

/** Use at the top of every write route: `const deny = requireAdmin(req); if (deny) return deny;` */
export function requireAdmin(req: NextRequest): NextResponse | null {
  if (verifyToken(req.cookies.get(COOKIE)?.value)) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
