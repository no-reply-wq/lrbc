import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import FooterSection from "@/components/footer-section";
import CursorTrail from "@/components/CursorTrail";
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

export const metadata: Metadata = {
  title: "Custom ERP & Business Automation Consulting | LRBC",
  description: "LRBC builds custom ERP & automation systems that turn chaotic, person-dependent businesses into scalable profit centers — with hands-on implementation support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable}`}>
      <head>
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

          <WhatsAppFloat />

          <TooltipProvider>
            {children}
          </TooltipProvider>

        </ThemeProvider>

      </body>
    </html>
  );
}