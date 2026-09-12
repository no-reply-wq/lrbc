// =============================================================================
// LRBC — Core Solutions (Why LRBC page): unify colors, shrink text + images
// Run: node fix-core-solutions.js
//
// 1. Colors — the 3 panels used violet / blue / emerald accents. Unified to
//    the site's single primary (purple) color everywhere: icon, icon bg,
//    background gradient accent, checkmarks, and the "Live operational
//    data" badge icon.
// 2. Sizing — headings, body text, and the panel images are all reduced
//    slightly so content sits comfortably inside each block instead of
//    stretching to fill/overflow it.
//
// NOTE on Bhavya's team photo: I re-rendered your actual current code
// pixel-for-pixel (same crop math the browser uses) and the framing is
// correct — no code change needed there. What you're seeing is the same
// stale .next cache issue from earlier in this conversation. See the
// cache-clear steps printed at the end.
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
  fs.copyFileSync(abs, abs + '.bak8');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + label);
  return true;
}

console.log('-- 1. unify all 3 panel colors to site primary --');

patch('components/core-solutions.tsx',
  `    accent: "from-violet-500/10 via-transparent to-transparent",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",`,
  `    accent: "from-primary/10 via-transparent to-transparent",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",`,
  'panel 1: violet -> primary');

patch('components/core-solutions.tsx',
  `    accent: "from-blue-500/10 via-transparent to-transparent",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",`,
  `    accent: "from-primary/10 via-transparent to-transparent",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",`,
  'panel 2: blue -> primary');

patch('components/core-solutions.tsx',
  `    accent: "from-emerald-500/10 via-transparent to-transparent",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",`,
  `    accent: "from-primary/10 via-transparent to-transparent",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",`,
  'panel 3: emerald -> primary');

console.log('');
console.log('-- 2. shrink text and image sizing so content fits the block --');

patch('components/core-solutions.tsx',
  `      <div className={"relative grid gap-10 lg:grid-cols-2 lg:gap-16 items-center py-16 md:py-20 " + (s.flip ? "lg:[&>*:first-child]:order-2" : "")}>`,
  `      <div className={"relative grid gap-8 lg:grid-cols-2 lg:gap-12 items-center py-10 md:py-14 " + (s.flip ? "lg:[&>*:first-child]:order-2" : "")}>`,
  'panel: tighter gap/padding');

patch('components/core-solutions.tsx',
  `          <h3 className="text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">{s.title}</h3>`,
  `          <h3 className="text-xl font-semibold leading-tight sm:text-2xl lg:text-3xl">{s.title}</h3>`,
  'panel: smaller heading');

patch('components/core-solutions.tsx',
  `          <p className="text-muted-foreground leading-6 text-sm sm:leading-7 sm:text-base">{s.body}</p>`,
  `          <p className="text-muted-foreground leading-6 text-sm">{s.body}</p>`,
  'panel: smaller body text');

patch('components/core-solutions.tsx',
  `        <div ref={imgRef} className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-xl shadow-black/10">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            <img
              src={s.image}
              alt={s.imageAlt}
              className="w-full h-64 sm:h-80 object-cover"
            />`,
  `        <div ref={imgRef} className="relative max-w-md mx-auto lg:max-w-full">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-xl shadow-black/10">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            <img
              src={s.image}
              alt={s.imageAlt}
              className="w-full h-44 sm:h-56 lg:h-64 object-cover"
            />`,
  'panel: smaller image, capped max-width');

// ─────────────────────────────────────────────────────────────────────────────
console.log('');
console.log('-- verification --');
const checks = [
  ['components/core-solutions.tsx', 'text-violet-500',   'no more violet',  true],
  ['components/core-solutions.tsx', 'text-blue-500',     'no more blue',    true],
  ['components/core-solutions.tsx', 'text-emerald-500',  'no more emerald', true],
  ['components/core-solutions.tsx', 'bg-violet-500',      'no more violet bg', true],
  ['components/core-solutions.tsx', 'bg-blue-500',        'no more blue bg',   true],
  ['components/core-solutions.tsx', 'bg-emerald-500',     'no more emerald bg',true],
  ['components/core-solutions.tsx', 'text-xl font-semibold leading-tight sm:text-2xl', 'heading smaller', false],
  ['components/core-solutions.tsx', 'h-44 sm:h-56 lg:h-64', 'image smaller', false],
  ['components/core-solutions.tsx', 'max-w-md mx-auto lg:max-w-full', 'image width capped', false],
];

let ok = true;
checks.forEach(([f, needle, label, shouldBeAbsent]) => {
  const abs = path.join(root, f);
  const c = fs.readFileSync(abs, 'utf8');
  const has = c.includes(needle);
  if (shouldBeAbsent ? !has : has) console.log('  ok  ' + label);
  else { console.error('  FAIL  ' + label); ok = false; }
});

if (!ok || failures > 0) { console.log('Some patches did not apply — check warnings above.'); process.exit(1); }

console.log('');
console.log('============================================================');
console.log('  Done. Hot reload picks it up.');
console.log('');
console.log('  1. All 3 Core Solutions panels now use ONE color: your');
console.log('     site primary purple — icon, icon background, checkmarks,');
console.log('     eyebrow text, and the "Live operational data" badge.');
console.log('     No more violet/blue/emerald mix.');
console.log('');
console.log('  2. Headings, body text, and images are all sized down so');
console.log('     content comfortably fits inside each block.');
console.log('');
console.log('  ABOUT BHAVYA PHOTO — no code change was needed, it is');
console.log('  already correct. I rendered your exact current crop');
console.log('  settings pixel-for-pixel and it frames her properly.');
console.log('  Please run this EXACT sequence before checking again:');
console.log('');
console.log('    1. Ctrl+C in the terminal running pnpm dev');
console.log('    2. Remove-Item -Recurse -Force .next');
console.log('    3. pnpm dev');
console.log('    4. Open a brand NEW Incognito window (Ctrl+Shift+N)');
console.log('       and go to localhost:3000 there');
console.log('============================================================');
