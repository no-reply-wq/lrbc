import Link from "next/link";
import { Check, X, ArrowRight, type LucideIcon } from "lucide-react";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer-section";
import ContactFormModal from "@/components/ContactFormModal";
import StepsFlow from "@/components/product-pages/StepsFlow";

export interface ProductPageData {
  slug: string;
  name: string;
  badge: string;
  h1: [string, string];
  /** Full answer used for search engines / schema */
  answer: string;
  /** Shorter line shown under the heading (defaults to answer) */
  heroText?: string;
  /** Label for the main hero button (opens the contact form) */
  heroCta?: string;
  stats: { value: string; label: string }[];
  features: { icon: LucideIcon; title: string; text: string }[];
  steps: { title: string; text: string; icon: "search" | "configure" | "build" | "rocket" }[];
  fits: string[];
  notFits: string[];
  pricing: { title: string; text: string; points: string[] };
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
  other: { name: string; href: string; text: string };
}

const SITE = "https://lrbc.ai";

export function ProductPage({ d }: { d: ProductPageData }) {
  const url = `${SITE}/${d.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: d.name,
      serviceType: "ERP software and implementation",
      description: d.answer,
      url,
      areaServed: "IN",
      provider: { "@type": "Organization", name: "Lean Resource Business Consulting Private Limited (LRBC)", url: SITE },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: d.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Products", item: `${SITE}/lekhasetu` },
        { "@type": "ListItem", position: 3, name: d.name, item: url },
      ],
    },
  ];

  const cta = "lrbc-btn lrbc-btn-primary sm:w-auto";

  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroHeader />

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden px-4 pb-8 pt-28 sm:px-6 sm:pb-12 sm:pt-36">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-32 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[#6d3df0]/25 blur-[110px] sm:h-[34rem] sm:w-[34rem]" />
            <div className="absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-[#ff9ffc]/25 blur-[100px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(109,61,240,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(109,61,240,.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          </div>
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {d.badge}
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {d.h1[0]}{" "}
              <span className="bg-gradient-to-r from-[#5227FF] via-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">{d.h1[1]}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">{d.heroText ?? d.answer}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ContactFormModal buttonText={d.heroCta ?? `Talk to us about ${d.name}`} source={`${d.name} page — hero`} className={cta} />
              <a href="#how" className="lrbc-btn lrbc-btn-secondary sm:w-auto">
                See how it works <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <dl className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {d.stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border/70 bg-background/70 px-5 py-4 backdrop-blur">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</dt>
                  <dd className="mt-1 text-xl font-semibold text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="features-h">
          <div className="mx-auto max-w-6xl">
            <h2 id="features-h" className="mx-auto max-w-2xl text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              What {d.name} gives your business
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.features.map((f) => (
                <article key={f.title} className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-md shadow-primary/30">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-24 px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="how-h">
          <div className="mx-auto max-w-5xl">
            <h2 id="how-h" className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">How {d.name} works</h2>
            <div className="mt-12"><StepsFlow steps={d.steps} /></div>
          </div>
        </section>

        {/* Fit */}
        <section className="px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="fit-h">
          <div className="mx-auto max-w-5xl">
            <h2 id="fit-h" className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Is {d.name} right for you?</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
                <h3 className="font-semibold text-foreground">A good fit if…</h3>
                <ul className="mt-4 space-y-3">
                  {d.fits.map((t) => (
                    <li key={t} className="flex gap-3 text-sm text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card p-6">
                <h3 className="font-semibold text-foreground">Probably not the right fit if…</h3>
                <ul className="mt-4 space-y-3">
                  {d.notFits.map((t) => (
                    <li key={t} className="flex gap-3 text-sm text-muted-foreground"><X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70" />{t}</li>
                  ))}
                </ul>
                <Link href={d.other.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  {d.other.text} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing guidance */}
        <section className="px-4 py-8 sm:px-6 md:py-12" aria-labelledby="price-h">
          <div className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-fuchsia-500/10 p-6 sm:p-10">
            <h2 id="price-h" className="text-2xl font-semibold tracking-tight sm:text-3xl">{d.pricing.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{d.pricing.text}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {d.pricing.points.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{p}</li>
              ))}
            </ul>
            <div className="mt-7">
              <ContactFormModal buttonText="Know your Quote" source={`${d.name} page — pricing`} className={cta} />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="faq-h">
          <div className="mx-auto max-w-3xl">
            <h2 id="faq-h" className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">{d.name} — common questions</h2>
            <div className="mt-8 space-y-3">
              {d.faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-border/70 bg-card p-5 open:border-primary/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="text-primary transition group-open:rotate-45 text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-8 sm:px-6 md:py-12">
          <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-[#312e81] via-[#5227FF] to-[#a855f7] p-8 text-center text-white shadow-2xl shadow-primary/30 sm:p-12">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{d.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">{d.ctaText}</p>
            <div className="mt-7 flex justify-center">
              <ContactFormModal
                buttonText="Get in touch"
                source={`${d.name} page — bottom CTA`}
                className="lrbc-btn lrbc-btn-light sm:w-auto"
              />
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
