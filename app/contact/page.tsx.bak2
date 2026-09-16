"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ContactSection2 from "@/components/ContactSection2";
import FooterSection from "@/components/footer-section";
import { HeroHeader } from "@/components/header";
import NewHeroSection from "@/components/new-components/new-hero";
import { MessageSquare, X } from "lucide-react"; // Added X for the close button
import { ContactForm } from "@/components/ContactForm";

function ContactPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openForm = searchParams.get("openForm");
    if (openForm === "true") {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    // Clean up URL parameter without leaving the /contact page
    router.replace("/contact", { scroll: false });
  };

  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden relative">
      <HeroHeader />
      <NewHeroSection 
        title={
          <h1 className="overflow-hidden mx-auto max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl xl:text-[5.25rem]">
            <span className="overflow-hidden">Your next stage of growth<br /> starts here.</span>
          </h1>
        }
        subtitle={
          <p className="mx-auto max-w-2xl text-center text-lg overflow-hidden">
            Less time managing operations.<br /> More time building your business.
          </p>
        }
        badgeText="Contact Us"
        badgeIcon={MessageSquare} 
      />
     
      <ContactSection2 />
      <FooterSection />

      {/* CUSTOM MODAL OVERLAY - Guaranteed to work */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background/50 hover:bg-background transition-colors"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>

            {/* The Reusable Form */}
            <div className="p-1">
              <ContactForm />
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactPageContent />
    </Suspense>
  );
}