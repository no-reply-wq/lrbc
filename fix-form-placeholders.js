const fs = require('fs'), path = require('path');
const root = process.cwd();
if (!fs.existsSync(path.join(root, 'package.json'))) { console.error('❌ Run from project root'); process.exit(1); }

const filePath = path.join(root, 'components/ContactForm.tsx');
fs.copyFileSync(filePath, filePath + '.bak_placeholders');
let c = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Company Name
  ['placeholder="ACD .com"',               'placeholder="e.g. ACD Pvt. Ltd."'],
  // Contact Person
  ['placeholder="Laksh Gupta"',            'placeholder="e.g. Laksh Gupta"'],
  // Designation
  ['placeholder="Manager"',               'placeholder="e.g. Manager"'],
  // Business Email
  ['placeholder="Laksh@gmail.com"',        'placeholder="e.g. laksh@gmail.com"'],
  // City
  ['placeholder="Hyderabad"',             'placeholder="e.g. Hyderabad"'],
  // Pincode
  ['placeholder="500084"',               'placeholder="e.g. 500084"'],
  // Street Address
  ['placeholder="7th Floor, Pranava Business Park…"', 'placeholder="e.g. 7th Floor, Pranava Business Park…"'],
  // Business Goals
  ['placeholder="Streamline our operations…"', 'placeholder="e.g. Streamline our operations…"'],
];

replacements.forEach(([from, to]) => {
  if (c.includes(from)) { c = c.replace(from, to); console.log(`✅ ${to}`); }
  else console.warn(`⚠️  Not found: ${from}`);
});

fs.writeFileSync(filePath, c, 'utf8');
console.log('\n🎉 Done! Restart dev server: npm run dev');
