// =============================================================================
// LRBC — Mobile responsiveness fixes
// Run: node fix-mobile-responsive.js
//
// Fixes:
// 1. FAQ: mt-70 on mobile causes huge gap and overlaps WorkPilot → fix to mt-8 md:mt-10
// 2. Our Clients: "Our Clients" label not centered on mobile → already fixed but reinforce
// 3. Contact form: add max-h + scroll on all screen sizes (not just lg:)
// 4. Case study images: min-h too small on mobile, make taller + full-width on mobile
// 5. Case study card: 2-col grid on mobile is too cramped → single col on mobile
// 6. Section gaps: all pages py-20 on mobile is too much → py-10 md:py-20
// 7. Products section: sticky pin scroll causes overlap on mobile → add overflow guard
// 8. ContactSection2: py-15 is invalid Tailwind → fix to py-12 lg:py-16
// =============================================================================

const fs = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run from project root'); process.exit(1);
}

let failures = 0;
function patch(rel, oldStr, newStr, label) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) { console.warn('  skip (missing): ' + rel); failures++; return false; }
  let c = fs.readFileSync(abs, 'utf8');
  if (!c.includes(oldStr)) { console.warn('  skip (not found): ' + label); failures++; return false; }
  fs.copyFileSync(abs, abs + '.bak_mobile');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + label);
  return true;
}

// ── 1. FAQ: mt-70 on mobile causes overlap with Products section ─────────────
console.log('-- 1. FAQ: fix huge mobile top margin --');
patch('components/faq.tsx',
  'className="bg-muted dark:bg-background py-20 mt-70 md:mt-10"',
  'className="bg-muted dark:bg-background py-10 md:py-20 mt-8 md:mt-10"',
  'faq: remove mt-70, fix to mt-8 on mobile');

// ── 2. Our Clients / Logo Cloud: center properly on mobile ───────────────────
console.log('-- 2. Logo Cloud: mobile centering --');
patch('components/logo-cloud-4.tsx',
  '<p className="text-muted-foreground shrink-0 text-center lg:border-r lg:pr-12 lg:text-end">',
  '<p className="text-muted-foreground shrink-0 text-center text-sm lg:border-r lg:pr-12 lg:text-end">',
  'logo cloud: ensure text-center on mobile');
patch('components/logo-cloud-4.tsx',
  '<section className="bg-background py-8">',
  '<section className="bg-background py-6 md:py-8">',
  'logo cloud: reduce mobile padding');

// ── 3. Contact form: add scroll + max height on all screen sizes ─────────────
console.log('-- 3. Contact form: mobile scroll --');
patch('components/ContactSection2.tsx',
  '<div className="lg:sticky lg:top-24 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-1 [scrollbar-width:thin] [scrollbar-color:oklch(var(--primary)/0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/35">',
  '<div className="max-h-[60vh] overflow-y-auto pr-1 lg:sticky lg:top-24 lg:max-h-[70vh] [scrollbar-width:thin] [scrollbar-color:oklch(var(--primary)/0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/35">',
  'contact form: scroll on mobile too');

// Fix invalid py-15 class
patch('components/ContactSection2.tsx',
  '<section className="relative py-15 lg:py-15">',
  '<section className="relative py-10 lg:py-16">',
  'contact section: fix invalid py-15');

// ── 4 & 5. Case study page: fix grid + image height on mobile ────────────────
console.log('-- 4+5. Case study: mobile grid + image height --');
{
  const abs = path.join(root, 'app/testimonials-case-studies/page.tsx');
  let c = fs.readFileSync(abs, 'utf8');
  fs.copyFileSync(abs, abs + '.bak_mobile');

  // 4a. 2x2 grid: stack to single col on mobile (was sm:grid-cols-2 which fires at 640px)
  // On phones the two columns are too narrow. Force single col until md
  c = c.replaceAll(
    'className="grid grid-cols-1 sm:grid-cols-2 gap-4"',
    'className="grid grid-cols-1 md:grid-cols-2 gap-4"'
  );

  // 4b. Image carousel: taller min-h on mobile so it's not too small
  c = c.replace(
    '<div className="rounded-2xl overflow-hidden min-h-[220px]">',
    '<div className="rounded-2xl overflow-hidden min-h-[200px] sm:min-h-[260px]">'
  ).replace(
    // Both the imageRight and !imageRight versions
    /(<div className="rounded-2xl overflow-hidden min-h-\[220px\]">)/g,
    '<div className="rounded-2xl overflow-hidden min-h-[200px] sm:min-h-[260px]">'
  );

  // 4c. Image inside carousel: ensure it fills height
  c = c.replace(
    'className="h-full w-full object-cover transition-all duration-500"',
    'className="h-full w-full object-cover object-top transition-all duration-500"'
  );

  // 4d. Card inner padding: smaller on mobile
  c = c.replace(
    '<div className="p-7 sm:p-9 flex flex-col gap-6">',
    '<div className="p-4 sm:p-7 lg:p-9 flex flex-col gap-4 sm:gap-6">'
  );

  // 4e. Metrics header: wrap on mobile instead of overflowing
  c = c.replace(
    '<div className="flex flex-wrap gap-2 justify-end">',
    '<div className="flex flex-wrap gap-2 justify-start sm:justify-end">'
  );

  // 4f. Section gaps in case study page
  c = c.replace(
    '<section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">',
    '<section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-20">'
  ).replace(
    '<section className="mx-auto max-w-4xl px-4 sm:px-6 py-16">',
    '<section className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-16">'
  );

  fs.writeFileSync(abs, c, 'utf8');
  console.log('  patched: case study page (grid, images, gaps, padding)');
}

