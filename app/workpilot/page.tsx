"use client";

import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer-section";
import WorkPilotPricing from "@/components/WorkPilotPricing";
import { Hero, ProofBar, Problem, WhatItDoes, RealScreens, DayTimeline, OwnerView, ShopFloor, HowItWorks, VsWhatsApp, Faq, FinalCta } from "@/components/workpilot/Sections";

export default function WorkPilotPage() {
  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />
      <Hero />
      <ProofBar />
      <Problem />
      <WhatItDoes />
      <RealScreens />
      <DayTimeline />
      <OwnerView />
      <ShopFloor />
      <HowItWorks />
      <VsWhatsApp />
      <WorkPilotPricing />
      <Faq />
      <FinalCta />
      <FooterSection />
    </div>
  );
}
