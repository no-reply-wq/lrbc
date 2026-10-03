import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import FooterSection from "@/components/footer-section";
import CursorTrail from "@/components/CursorTrail";
import MagneticAll from "@/components/MagneticAll";
import WhatsAppFloat from "@/components/whatsapp-float";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://lrbc.ai";
const TITLE = "Custom ERP & Business Automation Solutions for MSMEs | LRBC";
const DESCRIPTION =
  "LRBC helps MSMEs simplify business operations with custom ERP and business automation solutions that connect teams, workflows, data and decisions in one system.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | LRBC" },
  description: DESCRIPTION,
  applicationName: "LRBC",
  authors: [{ name: "Lean Resource Business Consulting Private Limited", url: SITE_URL }],
  creator: "LRBC",
  publisher: "Lean Resource Business Consulting Private Limited",
  keywords: [
    "custom ERP",
    "ERP for MSMEs",
    "ERP software India",
    "mini ERP",
    "cloud ERP",
    "business automation",
    "business automation software",
    "ERP implementation",
    "ERP consulting India",
    "MSME software",
    "small business ERP",
    "manufacturing ERP",
    "Tally integration",
    "Tally cloud sync",
    "Tally dashboard",
    "Tally data synchronization",
    "LekhaSetu",
    "WorkPilot",
    "attendance and task management software",
    "workflow automation",
    "inventory management software",
    "sales and purchase management",
    "multi-location ERP",
    "business process automation",
    "digital transformation for MSMEs",
    "LRBC",
    "Lean Resource Business Consulting",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "LRBC",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Lean Resource Business Consulting Private Limited",
      alternateName: "LRBC",
      url: SITE_URL,
      logo: `${SITE_URL}/images/icon.png`,
      description: DESCRIPTION,
      telephone: "+91-9954953008",
      areaServed: "IN",
      knowsAbout: ["Custom ERP", "Business automation", "Tally integration", "MSME digital transformation"],
    },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: "LRBC", description: DESCRIPTION, publisher: { "@id": `${SITE_URL}/#org` } },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HC5EJ4P8W5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HC5EJ4P8W5');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased">

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="lrbc-theme-v2"
          disableTransitionOnChange
        >
          <CursorTrail />
          <MagneticAll />

          <WhatsAppFloat />

          <TooltipProvider>
            {children}
          </TooltipProvider>

        </ThemeProvider>

      </body>
    </html>
  );
}