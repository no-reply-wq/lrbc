import NewHero from "@/components/new-components/new-hero";
import CoreSolutions from "@/components/core-solutions";
import WhyLrbc from "@/components/why-lrbc";
import NumbersThatSpeak from "@/components/numbers-that-speak";
import LekhaSetuHero from "@/components/LekhaSetuHero";
import TestimonialsSection from "@/components/testimonials-section";
import FAQ from "@/components/faq";
import ContactSection2 from "@/components/ContactSection2";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <NewHero />
      <CoreSolutions />
      <WhyLrbc />
      <LekhaSetuHero />
      <NumbersThatSpeak />
      <TestimonialsSection />
      <FAQ />
      <ContactSection2 />
    </main>
  );
}
