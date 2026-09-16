"use client";

import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";

import SectionBadge from "./section-badge";
import { ContactForm } from "@/components/ContactForm";

export default function ContactSection2() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        

        <div className="grid items-start gap-10 lg:gap-20 lg:grid-cols-2">
          {/* LEFT */}
          <div className="max-w-md">
            <h2 className="text-5xl font-semibold tracking-tight">
              Get in touch
            </h2>

            <p className="text-muted-foreground mt-6 text-lg leading-8">
              Have a question or want to work together?
              Fill out the form and we'll get back to you
              as soon as possible.
            </p>

            <div className="mt-16 space-y-10">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                  <Mail className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">
                    Email
                  </p>

                  <a
                    href="mailto:info@lrbc.com"
                    className="mt-1 block text-xs font-medium transition-colors hover:text-primary"
                  >
                    contact@lrbc.ai
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                  <Phone className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">
                    Phone
                  </p>

                  <a
                    href="tel:+919954953008"
                    className="mt-1 block text-xs font-medium transition-colors hover:text-primary"
                  >
                    +91-9954953008
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">
                    Head Office
                  </p>

                  <p className="mt-1 text-xs leading-8">
                    7th Floor, Pranava Business Park, Gachibowli - Miyapur Rd, Landmark Residency, Serilingampalli
                    <br />
                    Kothaguda, Hyderabad, Telangana 500084
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">
                    Corporate Office
                  </p>

                  <p className="mt-1 text-xs leading-8">
                    Plot no, 24, Shanti Nagar, Kompally,
                    <br />
                    Hyderabad, Telangana 500100
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT / FORM */}
          <div className="max-h-[60vh] overflow-y-auto pr-1 lg:sticky lg:top-24 lg:max-h-[70vh] [scrollbar-width:thin] [scrollbar-color:oklch(var(--primary)/0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/35">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}