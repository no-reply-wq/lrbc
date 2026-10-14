"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import SectionBadge from "./section-badge";
import { ContactForm } from "@/components/ContactForm";
import { Et, Hide, Lnk } from "@/components/cms/editable";
import { useFadeUp } from "@/components/ui/use-scroll-animation";

export default function ContactSection2() {
  const ref = useFadeUp()
  return (
    <Hide id="contactsec.sec">
    <section ref={ref} className="relative py-8 md:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-20">

          {/* LEFT */}
          <div className="min-w-0 max-w-md">
            <Et as="h2" id="contactsec.heading" def="Get in touch" className="lrbc-anim text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight" />
            <Et as="p" id="contactsec.intro" def="Have a question or want to work together? Fill out the form and we'll get back to you as soon as possible." className="lrbc-anim lrbc-anim-d1 text-muted-foreground mt-4 text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8" />

            <div className="mt-6 md:mt-10 space-y-6 md:space-y-8">
              <Hide id="contactsec.email">
              <div className="lrbc-anim lrbc-anim-d1 flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <Et as="p" id="contactsec.email.label" def="Email" className="text-muted-foreground text-sm" />
                  <Lnk id="contactsec.email.href" href="mailto:contact@lrbc.ai" labelId="contactsec.email.value" label="contact@lrbc.ai"
                    className="mt-1 block text-sm font-medium transition-colors hover:text-primary py-1" />
                </div>
              </div>
              </Hide>

              <Hide id="contactsec.phone">
              <div className="lrbc-anim lrbc-anim-d2 flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <Et as="p" id="contactsec.phone.label" def="Phone" className="text-muted-foreground text-sm" />
                  <Lnk id="contactsec.phone.href" href="tel:+919954953008" labelId="contactsec.phone.value" label="+91-9954953008"
                    className="mt-1 block text-sm font-medium transition-colors hover:text-primary py-1" />
                </div>
              </div>
              </Hide>

              <Hide id="contactsec.address">
              <div className="lrbc-anim lrbc-anim-d3 flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="min-w-0">
                    <Et as="p" id="contactsec.head.label" def="Head Office" className="text-muted-foreground text-sm" />
                    <Et as="p" id="contactsec.head.addr" def="7th Floor, Pranava Business Park, Gachibowli - Miyapur Rd, Kothaguda, Hyderabad, Telangana 500084" className="mt-1 text-[13px] leading-6 sm:text-xs sm:leading-7" />
                  </div>
                  <div className="min-w-0">
                    <Et as="p" id="contactsec.corp.label" def="Corporate Office" className="text-muted-foreground text-sm" />
                    <Et as="p" id="contactsec.corp.addr" def="Flat No.502, Mirra Residency, H.No.1-62/AB/24, Aurobindo Colony, Miyapur, Hyderabad, Telangana-500049" className="mt-1 text-[13px] leading-6 sm:text-xs sm:leading-7" />
                  </div>
                </div>
              </div>
              </Hide>
            </div>
          </div>

          {/* RIGHT / FORM */}
          <div className="lrbc-anim lrbc-anim-d2 min-w-0 lg:sticky lg:top-24 [scrollbar-width:thin] [scrollbar-color:oklch(var(--primary)/0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/35">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
    </Hide>
  );
}
