// =============================================================================
// LRBC — Move Engagement Process, Core Solutions, Why LRBC off the home page
// into a new "Why LRBC" tab/page.
// Run: node create-why-lrbc-page.js
//
// 1. app/page.tsx    — removes the 3 sections + their imports from Home
// 2. app/why-lrbc/page.tsx — NEW page containing exactly those 3 sections,
//    with its own hero (matching the style of About/LekhaSetu pages)
// 3. components/header.tsx — adds "Why LRBC" to the nav menu, linking to
//    /why-lrbc, right after "About"
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
  fs.copyFileSync(abs, abs + '.bak5');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + label);
  return true;
}

function write(rel, content) {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak5');
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  written: ' + rel);
}

console.log('-- 1. remove sections from Home --');

patch('app/page.tsx',
  `import NewHeroSection from "@/components/new-components/new-hero";
import EngagementProcess from "@/components/engagement-process";
import CoreSolutions from "@/components/core-solutions";
import WhyLRBC from "@/components/why-lrbc";`,
  `import NewHeroSection from "@/components/new-components/new-hero";`,
  'page.tsx: remove imports');

patch('app/page.tsx',
  `      <FeaturesSection />

      <EngagementProcess />

      <CoreSolutions />

      <TestimonialsSection />

      <WhyLRBC />

      <ProductSection />`,
  `      <FeaturesSection />

      <TestimonialsSection />

      <ProductSection />`,
  'page.tsx: remove sections from render');

console.log('');
console.log('-- 2. create app/why-lrbc/page.tsx --');

write('app/why-lrbc/page.tsx', `"use client";

import { HeroHeader } from "@/components/header";
import NewHeroSection from "@/components/new-components/new-hero";
import EngagementProcess from "@/components/engagement-process";
import CoreSolutions from "@/components/core-solutions";
import WhyLRBC from "@/components/why-lrbc";
import ContactSection2 from "@/components/ContactSection2";
import FooterSection from "@/components/footer-section";

export default function WhyLRBCPage() {
  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />

      <NewHeroSection
        title={
          <h1 className="mx-auto max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl xl:text-[5.25rem]">
            <span className="overflow-hidden">Why Businesses</span>
            <span className="overflow-hidden">Choose LRBC.</span>
          </h1>
        }
        subtitle={
          <p className="mx-auto max-w-2xl text-center text-lg">
            How we work, what we build, and why it holds up as you scale.
          </p>
        }
        buttonText="Request a demo"
        buttonHref="/contact"
        badgeText="Why LRBC"
      />

      <EngagementProcess />

      <CoreSolutions />

      <WhyLRBC />

      <ContactSection2 />

      <FooterSection />
    </div>
  );
}
`);

console.log('');
console.log('-- 3. add "Why LRBC" to header nav --');

patch('components/header.tsx',
  `const menuItems = [
    { name: 'About', href: '/about' },
    { name: 'LekhaSetu', href: '/lekhasetu' },
    { name: 'Testimonials', href: '/testimonials-case-studies' },
    { name: 'Contact', href: '/contact' },`,
  `const menuItems = [
    { name: 'About', href: '/about' },
    { name: 'Why LRBC', href: '/why-lrbc' },
    { name: 'LekhaSetu', href: '/lekhasetu' },
    { name: 'Testimonials', href: '/testimonials-case-studies' },
    { name: 'Contact', href: '/contact' },`,
  'header.tsx: add Why LRBC nav item');

// ─────────────────────────────────────────────────────────────────────────────
console.log('');
console.log('-- verification --');
const checks = [
  ['app/page.tsx',            'EngagementProcess',   'absent from page.tsx', true],
  ['app/page.tsx',            'CoreSolutions',        'absent from page.tsx', true],
  ['app/page.tsx',            'WhyLRBC',              'absent from page.tsx', true],
  ['app/why-lrbc/page.tsx',   '<EngagementProcess />', 'present in new page', false],
  ['app/why-lrbc/page.tsx',   '<CoreSolutions />',     'present in new page', false],
  ['app/why-lrbc/page.tsx',   '<WhyLRBC />',           'present in new page', false],
  ['components/header.tsx',  "{ name: 'Why LRBC', href: '/why-lrbc' }", 'nav item added', false],
];

let ok = true;
checks.forEach(([f, needle, label, shouldBeAbsent]) => {
  const abs = path.join(root, f);
  if (!fs.existsSync(abs)) { console.error('  MISSING FILE: ' + f); ok = false; return; }
  const c = fs.readFileSync(abs, 'utf8');
  const has = c.includes(needle);
  if (shouldBeAbsent ? !has : has) console.log('  ok  ' + label);
  else { console.error('  FAIL  ' + label); ok = false; }
});

if (!ok || failures > 0) { console.log('Some patches did not apply — check warnings above.'); process.exit(1); }

console.log('');
console.log('============================================================');
console.log('  Done. Hot reload picks it up. If stale:');
console.log('    Remove-Item -Recurse -Force .next');
console.log('    pnpm dev');
console.log('');
console.log('  Home page: Engagement Process, Core Solutions, and Why LRBC');
console.log('  are removed. Home now flows: Hero -> ERP dashboard ->');
console.log('  Features -> Testimonials -> Products -> FAQs -> Contact.');
console.log('');
console.log('  New tab "Why LRBC" (/why-lrbc) in the nav bar, right after');
console.log('  "About", containing exactly those 3 sections with its own');
console.log('  hero, contact section, and footer.');
console.log('============================================================');
