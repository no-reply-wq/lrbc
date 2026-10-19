"use client";

import { Check, Zap, Briefcase, Building2, Crown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFadeUp } from "@/components/ui/use-scroll-animation";
import React from "react";
import { Et, Hide } from "@/components/cms/editable";
import ContactFormModal from "@/components/ContactFormModal";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For small teams getting organised",
    icon: Zap,
    users: "From 5 users",
    minUsers: 5,
    price: 399,
    accent: "#6366f1",
    highlight: false,
    features: [
      "Checklists, delegation and FMS",
      "Live attendance and mobile check-in",
      "Basic performance scores",
      "30 days of activity history",
      "Email reminders",
      "Export to Excel",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "For teams that want reminders on WhatsApp and reports for review meetings",
    icon: Briefcase,
    users: "From 10 users",
    minUsers: 10,
    price: 299,
    accent: "#7c3aed",
    highlight: true,
    features: [
      "Everything in Starter",
      "Automated WhatsApp reminders",
      "Advanced performance dashboards",
      "90 days of activity history",
      "Role-based access for managers and staff",
      "MIS reports and analytics",
      "Multiple departments",
      "Priority email support",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For growing businesses with shifts and layers of managers",
    icon: Building2,
    users: "From 20 users",
    minUsers: 20,
    price: 199,
    accent: "#a855f7",
    highlight: false,
    features: [
      "Everything in Professional",
      "Unlimited activity history",
      "Custom roles and permissions",
      "Shift and schedule management",
      "API access",
      "A dedicated account manager",
      "Custom onboarding",
      "Phone and email support",
    ],
  },
];

function PlanCard({ plan, index }: { plan: typeof PLANS[0]; index: number }) {
  const delay = index === 0 ? "" : index === 1 ? "lrbc-anim-d1" : "lrbc-anim-d2";

  return (
    <div
      className={cn(
        "lrbc-anim", delay,
        "group relative flex flex-col rounded-2xl border p-6 sm:p-7",
        "transition-all duration-300 ease-out cursor-default",
        // Hover: lift + shadow
        "hover:-translate-y-3",
        // Highlight card: purple border always visible
        plan.highlight
          ? "border-[#7c3aed] shadow-lg shadow-[#7c3aed]/20 hover:shadow-[#7c3aed]/40 hover:shadow-2xl"
          : "border-border hover:border-[var(--accent-color)] hover:shadow-xl hover:shadow-black/10",
        "bg-background"
      )}
      style={{ "--accent-color": plan.accent } as React.CSSProperties}
    >
      {/* Most Popular badge — always visible on highlight card */}
      {plan.highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-white whitespace-nowrap shadow-lg"
            style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7)" }}
          >
            <Et id={`wp2.pricing.plan.${index}.badge`} def="★ Most popular" />
          </span>
        </div>
      )}

      {/* Top glow on hover — using CSS group-hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${plan.accent}15, transparent 65%)`,
        }}
      />

      {/* Icon */}
      <div
        className="relative z-10 w-11 h-11 rounded-2xl flex items-center justify-center mb-5 mt-3 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${plan.accent}18` }}
      >
        <plan.icon className="h-5 w-5" style={{ color: plan.accent }} />
      </div>

      {/* Name + tagline */}
      <div className="relative z-10">
        <Et as="h3" id={`wp2.pricing.plan.${index}.name`} def={plan.name} className="text-xl font-bold tracking-tight" />
        <Et as="p" id={`wp2.pricing.plan.${index}.tagline`} def={plan.tagline} className="text-sm text-muted-foreground mt-1" />
      </div>

      {/* Price */}
      <div className="relative z-10 mt-6 mb-1">
        <div className="flex items-end gap-2">
          <Et
            id={`wp2.pricing.plan.${index}.price`}
            def={`₹${plan.price}`}
            className="text-5xl font-black tracking-tighter transition-colors duration-300 group-hover:text-[var(--accent-color)]"
            style={{ "--accent-color": plan.accent } as React.CSSProperties}
          />
          <div className="pb-2 text-muted-foreground text-xs leading-tight">
            <Et as="div" id={`wp2.pricing.plan.${index}.unit1`} def="per user" />
            <Et as="div" id={`wp2.pricing.plan.${index}.unit2`} def="per month" />
          </div>
        </div>
        <Et as="p" id={`wp2.pricing.plan.${index}.min`} def={`${plan.users} (₹${(plan.price * plan.minUsers).toLocaleString("en-IN")}/month)`} className="text-xs text-muted-foreground mt-2" />
      </div>

      {/* Divider */}
      <div
        className="relative z-10 my-6 h-px"
        style={{ background: `linear-gradient(90deg, ${plan.accent}50, transparent)` }}
      />

      {/* Features */}
      <ul className="relative z-10 space-y-3 flex-1 mb-8">
        {plan.features.map((f, fi) => (
          <Hide key={f} id={`wp2.pricing.plan.${index}.feature.${fi}`}>
          <li className="flex items-start gap-3 text-sm">
            <div
              className="mt-0.5 h-4 w-4 shrink-0 rounded-full flex items-center justify-center"
              style={{ background: `${plan.accent}18` }}
            >
              <Check className="h-2.5 w-2.5" style={{ color: plan.accent }} />
            </div>
            <Et id={`wp2.pricing.plan.${index}.feature.${fi}.text`} def={f} className="text-foreground/75 leading-snug" />
          </li>
          </Hide>
        ))}
      </ul>

      {/* CTA button */}
      <div className="relative z-10 flex justify-center">
        <ContactFormModal
          buttonText="Start free trial"
          source={`WorkPilot free trial — ${plan.name}`}
          showArrow
          className={cn("lrbc-btn sm:w-auto", plan.highlight ? "lrbc-btn-primary" : "lrbc-btn-secondary")}
        />
      </div>
    </div>
  );
}

