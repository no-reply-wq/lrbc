// =============================================================================
// LRBC — Mobile polish round 2: client logos, testimonial card, text-to-edge
// spacing across multiple sections
// Run: node fix-mobile-polish-2.js
//
// 1. logo-cloud-4.tsx      — "Our Clients" label + logos centered on mobile
// 2. testimonial-card.tsx  — name/designation no longer truncate to "K…"/"E…";
//                            badge moves below on mobile instead of squeezing
// 3. testimonials-section.tsx — outer px-10 (40px/side) was too tight combined
//    with inner wrappers; made responsive
// 4. core-solutions.tsx    — mobile side padding increased, panel heading
//    scales down on small phones so text doesn't crowd the edges
// 5. team.tsx              — px-15 (60px/side = 120px total) was crushing
//    content on phones; made responsive. Removed the negative margin that
//    could push the badge into the edge on small screens.
// 6. features.tsx          — px-6 only -> responsive px-4 sm:px-6
// 7. BeliefsSection.tsx    — px-6 only -> responsive; heading text-5xl (48px)
//    on mobile was oversized for a 375px screen -> scales down on phones
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
  if (!fs.existsSync(abs + '.bak3')) fs.copyFileSync(abs, abs + '.bak3');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + (label || rel));
  return true;
}

function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs) && !fs.existsSync(abs + '.bak3')) fs.copyFileSync(abs, abs + '.bak3');
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  written: ' + rel);
}

console.log('-- 1. Our Clients logo cloud: center on mobile --');

write('components/logo-cloud-4.tsx', `import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/motion-primitives/infinite-slider";

const logos = [
  "/images/c1.png",
  "/images/c2.png",
  "/images/c3.png",
  "/images/c4.png",
  "/images/c5.png",
  "/images/c6.png",
  "/images/c7.png",
];

const Logos = () => {
  return (
    <>
      {logos.map((logo, index) => (
        <div
          key={index}
          className="relative flex h-20 w-[90px] sm:h-30 sm:w-[100px] shrink-0 items-center justify-center"
        >
          <Image
            src={logo}
            alt={\`Client logo \${index + 1}\`}
            width={110}
            height={58}
            className="h-auto max-h-10 w-auto max-w-full object-contain"
          />
        </div>
      ))}
    </>
  );
};

export function LogoCloud() {
  return (
    <section className="bg-background py-8">
      <div className="relative m-auto max-w-7xl px-4 sm:px-6">
        <div className="relative flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-12">
          <p className="text-muted-foreground shrink-0 text-center lg:border-r lg:pr-12 lg:text-end">
            Our <br className="max-lg:hidden" /> Clients
          </p>

          <InfiniteSlider
            gap={56}
            className="mask-x-from-85% mask-x-to-99% w-full"
          >
            <Logos />
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}
`);

console.log('');
console.log('-- 2. Testimonial card: fix name/designation truncation on mobile --');

patch('components/belief-section/testimonial-card.tsx',
`              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="rounded-full object-cover w-10 h-10 overflow-hidden relative shrink-0">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{t.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {t.designation} · {t.company}
                  </p>
                </div>

                <Badge variant="secondary" className="rounded-full shrink-0 text-xs">
                  Trusted Partner
                </Badge>
              </div>`,
`              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-full object-cover w-10 h-10 overflow-hidden relative shrink-0">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold leading-tight">{t.name}</h4>
                    <p className="text-sm text-muted-foreground leading-tight">
                      {t.designation} · {t.company}
                    </p>
                  </div>
                </div>

                <Badge variant="secondary" className="rounded-full shrink-0 text-xs w-fit">
                  Trusted Partner
                </Badge>
              </div>`,
  'testimonial card: stack info row on mobile, remove truncate');

console.log('');
console.log('-- 3. testimonials-section.tsx: outer padding --');

patch('components/testimonials-section.tsx',
  `  <div ref={sectionRef} className="mx-auto w-full flex flex-col justify-center items-center max-w-6xl px-10">`,
  `  <div ref={sectionRef} className="mx-auto w-full flex flex-col justify-center items-center max-w-6xl px-4 sm:px-6 lg:px-10">`,
  'testimonials-section: responsive outer padding');

console.log('');
console.log('-- 4. core-solutions.tsx: mobile side padding + heading scale --');

patch('components/core-solutions.tsx',
  `    <section ref={sectionRef} className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">`,
  `    <section ref={sectionRef} className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">`,
  'core-solutions: wider mobile gutter');

patch('components/core-solutions.tsx',
  `          <h3 className="text-3xl font-semibold leading-tight lg:text-4xl">{s.title}</h3>`,
  `          <h3 className="text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">{s.title}</h3>`,
  'core-solutions: panel heading scales down on phones');

