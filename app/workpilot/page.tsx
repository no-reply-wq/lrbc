"use client";

import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer-section";
import WorkPilotHero from "@/components/WorkPilotHero";
import WorkPilotFeatures from "@/components/WorkPilotFeatures";
import CallToAction from "@/components/cta-section";

export default function WorkPilotPage() {
  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />
      <WorkPilotHero />
      <WorkPilotFeatures />
      <CallToAction />
      <FooterSection />
    </div>
  );
}
