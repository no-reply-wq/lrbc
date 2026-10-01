"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import SectionBadge from "./section-badge";
import { ContactForm } from "@/components/ContactForm";
import { useFadeUp } from "@/components/ui/use-scroll-animation";

export default function ContactSection2() {
  const ref = useFadeUp()
  return (
    <section ref={ref} className="relative py-8 md:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-20">

          {/* LEFT */}
          <div className="min-w-0 max-w-md">
            <h2 className="lrbc-anim text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              Get in touch
            </h2>
            <p className="lrbc-anim lrbc-anim-d1 text-muted-foreground mt-4 text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8">
              Have a question or want to work together?
              Fill out the form and we'll get back to you as soon as possible.
            </p>

            <div className="mt-6 md:mt-10 space-y-6 md:space-y-8">
              <div className="lrbc-anim lrbc-anim-d1 flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <a href="mailto:contact@lrbc.ai"
                    className="mt-1 block text-sm font-medium transition-colors hover:text-primary py-1">
                    contact@lrbc.ai
                  </a>
                </div>
              </div>

              <div className="lrbc-anim lrbc-anim-d2 flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Phone</p>
                  <a href="tel:+919954953008"
                    className="mt-1 block text-sm font-medium transition-colors hover:text-primary py-1">
                    +91-9954953008
                  </a>
                </div>
              </div>

              <div className="lrbc-anim lrbc-anim-d3 flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-sm">Head Office</p>
                    <p className="mt-1 text-[13px] leading-6 sm:text-xs sm:leading-7">
                      7th Floor, Pranava Business Park, Gachibowli - Miyapur Rd, Kothaguda, Hyderabad, Telangana 500084
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-sm">Corporate Office</p>
                    <p className="mt-1 text-[13px] leading-6 sm:text-xs sm:leading-7">
                      Plot no, 24, Shanti Nagar, Kompally, Hyderabad, Telangana 500100
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT / FORM */}
          <div className="lrbc-anim lrbc-anim-d2 min-w-0 lg:sticky lg:top-24 [scrollbar-width:thin] [scrollbar-color:oklch(var(--primary)/0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/35">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
