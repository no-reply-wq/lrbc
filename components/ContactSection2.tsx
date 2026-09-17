"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import SectionBadge from "./section-badge";
import { ContactForm } from "@/components/ContactForm";
import { useFadeUp } from "@/components/ui/use-scroll-animation";

export default function ContactSection2() {
  const ref = useFadeUp()
  return (
    <section ref={ref} className="relative py-8 md:py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid items-start gap-10 lg:gap-20 lg:grid-cols-2">

          {/* LEFT */}
          <div className="max-w-md">
            <h2 className="lrbc-anim text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              Get in touch
            </h2>
            <p className="lrbc-anim lrbc-anim-d1 text-muted-foreground mt-6 text-lg leading-8">
              Have a question or want to work together?
              Fill out the form and we'll get back to you as soon as possible.
            </p>

            <div className="mt-6 md:mt-10 space-y-6 md:space-y-8">
              <div className="lrbc-anim lrbc-anim-d1 flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
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
                <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
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
                <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Head Office</p>
                  <p className="mt-1 text-xs leading-8">
                    7th Floor, Pranava Business Park, Gachibowli - Miyapur Rd,<br />
                    Kothaguda, Hyderabad, Telangana 500084
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Corporate Office</p>
                  <p className="mt-1 text-xs leading-8">
                    Plot no, 24, Shanti Nagar, Kompally,<br />
                    Hyderabad, Telangana 500100
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT / FORM */}
          <div className="lrbc-anim lrbc-anim-d2 overflow-y-auto pr-1 max-h-[65vh] lg:sticky lg:top-24 lg:max-h-[70vh] [scrollbar-width:thin] [scrollbar-color:oklch(var(--primary)/0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/35">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