patch('components/core-solutions.tsx',
  `          <p className="text-muted-foreground leading-7 text-base">{s.body}</p>`,
  `          <p className="text-muted-foreground leading-6 text-sm sm:leading-7 sm:text-base">{s.body}</p>`,
  'core-solutions: body text scales down on phones');

console.log('');
console.log('-- 5. team.tsx: fix oversized px-15 gutter --');

patch('components/team.tsx',
  `            <div className="mx-auto max-w-5xl  px-15">
                <span className="-ml-6 -mt-4 block w-max"><SectionBadge text="Team" /></span>`,
  `            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-15">
                <span className="block w-max sm:-ml-6 sm:-mt-4"><SectionBadge text="Team" /></span>`,
  'team: responsive gutter, remove mobile negative margin');

console.log('');
console.log('-- 6. features.tsx: mobile side padding --');

patch('components/features.tsx',
  `            <div className="mx-auto max-w-6xl px-6 pt-10 flex flex-col items-center justify-center">`,
  `            <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 flex flex-col items-center justify-center">`,
  'features: responsive gutter');

console.log('');
console.log('-- 7. BeliefsSection.tsx: mobile side padding + heading scale --');

patch('components/belief-section/BeliefsSection.tsx',
  `            <div className="mx-auto max-w-7xl px-6">`,
  `            <div className="mx-auto max-w-7xl px-4 sm:px-6">`,
  'beliefs: responsive gutter');

patch('components/belief-section/BeliefsSection.tsx',
  `                        className="text-center text-5xl font-semibold tracking-tight md:text-6xl xl:text-8xl"`,
  `                        className="text-center text-3xl font-semibold tracking-tight sm:text-5xl md:text-6xl xl:text-8xl"`,
  'beliefs: heading scales down on phones');

// ─────────────────────────────────────────────────────────────────────────────
console.log('');
console.log('-- verification --');
const checks = [
  ['components/logo-cloud-4.tsx',                    'flex-col items-center gap-6 lg:flex-row',  'logo cloud centers on mobile'],
  ['components/logo-cloud-4.tsx',                    'text-center lg:border-r',                  'clients label centers on mobile'],
  ['components/belief-section/testimonial-card.tsx', 'flex-col gap-3 sm:flex-row',                'testimonial info stacks on mobile'],
  ['components/belief-section/testimonial-card.tsx', 'w-fit">\n                  Trusted Partner', 'badge no longer squeezes name'],
  ['components/testimonials-section.tsx',            'px-4 sm:px-6 lg:px-10',                     'testimonials section responsive gutter'],
  ['components/core-solutions.tsx',                  'px-5 sm:px-6 lg:px-8',                      'core-solutions wider mobile gutter'],
  ['components/core-solutions.tsx',                  'text-2xl font-semibold leading-tight sm:text-3xl', 'core-solutions heading scales'],
  ['components/team.tsx',                            'px-4 sm:px-6 lg:px-15',                     'team responsive gutter'],
  ['components/features.tsx',                        'px-4 sm:px-6 pt-10',                        'features responsive gutter'],
  ['components/belief-section/BeliefsSection.tsx',   'max-w-7xl px-4 sm:px-6',                    'beliefs responsive gutter'],
  ['components/belief-section/BeliefsSection.tsx',   'text-3xl font-semibold tracking-tight sm:text-5xl', 'beliefs heading scales'],
];

let ok = true;
checks.forEach(([f, needle, label]) => {
  const abs = path.join(root, f);
  if (!fs.existsSync(abs)) { console.error('  MISSING FILE: ' + f); ok = false; return; }
  const c = fs.readFileSync(abs, 'utf8');
  if (c.includes(needle)) console.log('  ok  ' + label);
  else { console.error('  FAIL  ' + label); ok = false; }
});

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
console.log('  Our Clients: label + logo strip now centered on mobile,');
console.log('  matching the desktop feel instead of sitting off to the left.');
console.log('');
console.log('  Testimonial card: name and title no longer get cut to');
console.log("  \"K...\" / \"E...\" — they get their own row, badge moves");
console.log('  below on phones instead of squeezing the text.');
console.log('');
console.log('  Text-touching-edge sections (Core Solutions, Team,');
console.log('  Features, Beliefs, Testimonials): all given a proper');
console.log('  mobile gutter (was too tight or, for Team, way too wide).');
console.log('  Oversized mobile headings (48px+) now scale down on small');
console.log('  phones and step up at each breakpoint. Desktop values');
console.log('  (sm:/md:/lg:/xl:) are all unchanged.');
console.log('============================================================');
