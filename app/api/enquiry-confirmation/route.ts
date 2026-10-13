import { NextResponse } from "next/server";
import { sendMail } from "@/lib/server/mail";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

/**
 * Sends a short "we received your request" email to the customer.
 * Uses the shared mailer (Gmail app password or Resend) — see lib/server/mail.ts.
 * Best-effort: always answers 200 so the website form never fails because of email.
 */
export async function POST(req: Request) {
  try {
    const { name, email, company, kind } = await req.json();
    const caseStudy = kind === "case-study";
    if (typeof email !== "string" || !EMAIL_RE.test(email)) return NextResponse.json({ sent: false });
    const first = esc(String(name || "").trim().split(/\s+/)[0] || "there");
    const co = esc(String(company || "").trim());
    const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1b1b2f">
<div style="height:4px;border-radius:4px;background:linear-gradient(90deg,#5227ff,#a855f7,#d946ef);margin-bottom:24px"></div>
<h2 style="margin:0 0 12px;font-size:22px">Thank you, ${first}!</h2>
${caseStudy
  ? `<p style="line-height:1.6;margin:0 0 12px">You now have full access to our case studies${co ? `, starting with <strong>${co}</strong>` : ""}. Head back to the Case Studies page on our website any time to read the complete problem, solution and result.</p>`
  : `<p style="line-height:1.6;margin:0 0 12px">We've received your request${co ? ` for <strong>${co}</strong>` : ""}. Our team will review the details and get back to you shortly to explore the right solution.</p>`}
<p style="line-height:1.6;margin:0 0 20px">If you'd like to add anything in the meantime, just reply to this email.</p>
<p style="margin:0;color:#6b6b80;font-size:13px">— Team LRBC</p></div>`;
    const r = await sendMail({
      to: email,
      subject: caseStudy ? "Your LRBC case study access" : "We've received your request — LRBC",
      html,
    });
    return NextResponse.json({ sent: r.ok });
  } catch {
    return NextResponse.json({ sent: false });
  }
}
