"use client";

import AboutUsContent from "@/components/about-content";
import { Et } from "@/components/cms/editable";
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
                                        <Et id="about.hero.title1" def="Building Technology" reload className="overflow-hidden" />
                                        <Et id="about.hero.title2" def="Around People," reload className="overflow-hidden" />
                                        <Et id="about.hero.title3" def="Not Processes." reload />
                                    </h1>}
                      subtitle={<Et as="p" id="about.hero.subtitle" def="Every growing business deserves software that's simple, reliable, and built around the way it works." reload className="mx-auto max-w-2xl text-center text-lg" />}
                        buttonText="See How We Can Help"
                      buttonHref="/contact"
                      badgeText="About Us"
                        cmsId="about.hero"
                        />

      <AboutUsContent />
      
      
     
      <TeamSection />
    
      <FAQs />

      <FooterSection />
   
  </div>
  );
}