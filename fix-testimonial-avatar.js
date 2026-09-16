/**
 * fix-testimonial-avatar.js
 * Run from project root:  node fix-testimonial-avatar.js
 * Fixes reviewer photos not showing in the home-page testimonial slider.
 */

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from project root'); process.exit(1);
}

// ── 1. Fix testimonial-card.tsx — use width/height instead of fill ────────────
const cardPath = path.join(root, 'components/belief-section/testimonial-card.tsx');
let c = fs.readFileSync(cardPath, 'utf8');
fs.copyFileSync(cardPath, cardPath + '.bak_avatar');

// Replace the avatar container + Image to use explicit size (no fill)
c = c.replace(
  `<div className="rounded-full object-cover w-10 h-10 overflow-hidden relative shrink-0">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>`,
  `<div className="rounded-full overflow-hidden shrink-0" style={{width:40,height:40,minWidth:40}}>
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-full h-full"
                      style={{objectFit:"cover"}}
                    />
                  </div>`
);

fs.writeFileSync(cardPath, c, 'utf8');
console.log('✅  Fixed: components/belief-section/testimonial-card.tsx');

// ── 2. Fix testimonials page reviews grid — same issue ────────────────────────
const pagePath = path.join(root, 'app/testimonials-case-studies/page.tsx');
let p = fs.readFileSync(pagePath, 'utf8');
fs.copyFileSync(pagePath, pagePath + '.bak_avatar');

p = p.replace(
  `<div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={r.image} alt={r.name} fill className="object-cover" />
                </div>`,
  `<div className="overflow-hidden rounded-full shrink-0" style={{width:44,height:44,minWidth:44}}>
                  <Image src={r.image} alt={r.name} width={44} height={44} className="object-cover w-full h-full rounded-full" style={{objectFit:"cover"}} />
                </div>`
);

fs.writeFileSync(pagePath, p, 'utf8');
console.log('✅  Fixed: app/testimonials-case-studies/page.tsx');

// ── 3. Ensure next.config.ts allows unoptimized local images (safety net) ─────
const nextCfgPath = path.join(root, 'next.config.ts');
let nc = fs.readFileSync(nextCfgPath, 'utf8');

if (!nc.includes('unoptimized')) {
  nc = nc.replace(
    /const nextConfig[^=]*=\s*\{/,
    `const nextConfig = {\n  images: { unoptimized: true },`
  );
  fs.writeFileSync(nextCfgPath, nc, 'utf8');
  console.log('✅  Fixed: next.config.ts (added images.unoptimized)');
} else {
  console.log('ℹ️   next.config.ts already has image config — skipped');
}

console.log('\n🎉  Done! Restart dev server:  npm run dev');
