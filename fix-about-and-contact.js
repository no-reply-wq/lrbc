// =============================================================================
// LRBC — 4 fixes: remove About hero photo, remove quote's vertical line,
// fix Bhavya's cropped team photo, remove Contact sections from About/Why LRBC
// Run: node fix-about-and-contact.js
//
// 1. about-content.tsx — removes the big Unsplash team photo + its SectionBadge
//    wrapper block entirely (also drops the now-unused imageRef GSAP tween)
// 2. about-content.tsx — removes the vertical border line next to the quote
//    (keeps the quote mark icon and text, just no border-l line)
// 3. team.tsx — Bhavya's photo had objectPosition 'center 20%' which crops
//    to the top of the image (shelf/plants), cutting off her face. Changed
//    to 'center top' to match her two colleagues' working crop.
// 4. app/about/page.tsx + app/why-lrbc/page.tsx — ContactSection2 removed
//    from both (stays on the actual /contact page, untouched)
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
  fs.copyFileSync(abs, abs + '.bak7');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + label);
  return true;
}

console.log('-- 1. remove About page hero photo --');

patch('components/about-content.tsx',
  `            <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 md:space-y-12">
                <SectionBadge text='Our Story' />
                <img
                    ref={imageRef}
                    className="rounded-(--radius) w-full"
                    src="https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="team image"
                    loading="lazy"
                />
            </div>`,
  `            <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 md:space-y-12">
                <SectionBadge text='Our Story' />
            </div>`,
  'about-content: remove hero photo');

patch('components/about-content.tsx',
  `            if (imageRef.current) {
                gsap.to(imageRef.current, {
                    scale: 0.96,
                    filter: "brightness(0.9)",
                    ease: "none",
                    scrollTrigger: {
                        trigger: imageRef.current,
                        start: "top 70%",
                        end: "bottom 60%",
                        scrub: 1,
                    },
                });
            }

            return () => {`,
  `            return () => {`,
  'about-content: remove unused image GSAP tween');

patch('components/about-content.tsx',
  `    const headingRef = useRef<HTMLParagraphElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const featuresRef = useRef<HTMLUListElement>(null);`,
  `    const headingRef = useRef<HTMLParagraphElement>(null);
    const featuresRef = useRef<HTMLUListElement>(null);`,
  'about-content: remove unused imageRef');

console.log('');
console.log('-- 2. remove vertical line next to the quote --');

patch('components/about-content.tsx',
  `                        <blockquote className="border-l-2 border-primary/30 pl-6 sm:pl-8">`,
  `                        <blockquote className="pl-6 sm:pl-8">`,
  'about-content: remove quote border line');

console.log('');
console.log('-- 3. fix Bhavya team photo crop --');

patch('components/team.tsx',
  `        avatar: '/images/bhavya.jpeg',
        link: 'https://www.linkedin.com/in/bhavyamuthyala/',
        objectPosition: 'center 20%',`,
  `        avatar: '/images/bhavya.jpeg',
        link: 'https://www.linkedin.com/in/bhavyamuthyala/',
        objectPosition: 'center top',`,
  'team.tsx: fix Bhavya crop to match colleagues');

console.log('');
console.log('-- 4. remove Contact section from About and Why LRBC pages --');

patch('app/about/page.tsx',
  `import AboutUsContent from "@/components/about-content";
import ContactSection2 from "@/components/ContactSection2";
import FAQs from "@/components/faq";`,
  `import AboutUsContent from "@/components/about-content";
import FAQs from "@/components/faq";`,
  'about page: remove ContactSection2 import');

patch('app/about/page.tsx',
  `      <FAQs />
      <ContactSection2 />
      
      <FooterSection />`,
  `      <FAQs />

      <FooterSection />`,
  'about page: remove ContactSection2 render');

patch('app/why-lrbc/page.tsx',
  `import WhyLRBC from "@/components/why-lrbc";
import ContactSection2 from "@/components/ContactSection2";
import FooterSection from "@/components/footer-section";`,
  `import WhyLRBC from "@/components/why-lrbc";
import FooterSection from "@/components/footer-section";`,
  'why-lrbc page: remove ContactSection2 import');

patch('app/why-lrbc/page.tsx',
  `      <WhyLRBC />

      <ContactSection2 />

      <FooterSection />`,
  `      <WhyLRBC />

      <FooterSection />`,
  'why-lrbc page: remove ContactSection2 render');

// ─────────────────────────────────────────────────────────────────────────────
console.log('');
console.log('-- verification --');
const checks = [
  ['components/about-content.tsx', 'images.unsplash.com',      'hero photo removed',        true],
  ['components/about-content.tsx', 'imageRef',                 'unused imageRef removed',   true],
  ['components/about-content.tsx', 'border-l-2 border-primary','quote border line removed', true],
  ['components/about-content.tsx', 'Quote className',          'quote mark icon kept',      false],
  ['components/team.tsx',          "objectPosition: 'center 20%'", 'bad Bhavya crop gone',   true],
  ['components/team.tsx',          "avatar: '/images/bhavya.jpeg',\n        link: 'https://www.linkedin.com/in/bhavyamuthyala/',\n        objectPosition: 'center top',", 'Bhavya crop fixed', false],
  ['app/about/page.tsx',           'ContactSection2',          'contact removed from About', true],
  ['app/why-lrbc/page.tsx',        'ContactSection2',          'contact removed from Why LRBC', true],
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
console.log('  1. About page: the large team photo under "Our Story" is');
console.log('     gone. Badge stays, then straight into the Why ERP /');
console.log('     Story quote side-by-side section.');
console.log('');
console.log('  2. The vertical line next to the quote text is removed —');
console.log('     the big quote mark icon and text stay exactly as they');
console.log('     were, just without the border line beside them.');
console.log('');
console.log('  3. Bhavya Muthyala team photo: the crop was set to');
console.log('     "center 20%", which showed mostly the plant shelf');
console.log('     behind her instead of her face. Fixed to "center top",');
console.log('     matching how her two colleagues photos are cropped.');
console.log('');
console.log('  4. "Get in touch" contact form removed from both the');
console.log('     About page and the Why LRBC page. It remains untouched');
console.log('     on the actual /contact page.');
console.log('============================================================');
