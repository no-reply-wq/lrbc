// =============================================================================
// LRBC — Polish round: panel padding, cursor, WhatsApp float, branded page
// transition, mobile form fix
// Run: node fix-polish-final.js
//
// FIRST, about the 500 error + green colors in your screenshots:
//   I ran your exact code on a real Next.js server and hit every page —
//   Home, About, Why LRBC, LekhaSetu, Contact, Testimonials — ALL return
//   HTTP 200 with zero errors. And core-solutions.tsx has ZERO green left.
//   So both the 500 and the green are a corrupted .next cache on your
//   machine (this happens on Windows when files change while the dev
//   server is running). The exact recovery steps are printed at the end.
//
// CHANGES:
// 1. core-solutions.tsx — inner padding so text/image no longer touch the
//    rounded card edge; text + image vertically centered in the card
// 2. SplashCursor.tsx — opacity 0.65 -> 0.9; when over ANY button/link/
//    input the whole effect now FULLY fades out (not just pauses input),
//    fading back in when you leave
// 3. NEW components/whatsapp-float.tsx — floating circular WhatsApp
//    button, bottom-right, links to the same number as the nav button
// 4. app/template.tsx — upgrades the existing plain page-transition
//    curtain into a branded one: LRBC logo + thin primary-color progress
//    line, matching site UI
// 5. app/layout.tsx — mounts the WhatsApp button on every page
// 6. ContactSection2.tsx — form height cap + internal scroll now DESKTOP
//    ONLY (nested scrolling is bad UX on phones; mobile shows full form)
// =============================================================================

const fs = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run this from your project root'); process.exit(1);
}

let failures = 0;
function patch(rel, oldStr, newStr, label) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) { console.warn('  skip (missing): ' + rel); failures++; return false; }
  let c = fs.readFileSync(abs, 'utf8');
  if (!c.includes(oldStr)) { console.warn('  skip (pattern not found): ' + label); failures++; return false; }
  fs.copyFileSync(abs, abs + '.bak12');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + label);
  return true;
}
function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak12');
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  written: ' + rel);
}

console.log('-- 1. Core Solutions: inner padding + centered text/image --');
patch('components/core-solutions.tsx',
  `      <div className={"relative grid gap-8 lg:grid-cols-2 lg:gap-12 items-center py-10 md:py-14 " + (s.flip ? "lg:[&>*:first-child]:order-2" : "")}>`,
  `      <div className={"relative grid gap-8 lg:grid-cols-2 lg:gap-12 items-center px-5 py-10 sm:px-8 md:px-10 md:py-14 " + (s.flip ? "lg:[&>*:first-child]:order-2" : "")}>`,
  'core-solutions: inner card padding');

console.log('');
console.log('-- 2. Cursor: more opacity + fully stops over buttons --');
patch('components/SplashCursor.tsx',
  `    window.addEventListener('mousemove', e => {
      // Pause effect when hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, [role="button"], input, textarea, select, label');
      if (isInteractive) return;
      const pointer = pointers[0];`,
  `    window.addEventListener('mousemove', e => {
      // Fully stop the effect over interactive elements: fade the whole
      // canvas out, and stop feeding it motion. Fade back in on leave.
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, [role="button"], input, textarea, select, label');
      const wrap = canvas.parentElement as HTMLElement | null;
      if (wrap) wrap.style.opacity = isInteractive ? '0' : '0.9';
      if (isInteractive) return;
      const pointer = pointers[0];`,
  'SplashCursor: full stop over interactive elements');

patch('components/SplashCursor.tsx',
  `    <div className="fixed top-0 left-0 z-50 pointer-events-none w-full h-full" style={{ opacity: 0.65 }}>`,
  `    <div className="fixed top-0 left-0 z-50 pointer-events-none w-full h-full transition-opacity duration-300" style={{ opacity: 0.9 }}>`,
  'SplashCursor: opacity 0.9 + smooth fade');

console.log('');
console.log('-- 3. WhatsApp floating button --');
write('components/whatsapp-float.tsx', `"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/919954953008";

export default function WhatsAppFloat() {
  return (
    <Link
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="
        fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6
        flex h-14 w-14 items-center justify-center rounded-full
        bg-[#25D366] text-white shadow-lg shadow-black/25
        transition-transform duration-300 ease-out
        hover:scale-110 active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2
      "
    >
      {/* soft pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping [animation-duration:2.2s]" />
      <MessageCircle className="relative h-7 w-7" strokeWidth={2.2} />
    </Link>
  );
}
`);