export default function WorkPilotPricing() {
  const ref = useFadeUp() as React.RefObject<HTMLElement>;

  return (
    <Hide id="wp2.pricing.sec">
    <section ref={ref} id="pricing" className="py-8 md:py-12 relative overflow-hidden">

      {/* bg glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-16">
          <div className="lrbc-anim lrbc-eyebrow-row mb-4">
            <span className="lrbc-eyebrow"><Et id="wp2.pricing.eyebrow" def="Pricing" /></span>
          </div>
          <Et as="h2" id="wp2.pricing.title" def="Simple pricing. Bigger teams pay less per person." className="lrbc-anim lrbc-anim-d1 text-3xl font-black sm:text-4xl tracking-tight" />
          <Et as="p" id="wp2.pricing.sub" def="Every plan starts with a 15-day free trial and includes setup help. No credit card, no commitment. Prices in INR, plus GST." className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground" />
        </div>

        {/* Cards — pt-6 to give space for the Popular badge */}
        <div className="mx-auto grid max-w-md gap-8 pt-6 lg:max-w-none lg:grid-cols-3 lg:gap-5">
          {PLANS.map((plan, i) => <Hide key={plan.id} id={`wp2.pricing.plan.${i}`}><PlanCard plan={plan} index={i} /></Hide>)}
        </div>

        {/* Enterprise */}
        <div className="lrbc-anim lrbc-anim-d2 lrbc-tint group mt-8 flex flex-col items-center gap-6 rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 md:flex-row md:justify-between md:gap-10 md:px-10 md:text-left">
          <div className="flex flex-col items-center gap-5 md:flex-row md:gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10"><Crown className="h-7 w-7 text-primary" /></div>
            <div>
              <Et as="h3" id="wp2.pricing.ent.title" def="Enterprise — custom pricing" className="text-xl font-bold" />
              <Et as="p" id="wp2.pricing.ent.text" def="For larger teams or several locations that need workflows built around them." className="mt-1 max-w-md text-sm text-muted-foreground" />
            </div>
          </div>
          <ContactFormModal buttonText="Talk to us" source="WorkPilot Enterprise" className="lrbc-btn lrbc-btn-primary shrink-0 sm:w-auto" />
        </div>

        <Et as="p" id="wp2.pricing.help" def="Not sure which plan fits? Count the people who'll use WorkPilot: under 10, start with Starter; 10 to 19, Professional; 20 or more, Business. Or message us on WhatsApp and we'll tell you honestly." className="lrbc-anim lrbc-anim-d3 mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground" />

        <p className="lrbc-anim lrbc-anim-d3 text-center text-sm text-muted-foreground mt-10">
          <Et id="wp2.pricing.footnote" def="Questions? " />
          <a href="mailto:contact@lrbc.ai" className="text-primary hover:underline font-medium">contact@lrbc.ai</a>
        </p>

      </div>
    </section>
    </Hide>
  );
}