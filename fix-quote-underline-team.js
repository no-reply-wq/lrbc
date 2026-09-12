// =============================================================================
// LRBC — 3 fixes: Why LRBC quote line, FAQ underline, team photo alignment
// Run: node fix-quote-underline-team.js
//
// 1. components/why-lrbc.tsx — removes the vertical border line beside the
//    pull-quote (same fix as About page's quote, just this is a separate
//    component that had the same line)
// 2. components/faq.tsx — removes hover:underline from "See more"/"Show less"
// 3. components/team.tsx — REBUILT to Next.js's recommended "fill" image
//    pattern. The old setup mixed a fixed Tailwind height (h-96) with
//    Next/Image's own width/height props (826x1239), which is exactly the
//    combination that can make Next.js compute its own aspect-ratio and
//    render one photo taller than the others despite the same CSS class.
//    Using fill + a sized wrapper div makes all 3 cards render at IDENTICAL
//    height, no matter each photo's original dimensions.
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
  fs.copyFileSync(abs, abs + '.bak9');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + label);
  return true;
}

console.log('-- 1. remove vertical line beside Why LRBC pull-quote --');

patch('components/why-lrbc.tsx',
  `          <blockquote className="pl-8 border-l-2 border-primary/30">`,
  `          <blockquote className="pl-8">`,
  'why-lrbc: remove quote border line');

console.log('');
console.log('-- 2. remove underline on See more / Show less --');

patch('components/faq.tsx',
  `                                    className="text-primary text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 transition-colors">
                                    See more `,
  `                                    className="text-primary text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 transition-colors">
                                    See more `,
  'faq: remove See more underline');

patch('components/faq.tsx',
  `                                    className="text-muted-foreground text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 transition-colors">
                                    Show less`,
  `                                    className="text-muted-foreground text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 transition-colors">
                                    Show less`,
  'faq: remove Show less underline');

console.log('');
console.log('-- 3. fix team photo alignment (3rd photo rendering taller) --');

patch('components/team.tsx',
  `    <div
        key={index}
        className="team-card group overflow-hidden">
        <Image
            className="team-image h-96 w-full rounded-md object-cover grayscale transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.03] origin-center hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
            style={{ objectPosition: member.objectPosition }}
            src={member.avatar}
            alt="team member"
            width="826"
            height="1239"
            sizes="(max-width: 768px) 100vw, 280px"
        />`,
  `    <div
        key={index}
        className="team-card group overflow-hidden">
        <div className="relative h-96 w-full overflow-hidden rounded-md transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:h-[22.5rem] group-hover:rounded-xl">
            <Image
                fill
                className="team-image object-cover grayscale transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03] origin-center group-hover:grayscale-0"
                style={{ objectPosition: member.objectPosition }}
                src={member.avatar}
                alt={member.name}
                sizes="(max-width: 768px) 100vw, 280px"
            />
        </div>`,
  'team.tsx: fill-mode image, guaranteed equal height across all 3 photos');

// ─────────────────────────────────────────────────────────────────────────────
console.log('');
console.log('-- verification --');
const checks = [
  ['components/why-lrbc.tsx', 'border-l-2 border-primary', 'quote line removed', true],
  ['components/why-lrbc.tsx', '<blockquote className="pl-8">', 'blockquote intact', false],
  ['components/faq.tsx',      'See more',                   'See more button intact', false],
  ['components/team.tsx',     'width="826"',                'old fixed-size props removed', true],
  ['components/team.tsx',     'fill\n                className="team-image object-cover', 'fill-mode image applied', false],
  ['components/team.tsx',     'relative h-96 w-full overflow-hidden rounded-md', 'sized wrapper added', false],
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
console.log('  Done. Run:');
console.log('    Remove-Item -Recurse -Force .next');
console.log('    pnpm dev');
console.log('  Then check in a fresh Incognito window.');
console.log('');
console.log('  1. Why LRBC page: vertical line beside the pull-quote is');
console.log('     gone (same fix as the About page quote earlier).');
console.log('');
console.log('  2. FAQ "See more" / "Show less": no underline on hover');
console.log('     anymore, just the color transition.');
console.log('');
console.log('  3. Team photos: rebuilt using fill-mode Image with a');
console.log('     sized wrapper div, which forces all 3 cards to render');
console.log('     at the exact same height regardless of the source');
console.log('     photo dimensions. This was previously mixing a fixed');
console.log('     h-96 class with Next.js width/height props, which is');
console.log('     the known cause of one photo rendering taller.');
console.log('============================================================');
