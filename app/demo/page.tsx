"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarCheck, MessageSquareText, MonitorPlay } from "lucide-react";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer-section";
import { ContactForm } from "@/components/ContactForm";
import { Et, Hide } from "@/components/cms/editable";

const STEPS = [
  { icon: CalendarCheck, title: "Share your details", body: "Fill in the short form. It takes about a minute." },
  { icon: MessageSquareText, title: "We get in touch", body: "Our team contacts you to understand how your business runs today." },
  { icon: MonitorPlay, title: "See it on your own workflow", body: "A walkthrough built around your business — not a generic tour." },
];

const PRODUCTS = [
  { name: "WorkPilot", href: "/workpilot", body: "Attendance, tasks and performance in one clear view." },
  { name: "LekhaSetu", href: "/lekhasetu", body: "Your accounting data, always in sync in the cloud." },
  { name: "Mini ERP", href: "/mini-erp", body: "A compact ERP for growing businesses." },
  { name: "Custom ERP", href: "/custom-erp", body: "A system built around your own process." },
];

export default function DemoPage() {
  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />

      <main className="lrbc-section bg-background">
        <div className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 sm:pt-28 md:pt-32">
          {/* heading */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="lrbc-eyebrow-row mb-4"><Et as="div" id="demo.badge" def="Book a demo" className="lrbc-eyebrow" /></div>
            <Et as="h1" id="demo.title" def="See LRBC working for your business" className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl" />
            <Et as="p" id="demo.sub" def="Tell us a little about your business and we will arrange a walkthrough of the system that fits it best." className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg" />
          </div>

          <div className="mt-10 grid items-start gap-8 md:mt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
            {/* left: what happens + products */}
            <div className="order-2 space-y-8 lg:order-1">
              <div>
                <Et as="h2" id="demo.steps.title" def="What happens next" className="font-heading text-xl font-semibold text-foreground sm:text-2xl" />
                <ol className="mt-5 space-y-4">
                  {STEPS.map((s, i) => (
                    <Hide key={s.title} id={`demo.step.${i}`}>
                      <li className="flex gap-4 rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-5">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-md shadow-primary/25">
                          <s.icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step {i + 1}</p>
                          <Et as="h3" id={`demo.step.${i}.title`} def={s.title} className="mt-0.5 block text-base font-semibold text-foreground" />
                          <Et as="p" id={`demo.step.${i}.body`} def={s.body} className="mt-1 text-sm leading-relaxed text-muted-foreground" />
                        </div>
                      </li>
                    </Hide>
                  ))}
                </ol>
              </div>

              <div>
                <Et as="h2" id="demo.products.title" def="Not sure what to look at?" className="font-heading text-xl font-semibold text-foreground sm:text-2xl" />
                <Et as="p" id="demo.products.sub" def="Mention it in the form, or explore each product first." className="mt-1 text-sm text-muted-foreground" />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {PRODUCTS.map((p, i) => (
                    <Hide key={p.name} id={`demo.product.${i}`}>
                      <Link href={p.href} className="group flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 transition hover:border-primary/40 hover:shadow-md">
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-foreground">{p.name}</span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{p.body}</span>
                        </span>
                        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </Hide>
                  ))}
                </div>
              </div>
            </div>

            {/* right: the form */}
            <div className="order-1 lg:sticky lg:top-28 lg:order-2">
              <ContactForm source="Book a Demo page" />
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
