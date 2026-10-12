"use client";

import { HeroHeader } from "@/components/header";
import { Et, Hide } from "@/components/cms/editable";
import NewHeroSection from "@/components/new-components/new-hero";
import EngagementProcess from "@/components/engagement-process";
import CoreSolutions from "@/components/core-solutions";
import WhyLRBC from "@/components/why-lrbc";
import FooterSection from "@/components/footer-section";

export default function WhyLRBCPage() {
  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />

      <NewHeroSection
        title={
          <h1 className="mx-auto max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl xl:text-[5.25rem]">
            <Et id="why.hero.title1" def="Why Businesses" reload className="overflow-hidden lrbc-clip-safe" />
            <Et id="why.hero.title2" def="Choose LRBC." reload className="overflow-hidden lrbc-clip-safe" />
          </h1>
        }
        subtitle={
          <Et as="p" id="why.hero.subtitle" def="How we work, what we build, and why it holds up as you scale." reload className="mx-auto max-w-2xl text-center text-lg" />
        }
        buttonText="See How We Can Help"
        buttonHref="/contact"
        badgeText="Why LRBC"
        cmsId="why.hero"
      />

      <Hide id="why.process.wrap"><EngagementProcess /></Hide>

      <Hide id="why.core.wrap"><CoreSolutions /></Hide>

      <Hide id="why.main.wrap"><WhyLRBC /></Hide>

      <FooterSection />
    </div>
  );
}
