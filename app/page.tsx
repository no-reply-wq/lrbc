"use client";

import ProductsShowcase from "@/components/products-showcase/ProductsShowcase";
import TestimonialsSection from "@/components/testimonials-section";
import FAQs from "@/components/faq";
import TeamSection from "@/components/team";
import FooterSection from "@/components/footer-section";
import { HeroHeader } from "@/components/header";
import Transformation from "@/components/transformation";
import ContactSection2 from "@/components/ContactSection2";
import HeroChecklist from "@/components/new-components/hero-checklist";
import BrochureDownload from "@/components/BrochureDownload";
import { Et } from "@/components/cms/editable";
import NewHeroSection from "@/components/new-components/new-hero";

export default function LandingPage() {
  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />

      <NewHeroSection
        title={
          <h1 className="mx-auto max-w-5xl flex flex-col text-center lg:text-left text-4xl max-md:font-bold md:text-5xl xl:text-6xl">
            <span className="overflow-hidden lrbc-clip-safe"><Et id="home.hero.l1" def="Better Systems." reload /></span>
            <span className="overflow-hidden lrbc-clip-safe"><Et id="home.hero.l2" def="Better Business." reload /></span>
          </h1>
        }
        subtitle={
          <span className="flex flex-col items-center lg:items-start gap-1 text-center lg:text-left">
            <span className="italic"><Et id="home.hero.quote" def="“Simplicity is the most difficult thing to secure in this world.”" reload /></span>
            <span className="block text-sm text-right lg:text-left pr-6 sm:pr-12 lg:pr-0 mt-1 opacity-70"><Et id="home.hero.author" def="— George Sand" reload /></span>
          </span>
        }
        buttonText="See How We Can Help"
        buttonHref="/contact"
        badgeText="Lean Resource Business Consulting Private Limited"
        cmsId="home.hero"
        aside={<HeroChecklist />}
        secondaryAction={<BrochureDownload source="Home hero" />}
      />

      <ProductsShowcase />

      <TestimonialsSection />

      <Transformation />

      <FAQs />

      <ContactSection2 />

      <FooterSection />
    </div>
  );
}
