"use client";

import AboutUsContent from "@/components/about-content";
import ContactSection2 from "@/components/ContactSection2";
import FAQs from "@/components/faq";
import FooterSection from "@/components/footer-section";
import { HeroHeader } from "@/components/header";
import NewHeroSection from "@/components/new-components/new-hero";
import TeamSection from "@/components/team";
import { HomeIcon } from "lucide-react";
import { ERPRequestModal } from "@/components/ERPRequestModal";


export default function LandingPage() {
  return (
  <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />
    
      
      <NewHeroSection title={ <h1 className="mx-auto max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl l xl:text-[5.25rem]">
                                        <span className="overflow-hidden">Building Technology</span>
                                        <span className="overflow-hidden">Around People,</span>
                                        <span>Not Processes.</span>
                                    </h1>}
                      subtitle={<p className="mx-auto max-w-2xl text-center text-lg">
                                        Every growing business deserves software that's simple, reliable, and built around the way it works.

                                    </p>}
                        buttonText="Request a demo"
                      buttonHref="/contact"
                      badgeText="About Us"
                        />

      <AboutUsContent />
      
      
     
      <TeamSection />
    
      <FAQs />
      <ContactSection2 />
      
      <FooterSection />
   
  </div>
  );
}