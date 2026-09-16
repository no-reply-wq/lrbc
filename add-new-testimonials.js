/**
 * add-new-testimonials.js
 * Run from your project root:  node add-new-testimonials.js
 *
 * What it does:
 *  1. Copies Prabhu.png + Ekkta.png into public/images/
 *  2. Adds both reviewers to the home-page testimonial slider
 *  3. Adds a "What Our Clients Say" card grid to the testimonials page
 *
 * NOTE: Place Prabhu.png and Ekkta.png in the SAME folder as this script
 *       before running it.
 */

const fs   = require('fs');
const path = require('path');

const root = process.cwd();

// ── sanity check ─────────────────────────────────────────────────────────────
if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run this script from your project root (where package.json lives).');
  process.exit(1);
}

// ── helper ───────────────────────────────────────────────────────────────────
function edit(relPath, fn) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) { console.warn(`⚠️  File not found, skipping: ${relPath}`); return; }
  fs.copyFileSync(abs, abs + '.bak_testimonials');
  let content = fs.readFileSync(abs, 'utf8');
  content = fn(content);
  fs.writeFileSync(abs, content, 'utf8');
  console.log(`✅  Updated: ${relPath}`);
}

// ── 1. Copy photos ────────────────────────────────────────────────────────────
const scriptDir  = __dirname;
const imagesDir  = path.join(root, 'public', 'images');

['Prabhu.png', 'Ekkta.png'].forEach(file => {
  const src  = path.join(scriptDir, file);
  const dest = path.join(imagesDir, file);
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  ${file} not found next to the script — skipping copy. Place it in public/images/ manually.`);
    return;
  }
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`📸  Copied ${file} → public/images/${file}`);
});

// ── 2. Home-page testimonial slider ──────────────────────────────────────────
edit('components/belief-section/testimonial-card.tsx', c => {
  // Guard: already patched?
  if (c.includes('Prabhu Pandurang')) { console.log('   (already contains Prabhu — skipping slider patch)'); return c; }

  const TWO_NEW = `
  {
    quote:
      "We engaged LRBC to streamline our internal systems, and we are incredibly pleased with the results. They provided a true end-to-end solution that handles everything from initial inquiries and the complete sales process to our manufacturing and stores modules. We are very happy with how seamlessly the product connects all our processes. Thanks to this system, our dependency on manual effort has reduced significantly.",
    name: "Prabhu Pandurang",
    company: "Chefmate",
    designation: "CEO",
    image: "/images/Prabhu.jpeg",
  },
  {
    quote:
      "When hiring someone to build business systems, you need a partner who understands your requirements and seamlessly translates ideas into practical solutions. Working with Lalit at LRBC was exactly that experience. He is incredibly patient, approachable, and highly prompt in his responses. Lalit stays updated with the latest technologies and genuinely cares about helping your business grow. He made our entire system-building process smooth and completely hassle-free. If you are looking for a technology partner who truly listens and delivers, I confidently recommend LRBC. Highly recommended for anyone wanting to create robust systems to scale their business!",
    name: "Ekkta V Vohra",
    company: "Wedding Alliances",
    designation: "Founder",
    image: "/images/Ekkta.jpeg",
  },
];`;

  // Remove the old commented-out Ekta block and close the array with new entries
  c = c.replace(
    /\/\/ \{[\s\S]*?\/\/\},?\s*\n\];/,
    TWO_NEW
  );

  // Fallback: if no commented block, just append before ];
  if (!c.includes('Prabhu Pandurang')) {
    c = c.replace(/\};\s*\n\];/, `},\n${TWO_NEW}`);
  }

  return c;
});

// ── 3. Testimonials page — add Reviews section ────────────────────────────────
edit('app/testimonials-case-studies/page.tsx', c => {
  // Guard
  if (c.includes('REVIEWS')) { console.log('   (already contains REVIEWS — skipping page patch)'); return c; }

  // a) Add Star + Quote + Image imports
  c = c.replace(
    /import \{ TrendingUp, ArrowRight, ChevronDown, ChevronLeft, ChevronRight.*?\} from "lucide-react";/,
    `import { TrendingUp, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Calendar, Star, Quote } from "lucide-react";\nimport Image from "next/image";`
  );

  // b) Insert REVIEWS array before "NOTHING TO EDIT BELOW" comment
  const REVIEWS_DATA = `
