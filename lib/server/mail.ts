/** Sends mail through Resend (env RESEND_API_KEY, MAIL_FROM, optional MAIL_REPLY_TO). */
export type Attachment = { filename: string; content: string /* base64 */ };

export async function sendMail(opts: { to: string; subject: string; html: string; attachments?: Attachment[] }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY is not set" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || "LRBC <onboarding@resend.dev>",
        to: [opts.to],
        reply_to: process.env.MAIL_REPLY_TO || "no-reply@lalitraj.com",
        subject: opts.subject,
        html: opts.html,
        attachments: opts.attachments,
      }),
    });
    if (!r.ok) return { ok: false, error: `Resend ${r.status}: ${(await r.text()).slice(0, 200)}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export const mailShell = (inner: string) => `<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1b1b2f">
<div style="height:4px;border-radius:4px;background:linear-gradient(90deg,#5227ff,#a855f7,#d946ef);margin-bottom:24px"></div>
${inner}
<p style="margin:24px 0 0;color:#6b6b80;font-size:13px">— Team LRBC</p></div>`;
