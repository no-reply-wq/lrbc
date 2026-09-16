const fs   = require('fs');
const path = require('path');
const root = process.cwd();
if (!fs.existsSync(path.join(root,'package.json'))) { console.error('Run from project root'); process.exit(1); }

let failures = 0;
function patch(rel, oldStr, newStr, label) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) { console.warn('  skip (missing): '+rel); failures++; return false; }
  let c = fs.readFileSync(abs,'utf8');
  if (!c.includes(oldStr)) { console.warn('  skip (not found): '+label); failures++; return false; }
  fs.copyFileSync(abs, abs+'.bak_polish');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: '+label);
  return true;
}

// ── 1. Remove testimonials section from case study page ─────────────────────
console.log('-- 1. Remove testimonials from case study page --');
{
  const abs = path.join(root,'app/testimonials-case-studies/page.tsx');
  let c = fs.readFileSync(abs,'utf8');

  // Remove TESTIMONIALS array and T_PAGE const
  // Find start of TESTIMONIALS const and end of it
  const tStart = c.indexOf('// =============================================================================\n// ✏️  EDIT YOUR TESTIMONIALS HERE');
  const tEnd   = c.indexOf('// =============================================================================\n// NOTHING TO EDIT BELOW THIS LINE');
  if (tStart > -1 && tEnd > -1) {
    c = c.slice(0,tStart) + c.slice(tEnd);
    console.log('  removed TESTIMONIALS array');
  }

  // Remove T_PAGE const
  c = c.replace('const T_PAGE  = 2;\n', '');

  // Remove tExpanded state
  c = c.replace('\n  const [tExpanded, setTExpanded] = useState(false);', '');

  // Remove shownT + moreT
  c = c.replace('\n  const shownT  = tExpanded ? TESTIMONIALS : TESTIMONIALS.slice(0, T_PAGE);', '');

  // Remove Star import (still used in TestimonialCard — keep it if TestimonialCard removed)
  // Remove TestimonialCard function
  const tcStart = c.indexOf('\nfunction TestimonialCard(');
  const tcEnd   = c.indexOf('\nexport default function CaseStudiesPage()');
  if (tcStart > -1 && tcEnd > -1) {
    c = c.slice(0,tcStart) + '\n' + c.slice(tcEnd);
    console.log('  removed TestimonialCard component');
  }

  // Remove testimonials section JSX block
  const tsecStart = c.indexOf("\n      <div className=\"mx-auto max-w-6xl px-6\">\n        <div className=\"h-px bg-gradient-to-r from-transparent via-border to-transparent\" />\n      </div>\n\n      {/* ── Testimonials");
  const tsecEnd   = c.indexOf('\n      <FooterSection />');
  if (tsecStart > -1 && tsecEnd > -1) {
    c = c.slice(0,tsecStart) + c.slice(tsecEnd);
    console.log('  removed testimonials JSX section');
  }

  // Remove Star and Quote imports if no longer needed
  c = c.replace(', Star, Quote,', ',');
  c = c.replace('Star, Quote, ', '');
  c = c.replace(', Quote', '');
  c = c.replace(', Star', '');

  fs.copyFileSync(abs, abs+'.bak_polish');
  fs.writeFileSync(abs, c, 'utf8');
  console.log('  case study page: testimonials removed');
}

// ── 2. Cursor: higher opacity + bigger splats ────────────────────────────────
console.log('-- 2. Cursor: more visible --');
patch('app/layout.tsx',
  `          <SplashCursor
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
          />`,
  `          <SplashCursor
            DENSITY_DISSIPATION={3.5}
            VELOCITY_DISSIPATION={2.5}
            PRESSURE={0.15}
            CURL={5}
            SPLAT_RADIUS={0.22}
            SPLAT_FORCE={5000}
            COLOR_UPDATE_SPEED={8}
            SHADING
            RAINBOW_MODE={false}
            COLOR="#5B21B6"
          />`,
  'cursor: bigger, more visible splats');