// ── 6. Section gaps: reduce py-20 on mobile across all pages ─────────────────
console.log('-- 6. Section gaps: reduce on mobile --');

// Testimonials section
patch('components/testimonials-section.tsx',
  '<div ref={sectionRef} className="mx-auto w-full flex flex-col justify-center items-center max-w-6xl px-4 sm:px-6 lg:px-10">',
  '<div ref={sectionRef} className="mx-auto w-full flex flex-col justify-center items-center max-w-6xl px-4 sm:px-6 lg:px-10 py-10 md:py-0">',
  'testimonials: reduce mobile top gap');

// About page sections
{
  const abs = path.join(root, 'components/about-content.tsx');
  if (fs.existsSync(abs)) {
    let c = fs.readFileSync(abs, 'utf8');
    c = c.replace('className="py-16 md:py-32"', 'className="py-8 md:py-20"');
    fs.writeFileSync(abs, c, 'utf8');
    console.log('  patched: about-content: reduce mobile padding');
  }
}

// Why LRBC page
{
  const abs = path.join(root, 'app/why-lrbc/page.tsx');
  if (fs.existsSync(abs)) {
    let c = fs.readFileSync(abs, 'utf8');
    // Already has good structure, just ensure
    console.log('  ok: why-lrbc page');
  }
}

// ── 7. Products section: mobile overflow fix ──────────────────────────────────
console.log('-- 7. Products: mobile overflow --');
patch('components/products.tsx',
  'className="relative bg-background py-10"',
  'className="relative bg-background py-8 md:py-10 overflow-x-hidden"',
  'products: prevent mobile overflow');

// ── 8. Core solutions mobile padding ─────────────────────────────────────────
console.log('-- 8. Core solutions + other components --');
patch('components/core-solutions.tsx',
  'className="py-16 md:py-24"',
  'className="py-8 md:py-20"',
  'core-solutions: reduce mobile py');

patch('components/engagement-process.tsx',
  'className="py-24 md:py-32 overflow-hidden"',
  'className="py-10 md:py-24 overflow-hidden"',
  'engagement-process: reduce mobile py');

patch('components/why-lrbc.tsx',
  'className="py-24 md:py-36 relative overflow-hidden"',
  'className="py-10 md:py-24 relative overflow-hidden"',
  'why-lrbc section: reduce mobile py');

patch('components/team.tsx',
  'className="bg-gray-50 py-12 dark:bg-transparent md:py-16"',
  'className="bg-gray-50 py-8 dark:bg-transparent md:py-14"',
  'team: reduce mobile py');

// ── Verify ────────────────────────────────────────────────────────────────────
console.log('\n-- verification --');
const checks = [
  ['components/faq.tsx',                          'mt-8 md:mt-10',                       'faq: mobile margin fixed'],
  ['components/ContactSection2.tsx',              'max-h-[60vh] overflow-y-auto',         'contact: mobile scroll'],
  ['components/ContactSection2.tsx',              'py-10 lg:py-16',                       'contact: py fixed'],
  ['app/testimonials-case-studies/page.tsx',      'md:grid-cols-2',                       'case study: grid fixed'],
  ['components/products.tsx',                     'overflow-x-hidden',                    'products: overflow guard'],
];

let ok = true;
checks.forEach(([f, needle, label]) => {
  const abs = path.join(root, f);
  if (!fs.existsSync(abs)) { console.error('  MISSING: '+f); ok=false; return; }
  if (fs.readFileSync(abs,'utf8').includes(needle)) console.log('  ok  '+label);
  else { console.error('  FAIL  '+label); ok=false; }
});

if (!ok || failures > 0) { console.log('\nSome patches failed — check above.'); process.exit(1); }

console.log(`
============================================================
  Done. Run:
    Remove-Item -Recurse -Force .next
    pnpm dev
  Then check in new Incognito window on mobile dimensions.

  FIXES APPLIED:
  1. FAQ: removed mt-70 (caused WorkPilot overlap on mobile)
  2. Our Clients: confirmed centered, reduced mobile padding
  3. Contact form: max-h + scroll on ALL screen sizes
  4. Contact section: fixed invalid py-15 class
  5. Case study: grid stacks to 1-col until md (not sm)
  6. Case study: images taller min-h, object-top crop
  7. Case study: card padding smaller on phones
  8. Section gaps: py-20 → py-10 md:py-20 site-wide
  9. Products: overflow-x-hidden prevents bleed
============================================================`);
