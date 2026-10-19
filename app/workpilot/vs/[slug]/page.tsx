import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPETITORS, REVIEWED, bySlug, type Mark } from "@/lib/workpilot-compare";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer-section";
import ContactFormModal from "@/components/ContactFormModal";

export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = bySlug(slug);
  if (!c) return {};
  return {
    title: { absolute: c.title },
    description: c.description,
    alternates: { canonical: `https://lrbc.ai/workpilot/vs/${c.slug}` },
    openGraph: { title: c.title, description: c.description, url: `https://lrbc.ai/workpilot/vs/${c.slug}` },
  };
}

const MARK: Record<Mark, { label: string; cls: string }> = {
  yes: { label: "Yes", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  partly: { label: "Partly", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  no: { label: "No", cls: "bg-zinc-500/15 text-zinc-500" },
};

function Badge({ m }: { m: Mark }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${MARK[m].cls}`}>{MARK[m].label}</span>;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = bySlug(slug);
  if (!c) notFound();
  const others = COMPETITORS.filter((x) => x.slug !== c.slug);

  return (
    <>
      <HeroHeader />
      <main>
        <section className="lrbc-section">
          <div className="mx-auto max-w-4xl px-5 pt-24 sm:pt-28 md:pt-32">
            <Link href="/workpilot" className="lrbc-eyebrow">← WorkPilot</Link>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{c.h1}</h1>
            <p className="mt-5 text-lg text-muted-foreground">{c.intro}</p>
            <p className="mt-4 text-muted-foreground">{c.theyAre}</p>

            <div className="mt-10 overflow-hidden rounded-2xl border">
              <div className="hidden grid-cols-[1.1fr_1.4fr_1.4fr] gap-4 bg-muted/50 px-5 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground md:grid">
                <span>What you need</span><span>WorkPilot</span><span>{c.name}</span>
              </div>
              {c.rows.map((r) => (
                <div key={r.feature} className="grid gap-3 border-t px-5 py-4 md:grid-cols-[1.1fr_1.4fr_1.4fr] md:gap-4">
                  <div className="font-semibold">{r.feature}</div>
                  <div className="text-sm"><Badge m={r.wp.mark} /><p className="mt-1.5 text-muted-foreground"><span className="font-semibold md:hidden">WorkPilot: </span>{r.wp.note}</p></div>
                  <div className="text-sm"><Badge m={r.them.mark} /><p className="mt-1.5 text-muted-foreground"><span className="font-semibold md:hidden">{c.name}: </span>{r.them.note}</p></div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Based on each vendor's public information, reviewed {REVIEWED}. Products change; check the vendor's site for current details.</p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border p-6">
                <h2 className="text-xl font-bold">Choose {c.name} if</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">{c.chooseThem.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              <div className="rounded-2xl border p-6">
                <h2 className="text-xl font-bold">Choose WorkPilot if</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">{c.chooseWp.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </div>

            <h2 className="mt-12 text-2xl font-bold">Pricing</h2>
            <p className="mt-3 text-muted-foreground">{c.pricingNote}</p>

            <div className="lrbc-cta-row mt-10">
              <ContactFormModal buttonText="Start my 15-day free trial" source={`WorkPilot vs ${c.name}`} />
              <Link href="/demo" className="lrbc-btn lrbc-btn-secondary">Book a walkthrough</Link>
            </div>

            <div className="mt-14 border-t pt-6 text-sm text-muted-foreground">
              Also compare:{" "}
              {others.map((o, i) => (
                <span key={o.slug}>{i > 0 && " · "}<Link className="underline" href={`/workpilot/vs/${o.slug}`}>{o.name}</Link></span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
