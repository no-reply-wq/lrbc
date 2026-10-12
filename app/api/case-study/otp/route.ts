import { NextResponse } from "next/server";
import { EMAIL_RE, normEmail, hasSecret, newCode, makeChallenge, limited } from "@/lib/server/case-study-auth";
import { sendMail, mailShell } from "@/lib/server/mail";

export const runtime = "nodejs";

/** Step 1 — e-mail a 6-digit verification code. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normEmail(body.email);
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    if (!hasSecret()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "ip";
    if (limited(`otp:${email}`, 1, 30_000) || limited(`otp-ip:${ip}`, 12, 3600_000))
      return NextResponse.json({ error: "slow_down" }, { status: 429 });

    const code = newCode();
    const challenge = makeChallenge(email, code);
    const html = mailShell(`<h2 style="margin:0 0 12px;font-size:22px">Your verification code</h2>
<p style="line-height:1.6;margin:0 0 16px">Use this code to verify your email and unlock the LRBC case studies:</p>
<p style="margin:0 0 16px;font-size:34px;font-weight:700;letter-spacing:8px;color:#5227ff">${code}</p>
<p style="line-height:1.6;margin:0;color:#6b6b80;font-size:13px">The code is valid for 10 minutes. If you didn't request it, you can ignore this email.</p>`);
    const r = await sendMail({ to: email, subject: `${code} is your LRBC verification code`, html });
    if (!r.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[case-study otp] mail not sent (${r.error}). DEV code for ${email}: ${code}`);
        return NextResponse.json({ challenge, devCode: code });
      }
      console.error("[case-study otp]", r.error);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ challenge });
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
