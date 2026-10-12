import { NextResponse } from "next/server";
import { normEmail, checkChallenge, makeToken, limited, hasSecret } from "@/lib/server/case-study-auth";

export const runtime = "nodejs";

/** Step 2 — check the code; on success return a 30-day access token bound to the email. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normEmail(body.email);
    const code = String(body.code || "").replace(/\D/g, "");
    const challenge = String(body.challenge || "");
    if (!hasSecret() || code.length !== 6) return NextResponse.json({ error: "invalid" }, { status: 400 });
    if (limited(`verify:${challenge.slice(0, 60)}`, 5, 10 * 60_000))
      return NextResponse.json({ error: "too_many" }, { status: 429 });
    const res = checkChallenge(challenge, email, code);
    if (res === "expired") return NextResponse.json({ error: "expired" }, { status: 400 });
    if (res !== "ok") return NextResponse.json({ error: "wrong_code" }, { status: 400 });
    return NextResponse.json({ token: makeToken(email), email });
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
