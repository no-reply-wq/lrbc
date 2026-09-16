// =============================================================================
// LRBC FAQ Component Replacement — Windows-compatible Node.js script
// Run from your repo root: node update-faq.js
// Touches ONLY: components/faq.tsx — nothing else.
// =============================================================================

const fs = require('fs');
const path = require('path');

// ─── 1. Safety guard ─────────────────────────────────────────────────────────
const pkgPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('❌  Run this from the repo root (the folder containing package.json).');
  console.error('    Example:  cd D:\\lrbc-main\\lrbc-main');
  console.error('              node update-faq.js');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (pkg.name !== 'lrbc') {
  console.error('❌  package.json found but name is not "lrbc". Wrong folder?');
  process.exit(1);
}

const TARGET = path.join(process.cwd(), 'components', 'faq.tsx');
if (!fs.existsSync(TARGET)) {
  console.error('❌  components/faq.tsx not found. Are you in the repo root?');
  process.exit(1);
}

// ─── 2. Back up original ─────────────────────────────────────────────────────
const BACKUP = TARGET + '.bak';
fs.copyFileSync(TARGET, BACKUP);
console.log('✅  Original backed up → components/faq.tsx.bak');

// ─── 3. New component content ─────────────────────────────────────────────────
const newContent = [
  "'use client'",
  '',
  "import { useState } from 'react'",
  'import {',
  '    Accordion,',
  '    AccordionContent,',
  '    AccordionItem,',
  '    AccordionTrigger,',
  "} from '@/components/ui/accordion'",
  "import { DynamicIcon, type IconName } from 'lucide-react/dynamic'",
  "import Link from 'next/link'",
  '',
  'type FAQItem = {',
  '    id: string',
  '    icon: IconName',
  '    question: string',
  '    answer: string',
  '}',
  '',
  'const ALL_FAQ_ITEMS: FAQItem[] = [',
  '    {',
  "        id: 'item-1',",
  "        icon: 'cpu',",
  "        question: 'What is a custom ERP system, and how is it different from off-the-shelf software?',",
  '        answer:',
  '            "A custom ERP system is built around your business\'s existing physical processes, rather than forcing your operations to conform to a generic template. Off-the-shelf software offers standardised modules that often require you to change how your teams actually work; LRBC instead maps your real workflow first, then architects the system around it.",',
  '    },',
  '    {',
  "        id: 'item-2',",
  "        icon: 'user-minus',",
  "        question: 'How do I make my business less dependent on key employees?',",
  '        answer:',
  "            'You reduce person-dependency by converting workflows, approvals, and institutional knowledge into a documented, digital system that anyone can follow. LRBC builds Flow Management Systems and accountability dashboards specifically to capture this tribal knowledge, so operations continue smoothly even if a key employee is unavailable or leaves.',",
  '    },',
  '    {',
  "        id: 'item-3',",
  "        icon: 'building-2',",
  "        question: 'Is LRBC only for large enterprises, or can growing businesses afford this too?',",
  '        answer:',
  '            "LRBC works with both growing businesses and large-scale enterprises, with architecture and pricing calibrated to the client\'s budget and stage of growth. Our discovery process starts by understanding your budget constraints before scoping a solution, rather than selling a fixed-price package regardless of company size.",',
  '    },',
  '    {',
  "        id: 'item-4',",
  "        icon: 'handshake',",
  "        question: 'What makes LRBC different from a typical software vendor?',",
  '        answer:',
  "            'LRBC provides hands-on, on-the-ground implementation and training, not just a software license. We stay engaged after deployment \u2014 training your workforce directly on the floor \u2014 until the system is fully adopted and running on autopilot, which is where most off-the-shelf software implementations fail.',",
  '    },',
  '    {',
  "        id: 'item-5',",
  "        icon: 'timer',",
  "        question: 'How long does it take to implement a custom business system?',",
  '        answer:',
  "            'Implementation timelines depend on the complexity of the processes being digitized and the scale of the business, and are scoped individually during the Requirement & Budget Discovery phase. Because LRBC builds around your existing workflows rather than forcing adoption of a fixed template, timelines are typically faster to real-world adoption than generic software rollouts.',",
  '    },',
  '    {',
  "        id: 'item-6',",
  "        icon: 'git-branch',",
  "        question: 'Does LRBC only build software, or do you also help with process design?',",
  '        answer:',
  '            "LRBC\'s engagement begins with studying your actual operational process before any system is built, and includes redesigning inefficient workflows where needed. The goal is not just digitization, but converting your operations into a structured, system-driven process \u2014 software is the outcome, not the starting point.",',
  '    },',
  '    {',
  "        id: 'item-7',",
  "        icon: 'factory',",
  "        question: 'What industries does LRBC work with?',",
  '        answer:',
  "            'LRBC works with manufacturing and service businesses across industries, including sectors like wire manufacturing, chemicals, interiors, and industrial production. Our approach is process-first and tech-agnostic, so it adapts to the physical and operational realities of different industries rather than applying a one-size-fits-all vertical solution.',",
  '    },',
  ']',
  '',
  'const INITIAL_VISIBLE = 5',
  '',
  'export default function FAQs() {',
  '    const [showAll, setShowAll] = useState(false)',
  '',
  '    const visibleItems = showAll ? ALL_FAQ_ITEMS : ALL_FAQ_ITEMS.slice(0, INITIAL_VISIBLE)',
  '    const hiddenCount = ALL_FAQ_ITEMS.length - INITIAL_VISIBLE',
  '',
  '    return (',
  '        <section className="bg-muted dark:bg-background py-20 mt-70 md:mt-10">',
  '            <div className="mx-auto max-w-5xl px-4 md:px-6">',
  '                <div className="flex flex-col gap-10 md:flex-row md:gap-16">',
  '                    <div className="md:w-1/3">',
  '                        <div className="sticky top-20">',
  '                            <h2 className="mt-4 text-3xl font-bold">Frequently Asked Questions</h2>',
  '                            <p className="text-muted-foreground mt-4">',
  '                                {"Can\'t find what you\'re looking for? Contact our "}',
  '                                <Link',
  '                                    href="#"',
  '                                    className="text-primary font-medium hover:underline">',
  '                                    customer support team',
  '                                </Link>',
  '                            </p>',
  '                        </div>',
  '                    </div>',
  '',
  '                    <div className="md:w-2/3">',
  '                        <Accordion',
  '                            type="single"',
  '                            collapsible',
  '                            className="w-full space-y-2">',
  '                            {visibleItems.map((item) => (',
  '                                <AccordionItem',
  '                                    key={item.id}',
  '                                    value={item.id}',
  '                                    className="bg-background shadow-xs rounded-lg border px-4 last:border-b">',
  '                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">',
  '                                        <div className="flex items-center gap-3">',
  '                                            <div className="flex size-6">',
  '                                                <DynamicIcon',
  '                                                    name={item.icon}',
  '                                                    className="m-auto size-4"',
  '                                                />',
  '                                            </div>',
  '                                            <span className="text-base">{item.question}</span>',
  '                                        </div>',
  '                                    </AccordionTrigger>',
  '                                    <AccordionContent className="pb-5">',
  '                                        <div className="px-9">',
  '                                            <p className="text-base">{item.answer}</p>',
  '                                        </div>',
  '                                    </AccordionContent>',
  '                                </AccordionItem>',
  '                            ))}',
  '                        </Accordion>',
  '',
  '                        {!showAll && (',
  '                            <div className="mt-4 flex justify-center">',
  '                                <button',
  '                                    onClick={() => setShowAll(true)}',
  '                                    className="text-primary text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 transition-colors">',
  '                                    Show {hiddenCount} more question{hiddenCount !== 1 ? \'s\' : \'\'}',
  '                                </button>',
  '                            </div>',
  '                        )}',
  '',
  '                        {showAll && (',
  '                            <div className="mt-4 flex justify-center">',
  '                                <button',
  '                                    onClick={() => setShowAll(false)}',
  '                                    className="text-muted-foreground text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 transition-colors">',
  '                                    Show less',
  '                                </button>',
  '                            </div>',
  '                        )}',
  '                    </div>',
  '                </div>',
  '            </div>',
  '        </section>',
  '    )',
  '}',
  '',
].join('\n');

