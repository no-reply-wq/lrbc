// =============================================================================
// LRBC — Consistent text transitions + form/mobile spacing polish
// Run: node fix-text-form-spacing.js
//
// 1. TEXT TRANSITIONS (whole website, 9 components):
//    Every h1/h2 heading now uses ONE transition: a masked line-by-line
//    slide-up (yPercent 100, 0.8s, power3.out, stagger 0.1) instead of the
//    letter-by-letter char animation. Subtitles/paragraphs keep their ONE
//    shared fade-up line reveal. Result: uniform, professional motion.
//
//    BONUS FIX: char-split headings could not word-wrap, which forced the
//    page wider than small screens — that is exactly why the contact form
//    card was getting clipped on the right at 320px. Line-based splitting
//    wraps normally, so the mobile overflow disappears too.
//
// 2. SPACING (mobile-only additions — desktop values preserved via sm:/lg:):
//    • products section + content section side padding on phones
//    • product card: inner padding, title size, description, chip and
//      button margins get phone-sized variants (desktop unchanged)
//    • contact modal close button no longer overlaps content on phones
//    • contact form vertical rhythm slightly tighter on phones
// =============================================================================

const fs = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run this from your project root (where package.json is)');
  process.exit(1);
}

let failures = 0;
function patch(rel, oldStr, newStr, label) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) { console.warn('  skip (missing file): ' + rel); failures++; return false; }
  let c = fs.readFileSync(abs, 'utf8');
  if (!c.includes(oldStr)) {
    console.warn('  skip (pattern not found): ' + (label || rel));
    failures++;
    return false;
  }
  if (!fs.existsSync(abs + '.bak2')) fs.copyFileSync(abs, abs + '.bak2');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + (label || rel));
  return true;
}

console.log('-- 1. heading transitions -> one uniform line reveal --');

// 1a. new-hero.tsx
patch('components/new-components/new-hero.tsx',
  `const heading  = SplitText.create(headingRef.current, { type: "chars", charsClass: "char" });`,
  `const heading  = SplitText.create(headingRef.current, { type: "lines", mask: "lines" });`,
  'new-hero: split by lines');
patch('components/new-components/new-hero.tsx',
  `    tl.from(heading.chars, { yPercent: 110, opacity: 0, duration: 0.7, stagger: 0.025 }, 0.5);`,
  `    tl.from(heading.lines, { yPercent: 100, duration: 0.8, ease: "power3.out", stagger: 0.1 }, 0.5);`,
  'new-hero: heading tween');

// 1b. products.tsx
patch('components/products.tsx',
  `            type: "chars",
            mask: "chars",
        });`,
  `            type: "lines",
            mask: "lines",
        });`,
  'products: split by lines');
patch('components/products.tsx',
  `        textl.from(heading.chars, {
            yPercent: 120,
            stagger: .03,
            duration: .8,
        });`,
  `        textl.from(heading.lines, {
            yPercent: 100,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
        });`,
  'products: heading tween');

// 1c. testimonials-section.tsx
patch('components/testimonials-section.tsx',
  `        type: "chars",
        charsClass: "char",
      });`,
  `        type: "lines",
        mask: "lines",
      });`,
  'testimonials: split by lines');
patch('components/testimonials-section.tsx',
  `        heading.chars,
        {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.03,
        }`,
  `        heading.lines,
        {
          yPercent: 100,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        }`,
  'testimonials: heading tween');

// 1d. engagement-process.tsx
patch('components/engagement-process.tsx',
  `const heading = SplitText.create(headingRef.current, { type: "chars", charsClass: "char" });`,
  `const heading = SplitText.create(headingRef.current, { type: "lines", mask: "lines" });`,
  'engagement: split by lines');
patch('components/engagement-process.tsx',
  `.from(heading.chars, { yPercent: 110, opacity: 0, duration: 0.7, ease: "power4.out", stagger: 0.025 })`,
  `.from(heading.lines, { yPercent: 100, duration: 0.8, ease: "power3.out", stagger: 0.1 })`,
  'engagement: heading tween');

