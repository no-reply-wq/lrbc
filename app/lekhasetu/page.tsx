"use client";


import ContactSection2 from "@/components/ContactSection2";
import { HeroHeader } from "@/components/header";
import LekhaSetuHero from "@/components/LekhaSetuHero";
import { FeaturesSethu } from "./features-sethu";
import CallToAction from "@/components/cta-section";
import { SolutionSection } from "@/components/solution";
import IntegrationsSection from "@/components/solution-2";
import FooterSection from "@/components/footer-section";




export default function LekhaSetu() {
  return (
  <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
    <HeroHeader />
      <LekhaSetuHero />
      <SolutionSection />
      <IntegrationsSection/>
      <FeaturesSethu />
      <CallToAction />
      <FooterSection />

  </div>
  );
}