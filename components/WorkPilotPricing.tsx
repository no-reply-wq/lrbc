"use client";

import { useState } from "react";
import { Check, Zap, Briefcase, Building2, Crown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFadeUp } from "@/components/ui/use-scroll-animation";
import React from "react";
import { Et, Hide } from "@/components/cms/editable";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfect for small teams getting started",
    icon: Zap,
    users: "5 users minimum",
    minUsers: 5,
    price: 399,
    accent: "#3b82f6",
    highlight: false,
    features: [
      "Live attendance tracking",
      "Task assignment & tracking",
      "Basic performance scores",
      "Activity history — 30 days",
      "Mobile check-in",
      "Email reminders",
      "Export to Excel",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Most teams choose this plan",
    icon: Briefcase,
    users: "10 users",
    minUsers: 10,
    price: 299,
    accent: "#7c3aed",
    highlight: true,
    features: [
      "Everything in Starter",
      "Advanced performance dashboards",
      "Activity history — 90 days",
      "Role-based access control",
      "Automated WhatsApp reminders",
      "MIS reports & analytics",
      "Multi-department management",
      "Priority email support",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For growing organizations",
    icon: Building2,
    users: "20 users",
    minUsers: 20,
    price: 199,
    accent: "#a855f7",
    highlight: false,
    features: [
      "Everything in Professional",
      "Unlimited activity history",
      "Custom roles & permissions",
      "Shift & schedule management",
      "API access",
      "Dedicated account manager",
      "Custom onboarding",
      "Phone + email support",
    ],
  },
];

function PlanCard({ plan, index }: { plan: typeof PLANS[0]; index: number }) {
  const [sent, setSent] = useState(false);

  const handleTrial = () => {
    if (sent) return;
    const subject = encodeURIComponent(`WorkPilot Free Trial — ${plan.name} Plan`);
    const body = encodeURIComponent(
      `Hi LRBC Team,\n\nI'd like to start a 15-day free trial of WorkPilot.\n\nPlan: ${plan.name} (${plan.users} @ ₹${plan.price}/user/month)\nMinimum monthly: ₹${(plan.price * plan.minUsers).toLocaleString()}\n\nCompany Name: \nContact Person: \nPhone: \nEmail: \n`
    );
    window.open(`mailto:hello@lrbc.ai?subject=${subject}&body=${body}`, "_self");
    setTimeout(() => setSent(true), 400);
  };

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
            <Et id={`workpilot.pricing.plan.${index}.badge`} def="★ Most Popular" />
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
        <Et as="h3" id={`workpilot.pricing.plan.${index}.name`} def={plan.name} className="text-xl font-bold tracking-tight" />
        <Et as="p" id={`workpilot.pricing.plan.${index}.tagline`} def={plan.tagline} className="text-sm text-muted-foreground mt-1" />
      </div>

      {/* Price */}
      <div className="relative z-10 mt-6 mb-1">
        <div className="flex items-end gap-2">
          <Et
            id={`workpilot.pricing.plan.${index}.price`}
            def={`₹${plan.price}`}
            className="text-5xl font-black tracking-tighter transition-colors duration-300 group-hover:text-[var(--accent-color)]"
            style={{ "--accent-color": plan.accent } as React.CSSProperties}
          />
          <div className="pb-2 text-muted-foreground text-xs leading-tight">
            <Et as="div" id={`workpilot.pricing.plan.${index}.unit1`} def="per user" />
            <Et as="div" id={`workpilot.pricing.plan.${index}.unit2`} def="per month" />
          </div>
        </div>
        <Et as="p" id={`workpilot.pricing.plan.${index}.min`} def={`${plan.users} · Min ₹${(plan.price * plan.minUsers).toLocaleString()}/month`} className="text-xs text-muted-foreground mt-2" />
      </div>

      {/* Divider */}
      <div
        className="relative z-10 my-6 h-px"
        style={{ background: `linear-gradient(90deg, ${plan.accent}50, transparent)` }}
      />

      {/* Features */}
      <ul className="relative z-10 space-y-3 flex-1 mb-8">
        {plan.features.map((f, fi) => (
          <Hide key={f} id={`workpilot.pricing.plan.${index}.feature.${fi}`}>
          <li className="flex items-start gap-3 text-sm">
            <div
              className="mt-0.5 h-4 w-4 shrink-0 rounded-full flex items-center justify-center"
              style={{ background: `${plan.accent}18` }}
            >
              <Check className="h-2.5 w-2.5" style={{ color: plan.accent }} />
            </div>
            <Et id={`workpilot.pricing.plan.${index}.feature.${fi}.text`} def={f} className="text-foreground/75 leading-snug" />
          </li>
          </Hide>
        ))}
      </ul>

      {/* CTA button */}
      <button
        type="button"
        onClick={handleTrial}
        disabled={sent}
        className={cn(
          "relative z-10 w-full h-12 rounded-xl font-semibold text-sm",
          "flex items-center justify-center gap-2",
          "border transition-all duration-300",
          !sent && "group-hover:scale-[1.01]",
          sent && "cursor-default opacity-70"
        )}
        style={{
          background: plan.highlight ? plan.accent : `${plan.accent}12`,
          color: plan.highlight ? "#fff" : plan.accent,
          borderColor: `${plan.accent}40`,
        }}
        onMouseEnter={e => {
          if (sent) return;
          const el = e.currentTarget;
          el.style.background = plan.accent;
          el.style.color = "#fff";
          el.style.boxShadow = `0 8px 24px -4px ${plan.accent}50`;
          el.style.borderColor = plan.accent;
        }}
        onMouseLeave={e => {
          if (sent) return;
          const el = e.currentTarget;
          el.style.background = plan.highlight ? plan.accent : `${plan.accent}12`;
          el.style.color = plan.highlight ? "#fff" : plan.accent;
          el.style.boxShadow = "none";
          el.style.borderColor = `${plan.accent}40`;
        }}
      >
        {sent ? "✓ Check your email!" : <Et id="workpilot.pricing.trialCta" def="Start 15-Day Free Trial" />}
        {!sent && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </button>
    </div>
  );
}