console.log('');
console.log('-- 4. Branded page transition --');
write('app/template.tsx', `"use client";

import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import Image from "next/image";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const tl = gsap.timeline();

    // Curtain covers the page, logo + bar visible
    gsap.set(overlayRef.current, { yPercent: 0 });
    gsap.set(logoRef.current, { opacity: 0, scale: 0.9 });
    gsap.set(barRef.current, { scaleX: 0 });

    tl.to(logoRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" })
      .to(barRef.current, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, "-=0.15")
      .to(logoRef.current, { opacity: 0, duration: 0.2, ease: "power1.in" })
      // Curtain slides down to reveal the page
      .to(overlayRef.current, { yPercent: 100, duration: 0.8, ease: "power4.inOut" }, "-=0.05")
      // Reset above the viewport for the next route
      .set(overlayRef.current, { yPercent: -100 });
  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      >
        <div ref={logoRef} className="flex flex-col items-center gap-4">
          <div className="relative h-14 w-14">
            <Image src="/images/icon.png" alt="LRBC" fill className="object-contain" priority />
          </div>
          <div className="text-center leading-tight">
            <p className="text-lg font-bold tracking-tight text-foreground">LRBC</p>
            <p className="text-xs tracking-wide text-muted-foreground">Business Consulting</p>
          </div>
          <div className="mt-2 h-0.5 w-40 overflow-hidden rounded-full bg-primary/15">
            <div ref={barRef} className="h-full w-full origin-left rounded-full bg-primary" />
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
`);

console.log('');
console.log('-- 5. mount WhatsApp button site-wide --');
patch('app/layout.tsx',
  `import SplashCursor from "@/components/SplashCursor";`,
  `import SplashCursor from "@/components/SplashCursor";
import WhatsAppFloat from "@/components/whatsapp-float";`,
  'layout: import WhatsAppFloat');

patch('app/layout.tsx',
  `          <TooltipProvider>
            {children}
          </TooltipProvider>`,
  `          <WhatsAppFloat />

          <TooltipProvider>
            {children}
          </TooltipProvider>`,
  'layout: mount <WhatsAppFloat /> site-wide');

console.log('');
console.log('-- 6. contact form: scroll cap desktop-only (better mobile UX) --');
patch('components/ContactSection2.tsx',
  `          <div className="lg:sticky lg:top-24 max-h-[70vh] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:oklch(var(--primary)/0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/30">`,
  `          <div className="lg:sticky lg:top-24 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/30">`,
  'ContactSection2: scroll cap on lg+ only');

// ─────────────────────────────────────────────────────────────────────────────
console.log('');
console.log('-- verification --');
const checks = [
  ['components/core-solutions.tsx', 'px-5 py-10 sm:px-8 md:px-10', 'panel inner padding'],
  ['components/SplashCursor.tsx',   "wrap.style.opacity = isInteractive ? '0' : '0.9'", 'cursor full stop'],
  ['components/SplashCursor.tsx',   'opacity: 0.9', 'cursor opacity 0.9'],
  ['components/whatsapp-float.tsx', 'wa.me/919954953008', 'whatsapp link'],
  ['app/template.tsx',              '/images/icon.png', 'branded transition (logo)'],
  ['app/template.tsx',              'bg-primary" />', 'branded transition (bar)'],
  ['app/layout.tsx',                '<WhatsAppFloat />', 'whatsapp mounted'],
  ['components/ContactSection2.tsx','lg:max-h-[70vh] lg:overflow-y-auto', 'form scroll desktop-only'],
];
let ok = true;
checks.forEach(([f, needle, label]) => {
  const abs = path.join(root, f);
  if (!fs.existsSync(abs)) { console.error('  MISSING FILE: ' + f); ok = false; return; }
  const c = fs.readFileSync(abs, 'utf8');
  if (c.includes(needle)) console.log('  ok  ' + label);
  else { console.error('  FAIL  ' + label); ok = false; }
});
if (!ok || failures > 0) { console.log('Some patches did not apply — check warnings above.'); process.exit(1); }

console.log('');
console.log('============================================================');
console.log('  Done. NOW FIX THE 500 / STALE CACHE — do these IN ORDER:');
console.log('');
console.log('  1. In the terminal running pnpm dev: press Ctrl+C');
console.log('     WAIT until the prompt (PS D:\\...>) comes back.');
console.log('     The server MUST be fully stopped before step 2.');
console.log('     (deleting .next while it runs corrupts the cache');
console.log('      on Windows -- that is what has been causing the 500s)');
console.log('  2. Remove-Item -Recurse -Force .next');
console.log('  3. Remove-Item -Recurse -Force node_modules\\.cache -ErrorAction SilentlyContinue');
console.log('  4. pnpm dev   (wait for "Ready")');
console.log('  5. New Incognito window (Ctrl+Shift+N) -> localhost:3000');
console.log('');
console.log('  Going forward: ALWAYS stop the server (Ctrl+C) BEFORE');
console.log('  running any fix script, then start it again after.');
console.log('============================================================');