// ─── 4. Write the file ────────────────────────────────────────────────────────
fs.writeFileSync(TARGET, newContent, 'utf8');
console.log('✅  components/faq.tsx written successfully.');

// ─── 5. Sanity checks ────────────────────────────────────────────────────────
const written = fs.readFileSync(TARGET, 'utf8');
const checks = [
  'useState',
  'showAll',
  'INITIAL_VISIBLE',
  'more question',
  'Show less',
  'What is a custom ERP system',
  'How do I make my business less dependent',
  'Is LRBC only for large enterprises',
  'What makes LRBC different',
  'How long does it take to implement',
  'Does LRBC only build software',
  'What industries does LRBC work with',
];

let allPassed = true;
checks.forEach((needle) => {
  if (written.includes(needle)) {
    console.log('  \u2713  ' + needle);
  } else {
    console.error('  \u2717  MISSING: ' + needle);
    allPassed = false;
  }
});

if (!allPassed) {
  console.error('\n\u274C  One or more checks failed. Restoring backup...');
  fs.copyFileSync(BACKUP, TARGET);
  console.error('   Original restored from .bak');
  process.exit(1);
}

console.log('\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
console.log('  Done. Only components/faq.tsx was changed.');
console.log('  Original saved at: components/faq.tsx.bak');
console.log('');
console.log('  Start your dev server:');
console.log('    pnpm dev    (or npm run dev)');
console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n');