// 1e. core-solutions.tsx
patch('components/core-solutions.tsx',
  `const heading = SplitText.create(headingRef.current, { type: "chars", charsClass: "char" });`,
  `const heading = SplitText.create(headingRef.current, { type: "lines", mask: "lines" });`,
  'core-solutions: split by lines');
patch('components/core-solutions.tsx',
  `tl.from(heading.chars, { yPercent: 110, opacity: 0, duration: 0.7, ease: "power4.out", stagger: 0.025 })`,
  `tl.from(heading.lines, { yPercent: 100, duration: 0.8, ease: "power3.out", stagger: 0.1 })`,
  'core-solutions: heading tween');

// 1f-1h. about / contact / lekhasetu heroes (identical blocks)
['components/about-us-hero.tsx', 'components/contact-us-hero.tsx', 'components/LekhaSetuHero.tsx'].forEach((f) => {
  const short = path.basename(f, '.tsx');
  patch(f,
    `        type: "chars",
        charsClass: "char",
      });`,
    `        type: "lines",
        mask: "lines",
      });`,
    short + ': split by lines');
  patch(f,
    `        heading.chars,
        {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.03,
        }`,
    `        heading.lines,
        {
          yPercent: 100,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        }`,
    short + ': heading tween');
});

// 1i. BeliefsSection.tsx
patch('components/belief-section/BeliefsSection.tsx',
  `                type: "chars",
                charsClass: "char",
            });`,
  `                type: "lines",
                mask: "lines",
            });`,
  'beliefs: split by lines');
patch('components/belief-section/BeliefsSection.tsx',
  `            gsap.from(heading.chars, {
                yPercent: 110,
                opacity: 0,
                stagger: 0.03,
                duration: 0.8,
                ease: "power4.out",`,
  `            gsap.from(heading.lines, {
                yPercent: 100,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out",`,
  'beliefs: heading tween');

console.log('');
console.log('-- 2. spacing: mobile variants (desktop unchanged) --');

// 2a. products section side padding
patch('components/products.tsx',
  `            <div className="mx-auto max-w-6xl px-6">`,
  `            <div className="mx-auto max-w-6xl px-4 sm:px-6">`,
  'products: phone side padding');

// 2b. content-section text container side padding
patch('components/content-section.tsx',
  `                <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12 ">`,
  `                <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 md:space-y-12 ">`,
  'content-section: phone side padding');

// 2c. product card: inner padding + type scale for phones
patch('components/product-card.tsx',
  `      <CardContent className="grid h-full gap-12 p-10 lg:grid-cols-[420px_1fr] lg:p-14">`,
  `      <CardContent className="grid h-full gap-8 p-6 sm:gap-12 sm:p-10 lg:grid-cols-[420px_1fr] lg:p-14">`,
  'product card: phone padding');
patch('components/product-card.tsx',
  `            <h3 className="mt-6 text-5xl font-semibold tracking-tight">`,
  `            <h3 className="mt-4 text-4xl sm:mt-6 sm:text-5xl font-semibold tracking-tight">`,
  'product card: phone title size');
patch('components/product-card.tsx',
  `            <p className="text-muted-foreground mt-6 text-lg leading-8">`,
  `            <p className="text-muted-foreground mt-4 text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8">`,
  'product card: phone description');
patch('components/product-card.tsx',
  `            <div className="mt-10 flex flex-wrap gap-3">`,
  `            <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3">`,
  'product card: phone chip spacing');
patch('components/product-card.tsx',
  `            className="group mt-12 w-fit overflow-hidden rounded-full px-8"`,
  `            className="group mt-8 sm:mt-12 w-fit overflow-hidden rounded-full px-8"`,
  'product card: phone button margin');

// 2d. contact modal close button on phones
patch('app/contact/page.tsx',
  `              className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background/50 hover:bg-background transition-colors"`,
  `              className="absolute right-4 top-4 sm:right-6 sm:top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background/50 hover:bg-background transition-colors"`,
  'contact modal: close button position');

