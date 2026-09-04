"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";

const links = [
  {
    group: "Product",
    items: [
      { title: "Features", href: "#" },
      { title: "Pricing", href: "#" },
    ],
  },
  {
    group: "Solution",
    items: [
      { title: "Startup", href: "#" },
      { title: "Freelancers", href: "#" },
    ],
  },
  {
    group: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Contact", href: "#" },
      { title: "Help", href: "#" },
    ],
  },
  {
    group: "Legal",
    items: [
      { title: "Privacy", href: "#" },
      { title: "Cookies", href: "#" },
      { title: "Security", href: "#" },
    ],
  },
];

export default function FooterSection() {
  return (
    <footer className="relative overflow-hidden border-b bg-background">
      {/* =========================================================
          BACKGROUND IMAGE
          ========================================================= */}

      <div className="absolute inset-x-0 top-0 h-[620px] overflow-hidden">
        <img
          src="/herobg-footerbg.avif"
          alt=""
          className="absolute inset-0 hidden h-full w-full object-cover dark:block"
        />

        {/* Gradient / fade */}
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
          pt-20
          pb-6
          md:pt-24
        "
      >
        {/* =======================================================
            MAIN FOOTER CARD
            ======================================================= */}

        <div
          className="
            relative
            z-20
            mt-16
            rounded-[2rem]
            p-7
            shadow-2xl
            backdrop-blur-md
            md:p-10
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-10
              md:grid-cols-5
              md:gap-x-12
            "
          >
            {/* =================================================
                LOGO + COMPANY DESCRIPTION
                ================================================= */}

            <div
              className="
                flex
                flex-col
                items-center
                text-center
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
                <Logo className="!h-9 !w-[180px]" />
              </Link>

              {/* Company Description */}
              
            </div>

            {/* =================================================
                FOOTER LINKS
                ================================================= */}

            <div
              className="
                grid
                grid-cols-2
                gap-x-8
                gap-y-10
                sm:grid-cols-4
                md:col-span-4
              "
            >
              {links.map((link) => (
                <div
                  key={link.group}
                  className="space-y-4 text-sm"
                >
                  {/* Section Title */}
                  <span className="block font-medium text-foreground">
                    {link.group}
                  </span>

                  {/* Section Links */}
                  <div className="space-y-3">
                    {link.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="
                          block
                          text-muted-foreground
                          transition-all
                          duration-200
                          hover:translate-x-0.5
                          hover:text-primary
                        "
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM FOOTER
            ========================================================= */}

        <div
          className="
            mt-8
            flex
            flex-col
            gap-6
            border-t
            border-border/50
            py-6
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
            © {2026} LRBC, All rights reserved
          </span>

          {/* =====================================================
              SOCIAL LINKS
              ===================================================== */}

          <div
            className="
              flex
              flex-wrap
              justify-center
              gap-6
              text-sm
            "
          >
            {/* X / Twitter */}

           

            {/* LinkedIn */}

            <Link
              href="https://www.linkedin.com/company/lrbcloud/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="
                text-muted-foreground
                transition-all
                duration-200
                hover:scale-110
                hover:text-primary
              "
            >
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                />
              </svg>
            </Link>

            {/* Facebook */}

            <Link
              href="https://www.instagram.com/lrbc.ai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="
                text-muted-foreground
                transition-all
                duration-200
                hover:scale-110
                hover:text-primary
              "
            >
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
                />
              </svg>
            </Link>

            {/* Threads */}

            

            {/* Instagram */}

            <Link
              href="https://www.instagram.com/lrbc.ai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="
                text-muted-foreground
                transition-all
                duration-200
                hover:scale-110
                hover:text-primary
              "
            >
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10m0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
                />
              </svg>
            </Link>

            {/* TikTok */}

            
          </div>
        </div>
      </div>
    </footer>
  );
}