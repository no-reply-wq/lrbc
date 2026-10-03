import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck, FileText } from "lucide-react";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer-section";
import LegalToc from "@/components/legal/LegalToc";

export interface LegalSection { id: string; title: string | null; html: string }

/** Section titles in the documents are ALL CAPS; show them in readable Title Case (text unchanged). */
function nice(t: string) {
  const x = t.replace(/^\d+\.\s*/, "");
  if (x !== x.toUpperCase()) return x;
  const small = new Set(["and", "or", "of", "the", "to", "a", "in", "about", "your", "you", "this"]);
  return x.toLowerCase().split(" ").map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(" ")
    .replace(/\bCoppa\b/, "COPPA").replace(/\bMis\b/, "MIS");
}

export default function LegalPage({
  kind, title, intro, sections, other,
}: {
  kind: "privacy" | "terms";
  title: string;
  intro: string;
  sections: LegalSection[];
  other: { label: string; href: string };
}) {
  const intros = sections.filter((s) => !s.title);
  const body = sections.filter((s) => s.title);
  const toc = body.map((s) => ({ id: s.id, title: nice(s.title!) }));
  const Icon = kind === "privacy" ? ShieldCheck : FileText;

  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden px-4 pb-8 pt-28 sm:px-6 sm:pb-10 sm:pt-36">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-32 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[#6d3df0]/20 blur-[110px] sm:h-[32rem] sm:w-[32rem]" />
            <div className="absolute right-[-6rem] top-32 h-64 w-64 rounded-full bg-[#ff9ffc]/20 blur-[100px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(109,61,240,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(109,61,240,.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          </div>
          <div className="mx-auto max-w-6xl">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
            <div className="mt-6 flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-lg shadow-primary/30">
                <Icon className="h-6 w-6" />
              </span>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                <span className="bg-gradient-to-r from-[#5227FF] via-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">{title}</span>
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 pb-8 sm:px-6 md:pb-12">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[17rem_1fr] lg:gap-10">
            <div className="min-w-0">
              <LegalToc items={toc} />
            </div>
            <div className="min-w-0 space-y-4">
              {intros.map((s) => (
                <div key={s.id} className="legal-prose rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-fuchsia-500/5 p-5 sm:p-7" dangerouslySetInnerHTML={{ __html: s.html }} />
              ))}
              {body.map((s, i) => (
                <article key={s.id} id={s.id} className="scroll-mt-24 rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
                  <h2 className="flex items-start gap-3 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    <span className="mt-0.5 flex h-7 min-w-7 items-center justify-center rounded-lg bg-primary/10 px-1.5 font-mono text-xs font-semibold text-primary">
                      {s.title!.match(/^(\d+)\./)?.[1]?.padStart(2, "0") ?? (kind === "terms" ? String(i + 1).padStart(2, "0") : "•")}
                    </span>
                    <span>{nice(s.title!)}</span>
                  </h2>
                  <div className="legal-prose mt-4" dangerouslySetInnerHTML={{ __html: s.html }} />
                </article>
              ))}

              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-br from-[#312e81] via-[#5227FF] to-[#a855f7] p-6 text-white shadow-xl shadow-primary/25 sm:flex-row sm:items-center">
                <div>
                  <p className="text-lg font-semibold">Questions about this document?</p>
                  <p className="mt-1 text-sm text-white/80">Write to us and our team will get back to you.</p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <a href="mailto:contact@lrbc.ai" className="lrbc-btn lrbc-btn-light sm:w-auto"><Mail className="h-4 w-4" /> contact@lrbc.ai</a>
                  <Link href={other.href} className="lrbc-btn sm:w-auto border border-white/40 text-white hover:bg-white/10">{other.label}</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
