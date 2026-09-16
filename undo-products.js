const fs = require('fs'), path = require('path');
const root = process.cwd();
if (!fs.existsSync(path.join(root, 'package.json'))) { console.error('❌ Run from project root'); process.exit(1); }

// Restore original products.tsx from bak_mobile (last known good)
fs.copyFileSync(
  path.join(root, 'components/products.tsx.bak_mobile'),
  path.join(root, 'components/products.tsx')
);
console.log('✅ components/products.tsx restored to original');
console.log('\n🎉 Done! Restart dev server: npm run dev');