// Raise base opacity from 0.9 to 1.0, keep stop-on-button logic
patch('components/SplashCursor.tsx',
  `    <div className="fixed top-0 left-0 z-50 pointer-events-none w-full h-full transition-opacity duration-300" style={{ opacity: 0.9 }}>`,
  `    <div className="fixed top-0 left-0 z-50 pointer-events-none w-full h-full transition-opacity duration-300" style={{ opacity: 1 }}>`,
  'cursor canvas opacity 0.9 -> 1.0');

// ── 3. FAQ: "See more" -> chevron + "See less" instead of "Show less" ────────
console.log('-- 3. FAQ: see more/less polish --');
patch('components/faq.tsx',
  `                                    See more `,
  `                                    See more ↓`,
  'faq: see more arrow');
patch('components/faq.tsx',
  `                                    Show less`,
  `                                    See less ↑`,
  'faq: show less -> see less');

// ── 4. Video: show in both light AND dark mode ────────────────────────────────
console.log('-- 4. Video: show in light + dark mode --');
patch('components/content-section.tsx',
  `                     <video
                                className="hidden h-full w-full object-cover dark:block"
                                src="/videos/hero-vid.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                aria-hidden="true"
                            />`,
  `                     <video
                                className="block h-full w-full object-cover"
                                src="/videos/hero-vid.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                aria-hidden="true"
                            />`,
  'video: show in light + dark mode');

// ── 5. Metadata ──────────────────────────────────────────────────────────────
console.log('-- 5. Metadata already set --');
{
  const abs = path.join(root,'app/layout.tsx');
  const c = fs.readFileSync(abs,'utf8');
  if (c.includes('Custom ERP & Business Automation Consulting | LRBC')) {
    console.log('  ok: meta title already correct');
  } else {
    patch('app/layout.tsx',
      `export const metadata: Metadata = {`,
      `export const metadata: Metadata = {
  title: "Custom ERP & Business Automation Consulting | LRBC",
  description: "LRBC builds custom ERP & automation systems that turn chaotic, person-dependent businesses into scalable profit centers — with hands-on implementation support.",
`,
      'metadata: title + description');
  }
}

console.log('');
console.log('-- verification --');
const checks = [
  ['app/testimonials-case-studies/page.tsx', 'TestimonialCard',  'testimonials removed', true],
  ['app/layout.tsx',                          'SPLAT_FORCE={5000}','cursor splat force up', false],
  ['app/layout.tsx',                          'SPLAT_RADIUS={0.22}','cursor radius up', false],
  ['components/SplashCursor.tsx',             'opacity: 1 }',     'cursor opacity 1.0', false],
  ['components/faq.tsx',                      'See less',          'see less label', false],
  ['components/content-section.tsx',          'className="block h-full', 'video always visible', false],
  ['app/layout.tsx',                          'Custom ERP & Business Automation', 'meta title', false],
];
let ok = true;
checks.forEach(([f,needle,label,absent]) => {
  const abs = path.join(root,f);
  if (!fs.existsSync(abs)) { console.error('  MISSING: '+f); ok=false; return; }
  const has = fs.readFileSync(abs,'utf8').includes(needle);
  if (absent ? !has : has) console.log('  ok  '+label);
  else { console.error('  FAIL  '+label); ok=false; }
});
if (!ok||failures>0) { console.log('\nSome patches failed — check above.'); process.exit(1); }
console.log('\n============================================================');
console.log('  Done. Run:');
console.log('    Remove-Item -Recurse -Force .next');
console.log('    pnpm dev');
console.log('');
console.log('  1. Case study page: testimonials section fully removed');
console.log('  2. Cursor: bigger splats, full opacity, stops on buttons');
console.log('  3. FAQ: "See more" / "See less" with arrows');
console.log('  4. Video: plays in both light and dark mode');
console.log('  5. Meta title & description already correct in layout');
console.log('============================================================');
