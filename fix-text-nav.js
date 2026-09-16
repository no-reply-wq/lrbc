const fs = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run from project root: cd D:\\lrbc-main\\lrbc-main');
  process.exit(1);
}

let ok = 0, fail = 0;
function patch(rel, oldStr, newStr, label) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) { console.warn('  MISSING: ' + rel); fail++; return; }
  const c = fs.readFileSync(abs, 'utf8');
  if (!c.includes(oldStr)) { console.warn('  NOT FOUND: ' + label); fail++; return; }
  fs.copyFileSync(abs, abs + '.bak_text');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  ok: ' + label);
  ok++;
}

// 1. Hero title
patch('app/page.tsx',
  `            <span className="overflow-hidden">Better Tools.</span>
            <span className="overflow-hidden">Better Business.</span>`,
  `            <span className="overflow-hidden">Better Systems,</span>
            <span className="overflow-hidden">Better Business.</span>`,
  'hero: title');

// 2. Hero subtitle
patch('app/page.tsx',
  `subtitle="The right technology doesn't complicate your business. It helps it flow."`,
  `subtitle='"Simplicity is the most difficult thing to secure in this world." — George Sand'`,
  'hero: subtitle quote');

// 3. About ERP heading
patch('components/content-section.tsx',
  'About Our ERP',
  'One ERP | Every Process | Zero Bottleneck',
  'content: ERP heading');

// 4. ERP description paragraph 1
patch('components/content-section.tsx',
  `<span className=\" text-3xl font-bold \">One ERP. Every Process. Zero Bottlenecks .</span>  One platform for everything your business needs. Our Google Workspace-powered ERP solutions keep your operations connected, simple, and efficient.`,
  `A single platform built around how your business actually operates — connecting every team, workflow, and decision so nothing depends on one person to keep running.`,
  'content: ERP paragraph 1');

// 5. ERP description paragraph 2
patch('components/content-section.tsx',
  `One ERP. Every Process. Zero Bottlenecks, meshed up data, dependency on an individual's.`,
  `No more scattered data. No more processes that live in one person's head. Just one connected system your whole business runs on.`,
  'content: ERP paragraph 2');

// 6. Add Home to navbar
patch('components/header.tsx',
  `    { name: 'About', href: '/about' },`,
  `    { name: 'Home', href: '/' },\n    { name: 'About', href: '/about' },`,
  'header: add Home nav item');

console.log('\n' + ok + ' patched, ' + fail + ' failed.');
if (fail > 0) { process.exit(1); }
console.log('\nDone. Now run:');
console.log('  Remove-Item -Recurse -Force .next');
console.log('  pnpm dev');
