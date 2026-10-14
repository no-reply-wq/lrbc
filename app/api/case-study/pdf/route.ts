import { NextResponse } from "next/server";
import { readToken, limited } from "@/lib/server/case-study-auth";
import { sendMail, mailShell, esc } from "@/lib/server/mail";
import { CASE_STUDIES } from "@/lib/case-studies";
import { buildCaseStudyPdf } from "@/lib/server/case-study-pdf";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Returns the full case study (text + images) as a PDF download AND e-mails a copy to the verified address inside the token. */
export async function POST(req: Request) {
  try {
    const { token, id } = await req.json();
    const email = readToken(token);
    if (!email) return NextResponse.json({ error: "unverified" }, { status: 401 });
    const cs = CASE_STUDIES.find((c) => c.id === id);
    if (!cs) return NextResponse.json({ error: "not_found" }, { status: 404 });
    if (limited(`pdf:${email}`, 10, 3600_000)) return NextResponse.json({ error: "slow_down" }, { status: 429 });

    const bytes = await buildCaseStudyPdf(cs, new URL(req.url).origin);
    const filename = `LRBC-${cs.client.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "")}.pdf`;
    const html = mailShell(`<h2 style="margin:0 0 12px;font-size:22px">Your case study is attached</h2>
<p style="line-height:1.6;margin:0 0 12px">Here is the full case study for <strong>${esc(cs.client)}</strong> — problem, solution, result and real screenshots — as a PDF.</p>
<p style="line-height:1.6;margin:0">Want something like this for your business? Just reply to this email and we'll set up a quick call.</p>`);
    // E-mail a copy (best effort) and ALSO hand the PDF back so the browser downloads it right away.
    const mail = sendMail({
      to: email,
      subject: `Your LRBC case study — ${cs.client}`,
      html,
      attachments: [{ filename, content: Buffer.from(bytes).toString("base64") }],
    });
    // never keep the visitor waiting on the mail server: after 10 s the download goes ahead anyway
    const r = await Promise.race([mail, new Promise<"slow">((res) => setTimeout(() => res("slow"), 10_000))]);
    if (r !== "slow" && !r.ok) console.error("[case-study pdf]", r.error);
    const mailState = r === "slow" ? "pending" : r.ok ? "1" : "0";
    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Mail-Sent": mailState,
        "X-Filename": filename,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[case-study pdf]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
