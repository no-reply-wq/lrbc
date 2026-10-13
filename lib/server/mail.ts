import nodemailer from "nodemailer";

/**
 * Sends mail. Two options (the first one that is configured wins):
 *   1) Gmail   → GMAIL_USER + GMAIL_APP_PASSWORD   (no domain / DNS needed)
 *   2) Resend  → RESEND_API_KEY (+ MAIL_FROM on a verified domain)
 * Sender / reply-to address: contact@lrbc.ai (override with MAIL_FROM_EMAIL). Optional: MAIL_FROM_NAME (default "LRBC"), MAIL_REPLY_TO.
 */
export type Attachment = { filename: string; content: string /* base64 */ };

export const mailConfigured = () =>
  !!((process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) || process.env.RESEND_API_KEY);

export async function sendMail(opts: { to: string; subject: string; html: string; attachments?: Attachment[] }) {
  const SITE_EMAIL = process.env.MAIL_FROM_EMAIL || "contact@lrbc.ai";
  const replyTo = process.env.MAIL_REPLY_TO || SITE_EMAIL;
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");

  if (user && pass) {
    try {
      const transport = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass } });
      await transport.sendMail({
        from: `"${process.env.MAIL_FROM_NAME || "LRBC"}" <${SITE_EMAIL}>`, // Gmail needs contact@lrbc.ai to be the login or a verified "Send mail as" alias
        envelope: { from: user, to: opts.to },
        to: opts.to,
        replyTo,
        subject: opts.subject,
        html: opts.html,
        attachments: opts.attachments?.map((a) => ({ filename: a.filename, content: a.content, encoding: "base64" })),
      });
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: `Gmail SMTP: ${String((e as Error)?.message || e).slice(0, 200)}` };
    }
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false as const, error: "No mail settings: set GMAIL_USER + GMAIL_APP_PASSWORD (or RESEND_API_KEY)" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || `LRBC <${SITE_EMAIL}>`,
        to: [opts.to],
        reply_to: replyTo,
        subject: opts.subject,
        html: opts.html,
        attachments: opts.attachments,
      }),
    });
    if (!r.ok) return { ok: false as const, error: `Resend ${r.status}: ${(await r.text()).slice(0, 200)}` };
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: String(e) };
  }
}

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export const mailShell = (inner: string) => `<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1b1b2f">
<div style="height:4px;border-radius:4px;background:linear-gradient(90deg,#5227ff,#a855f7,#d946ef);margin-bottom:24px"></div>
${inner}
<p style="margin:24px 0 0;color:#6b6b80;font-size:13px">— Team LRBC</p></div>`;