export default function WorkPilotPricing() {
  const ref = useFadeUp() as React.RefObject<HTMLElement>;
  const [enterpriseSent, setEnterpriseSent] = useState(false);

  const handleEnterprise = () => {
    if (enterpriseSent) return;
    const subject = encodeURIComponent("WorkPilot Enterprise Plan — Custom Quote Request");
    const body = encodeURIComponent(
      `Hi LRBC Team,\n\nWe are interested in WorkPilot for a team of more than 20 users.\n\nCompany Name: \nContact Person: \nNumber of Users: \nPhone: \nEmail: \n`
    );
    window.open(`mailto:hello@lrbc.ai?subject=${subject}&body=${body}`, "_self");
    setTimeout(() => setEnterpriseSent(true), 400);
  };

  return (
    <Hide id="workpilot.pricing.sec">
    <section ref={ref} id="pricing" className="py-8 md:py-12 relative overflow-hidden">

      {/* bg glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-16">
          <p className="lrbc-anim inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            <span className="h-px w-8 bg-primary/50" /><Et id="workpilot.pricing.eyebrow" def="Pricing" /><span className="h-px w-8 bg-primary/50" />
          </p>
          <Et as="h2" id="workpilot.pricing.title" def="Simple, transparent pricing" className="lrbc-anim lrbc-anim-d1 text-3xl font-black sm:text-4xl tracking-tight" />
          <p className="lrbc-anim lrbc-anim-d2 mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            <Et id="workpilot.pricing.text1" def="Every plan starts with a " /><Et id="workpilot.pricing.text2" def="15-day free trial" className="text-primary font-semibold" /><Et id="workpilot.pricing.text3" def=". No credit card. No commitment." />
          </p>
        </div>

        {/* Cards — pt-6 to give space for the Popular badge */}
        <div className="mx-auto grid max-w-md gap-8 pt-6 lg:max-w-none lg:grid-cols-3 lg:gap-5">
          {PLANS.map((plan, i) => <Hide key={plan.id} id={`workpilot.pricing.plan.${i}`}><PlanCard plan={plan} index={i} /></Hide>)}
        </div>

        {/* Enterprise */}
        <div
          className="lrbc-anim lrbc-anim-d2 group mt-8 rounded-2xl border border-border bg-background p-7 flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer transition-all duration-300 hover:border-orange-400/50 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1"
          onClick={() => !enterpriseSent && handleEnterprise()}
        >
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 bg-orange-500/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]">
              <Crown className="h-7 w-7 text-orange-500" />
            </div>
            <div>
              <Et as="h3" id="workpilot.pricing.ent.title" def="Enterprise Plan" className="text-xl font-bold" />
              <Et as="p" id="workpilot.pricing.ent.text" def="For teams of 20+ · Custom pricing · Dedicated support · White-glove onboarding" className="text-muted-foreground text-sm mt-1 max-w-md" />
            </div>
          </div>
          <button
            type="button"
            className="h-12 px-7 rounded-xl font-semibold text-sm shrink-0 border border-orange-400/30 bg-orange-500/10 text-orange-500 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30"
            onClick={e => { e.stopPropagation(); !enterpriseSent && handleEnterprise(); }}
          >
            {enterpriseSent ? "✓ Check your email!" : <Et id="workpilot.pricing.ent.cta" def="Request Custom Quote →" />}
          </button>
        </div>

        <p className="lrbc-anim lrbc-anim-d3 text-center text-sm text-muted-foreground mt-10">
          <Et id="workpilot.pricing.footnote" def="All plans include setup assistance · Pricing in INR + applicable GST · " />
          <a href="mailto:hello@lrbc.ai" className="text-primary hover:underline font-medium">hello@lrbc.ai</a>
        </p>

      </div>
    </section>
    </Hide>
  );
}