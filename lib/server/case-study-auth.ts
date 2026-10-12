import crypto from "crypto";

/** Stateless e-mail OTP + access tokens (works on serverless — nothing is stored on the server). */
const secret = () => process.env.OTP_SECRET || process.env.AUTH_SECRET || process.env.RESEND_API_KEY || (process.env.NODE_ENV !== "production" ? "dev-only-secret" : "");
const b64u = (b: Buffer | string) => Buffer.from(b).toString("base64url");
const mac = (s: string) => crypto.createHmac("sha256", secret()).update(s).digest("base64url");
const same = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const normEmail = (e: unknown) => String(e || "").trim().toLowerCase();
export const hasSecret = () => secret().length > 0;

export const OTP_TTL = 10 * 60_000;
export const TOKEN_TTL = 30 * 24 * 3600_000;

export function newCode() {
  return String(crypto.randomInt(100000, 1000000));
}

/** Challenge = "<payload>.<signature>" — the code itself is never inside it. */
export function makeChallenge(email: string, code: string) {
  const payload = b64u(JSON.stringify({ e: email, x: Date.now() + OTP_TTL }));
  return `${payload}.${mac(`otp|${payload}|${code}`)}`;
}

export function checkChallenge(challenge: string, email: string, code: string): "ok" | "expired" | "bad" {
  const [payload, sig] = String(challenge || "").split(".");
  if (!payload || !sig) return "bad";
  let d: { e?: string; x?: number };
  try { d = JSON.parse(Buffer.from(payload, "base64url").toString()); } catch { return "bad"; }
  if (d.e !== email) return "bad";
  if (!d.x || Date.now() > d.x) return "expired";
  return same(sig, mac(`otp|${payload}|${code}`)) ? "ok" : "bad";
}

export function makeToken(email: string) {
  const payload = b64u(JSON.stringify({ e: email, x: Date.now() + TOKEN_TTL }));
  return `${payload}.${mac(`tok|${payload}`)}`;
}

export function readToken(token: unknown): string | null {
  const [payload, sig] = String(token || "").split(".");
  if (!payload || !sig || !same(sig, mac(`tok|${payload}`))) return null;
  try {
    const d = JSON.parse(Buffer.from(payload, "base64url").toString());
    return d.x && Date.now() < d.x && typeof d.e === "string" ? d.e : null;
  } catch { return null; }
}

/** Small in-memory limiter (per server instance — a speed bump, not a guarantee). */
const hits = new Map<string, number[]>();
export function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (list.length >= max) { hits.set(key, list); return true; }
  list.push(now); hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return false;
}