// =============================================================================
// REVIEWS / TESTIMONIALS — add new entries here
// =============================================================================
const REVIEWS = [
  {
    quote: "We engaged LRBC to streamline our internal systems, and we are incredibly pleased with the results. They provided a true end-to-end solution that handles everything from initial inquiries and the complete sales process to our manufacturing and stores modules. We are very happy with how seamlessly the product connects all our processes. Thanks to this system, our dependency on manual effort has reduced significantly.",
    name: "Prabhu Pandurang",
    designation: "CEO",
    company: "Chefmate — Commercial Kitchen Hoods",
    image: "/images/Prabhu.png",
    rating: 5,
  },
  {
    quote: "When hiring someone to build business systems, you need a partner who understands your requirements and seamlessly translates ideas into practical solutions. Working with Lalit at LRBC was exactly that experience. He is incredibly patient, approachable, and highly prompt in his responses. Lalit stays updated with the latest technologies and genuinely cares about helping your business grow. He made our entire system-building process smooth and completely hassle-free. If you are looking for a technology partner who truly listens and delivers, I confidently recommend LRBC. Highly recommended for anyone wanting to create robust systems to scale their business!",
    name: "Ekkta V Vohra",
    designation: "Founder",
    company: "Wedding Alliances",
    image: "/images/Ekkta.png",
    rating: 5,
  },
  {
    quote: "The unique part about their offerings is that they spend time in understanding your business and its details, and offer products which have been made specifically for our needs rather than pushing any standard product. This helps in keeping the operation and learning simple and cost friendly.",
    name: "Varun Bathwal",
    designation: "CEO",
    company: "ARV",
    image: "/images/Varun.jpeg",
    rating: 5,
  },
  {
    quote: "Team LRBC is highly capable and possesses extensive knowledge across various subjects, particularly in the area of process optimisation for business owners. I personally consult with them for technology-related solutions and consistently receive valuable and meaningful insights.",
    name: "Kanul Verma",
    designation: "Executive Director",
    company: "Hitco Group",
    image: "/images/Kanul.jpeg",
    rating: 5,
  },
];

`;

  c = c.replace(
    '// =============================================================================\n// NOTHING TO EDIT BELOW THIS LINE — layout is fully automatic\n// =============================================================================',
    REVIEWS_DATA + '// =============================================================================\n// NOTHING TO EDIT BELOW THIS LINE — layout is fully automatic\n// ============================================================================='
  );

  // c) Insert Reviews JSX section before the CTA block
  const REVIEWS_JSX = `
      {/* ── Client Reviews ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Client Reviews</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">What Our Clients Say</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Real feedback from the businesses we have partnered with.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="relative rounded-3xl border border-border bg-card/60 p-7 shadow-sm flex flex-col gap-5 transition-all duration-300 hover:shadow-md hover:border-primary/30"
            >
              <div className="h-1 w-full absolute top-0 left-0 rounded-t-3xl bg-gradient-to-r from-primary via-purple-400 to-pink-400" />
              <Quote className="h-8 w-8 text-primary opacity-80" />
              <p className="text-sm sm:text-base text-foreground/80 leading-7 flex-1">{r.quote}</p>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: r.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={r.image} alt={r.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">{r.name}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">{r.designation} · {r.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

`;

  c = c.replace(
    '      {/* ── CTA ──────────────────────────────────────────────────────── */}',
    REVIEWS_JSX + '      {/* ── CTA ──────────────────────────────────────────────────────── */}'
  );

  return c;
});

console.log('\n🎉  Done! Run  npm run dev  to see the changes.');
