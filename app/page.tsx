"use client";

import ContentSection from "@/components/content-section";
import TestimonialsSection from "@/components/testimonials-section";
import FAQs from "@/components/faq";
import TeamSection from "@/components/team";
import FooterSection from "@/components/footer-section";
import { HeroHeader } from "@/components/header";
import ProductSection from "@/components/products";
import ContactSection2 from "@/components/ContactSection2";
import NewHeroSection from "@/components/new-components/new-hero";

export default function LandingPage() {
  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />

      <NewHeroSection
        title={
          <h1 className="mx-auto max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl xl:text-[5.25rem]">
            <span className="overflow-hidden">Better Systems.</span>
            <span className="overflow-hidden">Better Business.</span>
          </h1>
        }
        subtitle={
          <span className="flex flex-col items-center gap-1 text-center">
            <span className="italic">&ldquo;Simplicity is the most difficult thing to secure in this world.&rdquo;</span>
            <span className="block text-sm text-right pr-6 sm:pr-12 mt-1 opacity-70">— George Sand</span>
          </span>
        }
        buttonText="Request a demo"
        buttonHref="/contact"
        badgeText="Lean Resource Business Consulting Private Limited"
      />

      <ContentSection />

      <TestimonialsSection />

      <ProductSection />

      <FAQs />

      <ContactSection2 />

      <FooterSection />
    </div>
  );
}
