// =============================================================================
// LRBC — 2 changes:
//   1. Product card (LekhaSetu on home Products section): replace the
//      "Sales Team Performance" bar chart with the Accounts Receivable
//      Aging chart, sized to fit the card's right-side window
//   2. Contact form (inline on Contact/About pages via ContactSection2):
//      cap its height and add an internal scrollbar so it no longer
//      stretches far taller than the left contact-info column
// Run: node fix-productcard-form.js
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
  fs.copyFileSync(abs, abs + '.bak11');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + label);
  return true;
}

console.log('-- 1. product card: Receivable Aging chart instead of bar chart --');

patch('components/product-card.tsx',
  `import TeamPerformanceCard from "./dashboar-view/components/team-performance-card";`,
  `import ReceivablesAgingChart from "./dashboar-view/components/receivables-aging-chart";`,
  'product-card: swap import');

patch('components/product-card.tsx',
  `          {/* Window */}

          <div
            className="
              relative
              h-full
              w-full
              overflow-hidden
              rounded-[28px]
              border
              border-white/10
              bg-[#171717]
              shadow-2xl
            "
          >
            

            {/* Image */}

            <div className="relative h-full">
              <TeamPerformanceCard />
           
            </div>
          </div>`,
  `          {/* Window */}

          <div
            className="
              relative
              h-full
              w-full
              overflow-hidden
              rounded-[28px]
              border
              border-border/60
              bg-background
              shadow-2xl
            "
          >
            {/* Accounts Receivable Aging chart */}
            <div className="relative h-full p-2">
              <ReceivablesAgingChart />
            </div>
          </div>`,
  'product-card: render Receivable Aging chart');

console.log('');
console.log('-- 2. contact form: cap height + internal scrollbar --');

patch('components/ContactSection2.tsx',
  `          {/* RIGHT / FORM */}
          <div>
            <ContactForm />
          </div>`,
  `          {/* RIGHT / FORM */}
          <div className="lg:sticky lg:top-24 max-h-[70vh] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:oklch(var(--primary)/0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/30">
            <ContactForm />
          </div>`,
  'ContactSection2: form scroll container');

// ─────────────────────────────────────────────────────────────────────────────
console.log('');
console.log('-- verification --');
const checks = [
  ['components/product-card.tsx',      'ReceivablesAgingChart',           'chart import swapped'],
  ['components/product-card.tsx',      'TeamPerformanceCard',             'old bar chart removed___INVERT'],
  ['components/product-card.tsx',      '<ReceivablesAgingChart />',       'chart rendered'],
  ['components/ContactSection2.tsx',   'max-h-[70vh] overflow-y-auto',    'form scroll container'],
  ['components/ContactSection2.tsx',   'lg:sticky lg:top-24',             'form sticky on scroll'],
];

let ok = true;
checks.forEach(([f, needle, label]) => {
  const abs = path.join(root, f);
  const c = fs.readFileSync(abs, 'utf8');
  const invert = label.includes('___INVERT');
  const cleanLabel = label.replace('___INVERT', '');
  const has = c.includes(needle);
  if (invert ? !has : has) console.log('  ok  ' + cleanLabel);
  else { console.error('  FAIL  ' + cleanLabel); ok = false; }
});

if (!ok || failures > 0) { console.log('Some patches did not apply — check warnings above.'); process.exit(1); }

console.log('');
console.log('============================================================');
console.log('  Done. Run:');
console.log('    Remove-Item -Recurse -Force .next');
console.log('    pnpm dev');
console.log('  Then check in a fresh Incognito window.');
console.log('');
console.log('  1. Home page Products section (LekhaSetu card): the right');
console.log('     side now shows the Accounts Receivable Aging chart with');
console.log('     the green/yellow/orange/red legend, replacing the old');
console.log('     "Sales Team Performance" bar chart. Fitted to the card.');
console.log('');
console.log('  2. Contact form (inline on Contact + any page using it):');
console.log('     capped at 70% viewport height with a slim custom');
console.log('     scrollbar, and it now sticks in place as you scroll the');
console.log('     left info column past it — so it no longer runs far');
console.log('     taller than the contact details beside it.');
console.log('============================================================');
