import { Check, ArrowRight, type LucideIcon } from "lucide-react";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer-section";
import ContactFormModal from "@/components/ContactFormModal";
import FitLists from "@/components/product-pages/FitLists";
import FadeText from "@/components/product-pages/FadeText";
import StepsFlow from "@/components/product-pages/StepsFlow";
import { Et, Lnk, Hide } from "@/components/cms/editable";
import { getContent } from "@/lib/content";

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

export async function ProductPage({ d }: { d: ProductPageData }) {
  const url = `${SITE}/${d.slug}`;
  const c = await getContent();
  const v = (id: string, def: string) => (id in c ? c[id] : def);
  const k = (x: string) => `${d.slug}.${x}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: d.name,
      serviceType: "ERP software and implementation",
      description: v(k("answer"), d.answer),
      url,
      areaServed: "IN",
      provider: { "@type": "Organization", name: "Lean Resource Business Consulting Private Limited (LRBC)", url: SITE },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: d.faqs.map((f, i) => ({
        "@type": "Question",
        name: v(k(`faq.${i}.q`), f.q),
        acceptedAnswer: { "@type": "Answer", text: v(k(`faq.${i}.a`), f.a) },
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
            <div className="lrbc-eyebrow-row">
              <span className="lrbc-eyebrow"><Et id={k("badge")} def={d.badge} /></span>
            </div>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <Et id={k("h1a")} def={d.h1[0]} />{" "}
              <Et id={k("h1b")} def={d.h1[1]} className="bg-gradient-to-r from-[#5227FF] via-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent" />
            </h1>
            <Et as="p" id={k("heroText")} def={d.heroText ?? d.answer} className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg" />
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ContactFormModal buttonText={d.heroCta ?? `Talk to us about ${d.name}`} source={`${d.name} page — hero`} className={cta} />
              <a href="#how" className="lrbc-btn lrbc-btn-secondary sm:w-auto">
                See how it works <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <dl className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {d.stats.map((s, i) => (
                <Hide key={s.label} id={k(`stat.${i}`)}>
                <div className="rounded-2xl border border-border/70 bg-background/70 px-5 py-4 backdrop-blur">
                  <Et as="dt" id={k(`stat.${i}.label`)} def={s.label} className="text-xs uppercase tracking-wide text-muted-foreground" />
                  <Et as="dd" id={k(`stat.${i}.value`)} def={s.value} className="mt-1 text-xl font-semibold text-foreground" />
                </div>
                </Hide>
              ))}
            </dl>
          </div>
        </section>

        {/* Features */}
        <Hide id={k("sec.features")}><section className="px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="features-h">
          <div className="mx-auto max-w-6xl">
            <h2 id="features-h" className="mx-auto max-w-2xl text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              <Et id={k("featuresTitle")} def={`What ${d.name} gives your business`} />
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {d.features.map((f, i) => (
                <Hide key={f.title} id={k(`feat.${i}`)}>
                <article className="group relative w-full overflow-hidden rounded-2xl border border-border/70 bg-card p-6 transition sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.7rem)] hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-md shadow-primary/30">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <Et as="h3" id={k(`feat.${i}.title`)} def={f.title} className="mt-4 block text-lg font-semibold text-foreground" />
                  <Et as="p" id={k(`feat.${i}.text`)} def={f.text} className="mt-2 text-sm leading-relaxed text-muted-foreground" />
                </article>
                </Hide>
              ))}
            </div>
          </div>
        </section></Hide>

        {/* How it works */}
        <Hide id={k("sec.how")}><section id="how" className="scroll-mt-24 px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="how-h">
          <div className="mx-auto max-w-5xl">
            <h2 id="how-h" className="text-center text-3xl font-semibold tracking-tight sm:text-4xl"><Et id={k("howTitle")} def={`How ${d.name} works`} /></h2>
            <div className="mt-12"><StepsFlow steps={d.steps} /></div>
          </div>
        </section></Hide>

        {/* Fit */}
        <Hide id={k("sec.fit")}><section className="px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="fit-h">
          <div className="mx-auto max-w-5xl">
            <h2 id="fit-h" className="text-center text-3xl font-semibold tracking-tight sm:text-4xl"><Et id={k("fitTitle")} def={`Is ${d.name} right for you?`} /></h2>
            <FitLists
              slug={d.slug}
              fits={d.fits}
              notFits={d.notFits}
              action={<Lnk id={k("other.href")} href={d.other.href} labelId={k("other.text")} label={d.other.text} className="lrbc-btn lrbc-btn-secondary sm:w-auto" />}
            />
          </div>
        </section></Hide>

        {/* Pricing guidance */}
        <Hide id={k("sec.pricing")}><section className="px-4 py-8 sm:px-6 md:py-12" aria-labelledby="price-h">
          <div className="mx-auto grid max-w-5xl items-center gap-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-fuchsia-500/10 p-6 sm:p-10 md:grid-cols-2 md:gap-12">
            <div>
              <h2 id="price-h" className="text-2xl font-semibold tracking-tight sm:text-3xl"><Et id={k("pricing.title")} def={d.pricing.title} /></h2>
              <FadeText id={k("pricing.text")} def={d.pricing.text} className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base" />
            </div>
            <div className="flex flex-col items-center">
              <ul className="grid w-full gap-3">
                {d.pricing.points.map((p, i) => (
                  <Hide key={p} id={k(`pricing.pt.${i}`)}><li className="flex gap-3 rounded-xl border border-primary/15 bg-background/60 px-4 py-3 text-sm text-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><Et id={k(`pricing.pt.${i}`)} def={p} /></li></Hide>
                ))}
              </ul>
              <div className="lrbc-cta-row">
                <ContactFormModal buttonText="Know your Quote" source={`${d.name} page — pricing`} className={cta} />
              </div>
            </div>
          </div>
        </section></Hide>

        {/* FAQ */}
        <Hide id={k("sec.faq")}><section className="px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="faq-h">
          <div className="mx-auto max-w-3xl">
            <h2 id="faq-h" className="text-center text-3xl font-semibold tracking-tight sm:text-4xl"><Et id={k("faqTitle")} def={`${d.name} — common questions`} /></h2>
            <div className="mt-8 space-y-3">
              {d.faqs.map((f, i) => (
                <Hide key={f.q} id={k(`faq.${i}`)}>
                <details className="group rounded-2xl border border-border/70 bg-card p-5 open:border-primary/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    <Et id={k(`faq.${i}.q`)} def={f.q} />
                    <span className="text-primary transition group-open:rotate-45 text-xl leading-none">+</span>
                  </summary>
                  <Et as="p" id={k(`faq.${i}.a`)} def={f.a} className="mt-3 text-sm leading-relaxed text-muted-foreground" />
                </details>
                </Hide>
              ))}
            </div>
          </div>
        </section></Hide>

        {/* Final CTA */}
        <Hide id={k("sec.cta")}><section className="px-4 py-8 sm:px-6 md:py-12">
          <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-[#312e81] via-[#5227FF] to-[#a855f7] p-8 text-center text-white shadow-2xl shadow-primary/30 sm:p-12">
            <Et as="h2" id={k("ctaTitle")} def={d.ctaTitle} className="block text-balance text-3xl font-semibold tracking-tight sm:text-4xl" />
            <Et as="p" id={k("ctaText")} def={d.ctaText} className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base" />
            <div className="mt-7 flex justify-center">
              <ContactFormModal
                buttonText="Get in touch"
                source={`${d.name} page — bottom CTA`}
                className="lrbc-btn lrbc-btn-light sm:w-auto"
              />
            </div>
          </div>
        </section></Hide>
      </main>

      <FooterSection />
    </div>
  );
}