// 2e. contact form vertical rhythm on phones
patch('components/ContactForm.tsx',
  `        <form onSubmit={handleSubmit} className="space-y-5" noValidate>`,
  `        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>`,
  'contact form: phone rhythm');

// ─────────────────────────────────────────────────────────────────────────────
console.log('');
console.log('-- verification --');
const checks = [
  ['components/new-components/new-hero.tsx',        'heading.lines',                    'hero heading = line reveal'],
  ['components/products.tsx',                        'heading.lines',                    'products heading = line reveal'],
  ['components/testimonials-section.tsx',            'heading.lines',                    'testimonials heading = line reveal'],
  ['components/engagement-process.tsx',              'heading.lines',                    'engagement heading = line reveal'],
  ['components/core-solutions.tsx',                  'heading.lines',                    'core-solutions heading = line reveal'],
  ['components/about-us-hero.tsx',                   'heading.lines',                    'about hero = line reveal'],
  ['components/contact-us-hero.tsx',                 'heading.lines',                    'contact hero = line reveal'],
  ['components/LekhaSetuHero.tsx',                   'heading.lines',                    'lekhasetu hero = line reveal'],
  ['components/belief-section/BeliefsSection.tsx',   'heading.lines',                    'beliefs heading = line reveal'],
  ['components/products.tsx',                        'px-4 sm:px-6',                     'products phone padding'],
  ['components/content-section.tsx',                 'px-4 sm:px-6',                     'content phone padding'],
  ['components/product-card.tsx',                    'p-6 sm:gap-12 sm:p-10',            'card phone padding'],
  ['components/product-card.tsx',                    'text-4xl sm:mt-6 sm:text-5xl',     'card phone title'],
  ['app/contact/page.tsx',                           'right-4 top-4 sm:right-6',         'modal close position'],
  ['components/ContactForm.tsx',                     'space-y-4 sm:space-y-5',           'form phone rhythm'],
];

let ok = true;
checks.forEach(([f, needle, label]) => {
  const abs = path.join(root, f);
  if (!fs.existsSync(abs)) { console.error('  MISSING FILE: ' + f); ok = false; return; }
  const c = fs.readFileSync(abs, 'utf8');
  if (c.includes(needle)) console.log('  ok  ' + label);
  else { console.error('  FAIL  ' + label); ok = false; }
});

// no char animations should remain
const charFiles = [];
['components/new-components/new-hero.tsx','components/products.tsx','components/testimonials-section.tsx',
 'components/engagement-process.tsx','components/core-solutions.tsx','components/about-us-hero.tsx',
 'components/contact-us-hero.tsx','components/LekhaSetuHero.tsx','components/belief-section/BeliefsSection.tsx'
].forEach((f) => {
  const abs = path.join(root, f);
  if (fs.existsSync(abs) && fs.readFileSync(abs, 'utf8').includes('heading.chars')) charFiles.push(f);
});
if (charFiles.length) { console.error('  FAIL  char animations still present in: ' + charFiles.join(', ')); ok = false; }
else console.log('  ok  no letter-by-letter animations remain');

if (!ok || failures > 0) {
  console.log('');
  console.log('Some patches did not apply — check warnings above.');
  process.exit(1);
}

console.log('');
console.log('============================================================');
console.log('  Done. Hot reload picks it up. If anything looks stale:');
console.log('    Remove-Item -Recurse -Force .next');
console.log('    pnpm dev');
console.log('');
console.log('  TEXT: every heading site-wide now uses one uniform');
console.log('  line-by-line masked reveal; body text keeps its one');
console.log('  shared fade-up. No more letter-by-letter.');
console.log('');
console.log('  MOBILE: fixing the heading split also fixes the page');
console.log('  overflow that was clipping the contact form at 320px.');
console.log('  Product cards + form + modal get phone-sized spacing;');
console.log('  desktop paddings are unchanged (sm:/lg: preserved).');
console.log('============================================================');
