/**
 * fix-images-and-placeholders.js
 * Run from project root:  node fix-images-and-placeholders.js
 *
 * Fixes:
 *  1. Reviewer photos — correct extension .jpeg (not .png)
 *  2. Avatar rendering — explicit width/height instead of fill
 *  3. Form placeholders — disappear on focus (CSS + inline)
 */

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from project root'); process.exit(1);
}

// ── 1. Fix image paths: .png → .jpeg in testimonial-card.tsx ─────────────────
const cardPath = path.join(root, 'components/belief-section/testimonial-card.tsx');
let c = fs.readFileSync(cardPath, 'utf8');
fs.copyFileSync(cardPath, cardPath + '.bak_imgfix');

// Fix extensions
c = c.replace('/images/Prabhu.png', '/images/Prabhu.jpeg');
c = c.replace('/images/Ekkta.png',  '/images/Ekkta.jpeg');

// Fix avatar rendering — replace fill with explicit size
c = c.replace(
  /<div className="rounded-full object-cover w-10 h-10 overflow-hidden relative shrink-0">\s*<Image\s*src=\{t\.image\}\s*alt=\{t\.name\}\s*fill\s*className="rounded-full object-cover"\s*\/>\s*<\/div>/,
  `<div style={{width:40,height:40,minWidth:40,borderRadius:'50%',overflow:'hidden',flexShrink:0}}>
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="object-cover"
                      style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}
                    />
                  </div>`
);

fs.writeFileSync(cardPath, c, 'utf8');
console.log('✅  Fixed: components/belief-section/testimonial-card.tsx (image path + avatar)');

// ── 2. Fix image paths in testimonials page ───────────────────────────────────
const pagePath = path.join(root, 'app/testimonials-case-studies/page.tsx');
let p = fs.readFileSync(pagePath, 'utf8');
fs.copyFileSync(pagePath, pagePath + '.bak_imgfix');

p = p.replace('/images/Prabhu.png', '/images/Prabhu.jpeg');
p = p.replace('/images/Ekkta.png',  '/images/Ekkta.jpeg');

// Fix avatar rendering in reviews grid
p = p.replace(
  /<div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">\s*<Image src=\{r\.image\} alt=\{r\.name\} fill className="object-cover" \/>\s*<\/div>/,
  `<div style={{width:44,height:44,minWidth:44,borderRadius:'50%',overflow:'hidden',flexShrink:0}}>
                  <Image
                    src={r.image}
                    alt={r.name}
                    width={44}
                    height={44}
                    className="object-cover"
                    style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}
                  />
                </div>`
);

fs.writeFileSync(pagePath, p, 'utf8');
console.log('✅  Fixed: app/testimonials-case-studies/page.tsx (image path + avatar)');

// ── 3. Fix next.config.ts — unoptimized images ───────────────────────────────
const nextCfgPath = path.join(root, 'next.config.ts');
let nc = fs.readFileSync(nextCfgPath, 'utf8');

if (!nc.includes('unoptimized')) {
  nc = nc.replace(
    /const nextConfig[^=]*=\s*\{/,
    `const nextConfig = {\n  images: { unoptimized: true },`
  );
  fs.writeFileSync(nextCfgPath, nc, 'utf8');
  console.log('✅  Fixed: next.config.ts (images.unoptimized)');
} else {
  console.log('ℹ️   next.config.ts already configured — skipped');
}

// ── 4. Fix form placeholders — disappear on focus via globals.css ─────────────
// Try app/globals.css first, then styles/globals.css
const cssCandidates = [
  path.join(root, 'app/globals.css'),
  path.join(root, 'styles/globals.css'),
];
const cssPath = cssCandidates.find(f => fs.existsSync(f));

if (cssPath) {
  let css = fs.readFileSync(cssPath, 'utf8');
  if (!css.includes('placeholder-focus-hide')) {
    css += `

/* ── Placeholder hides on focus ─────────────────────────────────────────── */
/* placeholder-focus-hide */
input:focus::placeholder,
textarea:focus::placeholder {
  opacity: 0;
  transition: opacity 0.2s ease;
}
input::placeholder,
textarea::placeholder {
  transition: opacity 0.2s ease;
}
`;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log(`✅  Fixed: ${path.relative(root, cssPath)} (placeholder hides on focus)`);
  } else {
    console.log('ℹ️   Placeholder CSS already present — skipped');
  }
} else {
  console.warn('⚠️  Could not find globals.css — placeholder fix skipped');
}

console.log('\n🎉  Done! Restart dev server:  npm run dev');
