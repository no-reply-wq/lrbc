"use client"
import React from "react";

import { Logo } from "@/components/logo";
import Link from "next/link"
import MoltenMetal from "@/components/new-components/MoltenMetal";
import MagneticButton from "@/components/MagneticButton"
import SpotlightIcon from "@/components/SpotlightIcon";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { Et, Lnk, Hide } from "@/components/cms/editable";

const links = [
  {
    group: "Product",
    items: [
      { title: "LekhaSetu", href: "/lekhasetu" },
      { title: "WorkPilot", href: "/workpilot" },
      { title: "Mini ERP", href: "/mini-erp" },
      { title: "Custom ERP", href: "/custom-erp" },
    ],
  },
  {
    group: "Industry",
    items: [
      { title: "Plastic Manufacture", href: "/testimonials-case-studies?industry=plastic" },
      { title: "Woven Manufacture", href: "/testimonials-case-studies?industry=woven" },
      { title: "Kitchenware", href: "/testimonials-case-studies?industry=kitchenware" },
      { title: "Digital Marketing", href: "/testimonials-case-studies?industry=digital-marketing" },
    ],
  },
  {
    group: "Company",
    items: [
      { title: "About Us", href: "/about" },
      { title: "Contact", href: "/contact" },
      { title: "Why LRBC", href: "/why-lrbc" },
      { title: "Case Study", href: "/testimonials-case-studies" },
    ],
  },
  {
    group: "Legal",
    items: [
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Terms of Use", href: "/terms-of-use" },
      { title: "Cookie Policy", href: "/privacy-policy#cookies" },
      { title: "Acceptable Use", href: "/terms-of-use#acceptable-use-policy" },
      { title: "Your Data Rights", href: "/privacy-policy#your-rights" },
    ],
  },
];

export default function FooterSection() {
  return (
    <footer className="relative overflow-hidden border-b bg-background">
      {/* =========================================================
          BACKGROUND IMAGE
          ========================================================= */}

      <div className="absolute inset-x-0 top-0 h-[620px] overflow-hidden" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', overflow: 'hidden' }}>
        {/* Same animated background as the landing-page hero, light + dark */}
        <div className="absolute inset-0">
          <MoltenMetal
            color1="#5227FF" color2="#FF9FFC" color3="#FFFFFF"
            speed={0.35} scale={4} detail={3} glow={1.6} coreSize={0.1}
            swirl={1} fold={-0.2} blackPoint={0.05} brightness={1.3}
            colorMode="molten" grain grainIntensity={0.05}
            mouseInteraction={false} opacity={1}
          />
        </div>

        {/* Gradient / fade over video in dark */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-b
            from-background/10
            via-background/60
            to-background
          "
        />
      </div>

      {/* =========================================================
          FOOTER CONTENT
          ========================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
          px-6
          pt-10
          pb-6
          md:pt-14
        "
      >
        {/* =======================================================
            MAIN FOOTER CARD
            ======================================================= */}

        <div
          className="
            relative
            z-20
            rounded-3xl
            border
            border-primary/15
            bg-background/70
            max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:shadow-none max-sm:backdrop-blur-none
            px-0 sm:px-6
            py-4 sm:py-9
            shadow-xl
            shadow-primary/10
            backdrop-blur-md
            md:px-12
            md:py-12
          "
        >
          <div
            className="
              grid
              grid-cols-1
              max-sm:grid-cols-3 max-sm:gap-x-4 max-sm:gap-y-8
              gap-8
              md:gap-10
              md:grid-cols-[1fr_3fr]
              md:gap-x-10
              lg:gap-x-16
            "
          >
            {/* =================================================
                LOGO + COMPANY DESCRIPTION
                ================================================= */}

            <div
              className="
                flex
                flex-col
                items-start
                text-left
                max-sm:col-span-2
                sm:items-center
                sm:text-center
                md:items-start
                md:text-left
              "
            >
              <Link
                href="/"
                aria-label="Go home"
                className="
                  inline-flex
                  items-center
                  transition-opacity
                  duration-200
                  hover:opacity-90
                "
              >
                {/* Existing LRBC Logo Component */}
                <Logo />
              </Link>

              {/* Company Description */}
              
            </div>

            {/* =================================================
                FOOTER LINKS
                ================================================= */}

            <div
              className="
                max-sm:contents
                sm:grid
                sm:grid-cols-4
                sm:gap-x-8
                sm:gap-y-9
                sm:border-t sm:border-border/50 sm:pt-8 md:border-0 md:pt-0
              "
            >
              {links.map((link, gi) => (
                <Hide key={link.group} id={`footer.col.${gi}`}>
                <div
                  className="min-w-0 space-y-3 text-[13px] sm:space-y-5 sm:text-sm"
                >
                  {/* Section Title */}
                  <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] sm:text-xs sm:tracking-[0.16em] text-foreground">
                    <Et id={`footer.col.${gi}.title`} def={link.group} />
                    <span aria-hidden className="mt-2 block h-0.5 w-6 rounded-full bg-gradient-to-r from-[#5227FF] to-[#d946ef]" />
                  </span>

                  {/* Section Links */}
                  <div className="space-y-0.5 sm:space-y-3.5">
                    {link.items.map((item, ii) => (
                      <Hide key={item.title} id={`footer.col.${gi}.item.${ii}`}>
                      <Lnk
                        id={`footer.col.${gi}.item.${ii}.href`}
                        href={item.href}
                        labelId={`footer.col.${gi}.item.${ii}.label`}
                        label={item.title}
                        className="
                          block
                          py-1
                          leading-snug
                          sm:py-0
                          text-muted-foreground
                          transition-all
                          duration-200
                          hover:translate-x-0.5
                          hover:text-primary
                        "
                      />
                      </Hide>
                    ))}
                  </div>
                </div>
                </Hide>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM FOOTER
            ========================================================= */}

        <div
          className="
            mt-6
            flex
            flex-col
            items-center
            gap-4
            border-t
            border-border/50
            pb-2
            pt-5
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* Copyright */}

          <span
            className="
              text-center
              text-sm
              text-muted-foreground
              md:text-left
            "
          >
            <Et id="footer.copyright" def="© 2026 LRBC, All rights reserved" />
          </span>

          {/* =====================================================
              SOCIAL LINKS
              ===================================================== */}
          {/* Social icons */}
          <div className="flex items-center justify-center gap-4">

            <SpotlightIcon href={SOCIAL_LINKS.linkedin} label="LinkedIn" glowColor="80,40,240">
              <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"/>
              </svg>
            </SpotlightIcon>

            <SpotlightIcon href={SOCIAL_LINKS.instagram} label="Instagram" glowColor="160,0,240">
              <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10m0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6"/>
              </svg>
            </SpotlightIcon>

            <SpotlightIcon href={SOCIAL_LINKS.facebook} label="Facebook" glowColor="15,93,255">
              <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"/>
              </svg>
            </SpotlightIcon>

            {SOCIAL_LINKS.youtube && (
              <SpotlightIcon href={SOCIAL_LINKS.youtube} label="YouTube" glowColor="240,30,30">
                <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/>
                </svg>
              </SpotlightIcon>
            )}

          </div>

        </div>
      </div>
    </footer>
  );
}