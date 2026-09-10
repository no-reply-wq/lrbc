// =============================================================================
// LRBC — Fix section sizing: product card image height + dashboard container
// Run: node fix-section-sizing.js
// =============================================================================

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) { console.error('Run from repo root'); process.exit(1); }
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (pkg.name !== 'lrbc') { console.error('Wrong folder'); process.exit(1); }

function patch(rel, oldStr, newStr, label) {
  const abs = path.join(root, rel);
  let c = fs.readFileSync(abs, 'utf8');
  if (!c.includes(oldStr)) { console.warn('  ⚠️  not found: ' + (label||rel)); return false; }
  fs.copyFileSync(abs, abs + '.bak');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  ✅  ' + rel + (label ? ' (' + label + ')' : ''));
  return true;
}

// =============================================================================
// 1. product-card.tsx
//    - Remove min-h constraints on image container (was making it too tall)
//    - Reduce paddingBottom from 62% → 52% (less tall image)
//    - Slightly shrink traffic light dots
// =============================================================================
patch(
  'components/product-card.tsx',
  `        {/* ── Right: product screenshot ───────────────────────────────── */}
        <div className="relative flex items-center justify-center min-h-[280px] sm:min-h-[340px]">
          {/* Glow */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />

          {/* Screenshot window */}
          <div className="relative w-full h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d] shadow-2xl">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            </div>
            {/* Image */}
            <div className="relative w-full" style={{ paddingBottom: '62%' }}>
              <Image
                src={product.image}
                alt={product.title + ' screenshot'}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>`,
  `        {/* ── Right: product screenshot ───────────────────────────────── */}
        <div className="relative flex items-center justify-center">
          {/* Glow */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />

          {/* Screenshot window */}
          <div className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d] shadow-2xl">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5">
              <div className="h-2 w-2 rounded-full bg-red-500/70" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/70" />
              <div className="h-2 w-2 rounded-full bg-green-500/70" />
            </div>
            {/* Image — 52% gives a compact screenshot proportional to card */}
            <div className="relative w-full" style={{ paddingBottom: '52%' }}>
              <Image
                src={product.image}
                alt={product.title + ' screenshot'}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>`,
  'reduce image height'
);

// Also reduce card content padding on desktop to make card less tall
patch(
  'components/product-card.tsx',
  `      <CardContent className="grid h-full gap-10 p-8 sm:p-10 lg:grid-cols-[420px_1fr] lg:p-14">`,
  `      <CardContent className="grid h-full gap-8 p-7 sm:p-8 lg:grid-cols-[400px_1fr] lg:p-10">`,
  'tighten card padding'
);

// =============================================================================
// 2. content-section.tsx — dashboard container: restore the original
//    peek/cropped look — smaller max-width, stronger bottom mask
//    The original used -mr-56 (overflow right) and mask-b-from-55% to look 
//    like a "peek" screenshot not the full interactive dashboard
// =============================================================================
patch(
  'components/content-section.tsx',
  `                    <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20 mb-20">
                        <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1">
                            <Dashboard />

                        </div>
                    </div>`,
  `                    <div className="mask-b-from-40% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-16 mb-8 max-h-[520px]">
                        <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 scale-[0.85] origin-top">
                            <Dashboard />
                        </div>
                    </div>`,
  'dashboard: smaller, more cropped'
);

// =============================================================================
// Verify
// =============================================================================
console.log('\n-- Verification --');
const checks = [
  ['components/product-card.tsx',   "paddingBottom: '52%'"],
  ['components/product-card.tsx',   'lg:p-10'],
  ['components/content-section.tsx','max-h-[520px]'],
  ['components/content-section.tsx','scale-[0.85]'],
];

let ok = true;
checks.forEach(([f, n]) => {
  const c = fs.readFileSync(path.join(root, f), 'utf8');
  if (c.includes(n)) console.log('  ok  ' + path.basename(f) + ' -> ' + n);
  else { console.error('  x   MISSING: ' + n); ok = false; }
});

if (!ok) process.exit(1);

console.log(`
=======================================================
  Done. Run:  pnpm dev

  What changed:
  Product cards:
    - Image height: 62% -> 52% aspect ratio (less tall)
    - Removed fixed min-height on image container
    - Card padding tightened (p-10 not p-14)

  Dashboard (About ERP section):
    - Container max-h capped at 520px (was unbounded)
    - Dashboard scaled to 85% (was 100% = too big)
    - Bottom mask stronger (40% not 55%)
    - Top margin reduced for tighter layout
=======================================================
`);
