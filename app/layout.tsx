import type React from "react";
import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import FooterSection from "@/components/footer-section";
import SplashCursor from "@/components/SplashCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "LRBC - Creating systems to scale your business.",
  description:
    "Streamline your billing process with seamless automation for every custom contract, tailored by Brillance.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Global Splash Cursor */}
          <SplashCursor
            DENSITY_DISSIPATION={5}
            VELOCITY_DISSIPATION={4}
            PRESSURE={0.1}
            CURL={3}
            SPLAT_RADIUS={0.12}
            SPLAT_FORCE={2500}
            COLOR_UPDATE_SPEED={5}
            SHADING
            RAINBOW_MODE={false}
            COLOR="#5B21B6"
          />

          <TooltipProvider>
            {children}
          </TooltipProvider>

        </ThemeProvider>

      </body>
    </html>
  );
}