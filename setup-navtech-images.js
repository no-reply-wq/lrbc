// =============================================================================
// Run: node setup-navtech-images.js
// Place all 6 WhatsApp images in D:\lrbc-main\lrbc-main\ first,
// renamed as shown below, then run this script.
//
// Rename your files:
//  WhatsApp_Image_2026-09-11_at_16_58_12.jpeg       -> case1-1.jpeg
//  WhatsApp_Image_2026-09-11_at_16_58_12__1_.jpeg   -> case1-2.jpeg
//  WhatsApp_Image_2026-09-11_at_16_58_12__2_.jpeg   -> case1-3.jpeg
//  WhatsApp_Image_2026-09-11_at_16_58_13.jpeg       -> case1-4.jpeg
//  WhatsApp_Image_2026-09-11_at_16_59_44.jpeg       -> case2-1.jpeg
//  WhatsApp_Image_2026-09-11_at_16_59_45.jpeg       -> case2-2.jpeg
// =============================================================================

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

// 1. Create destination folder
const dest = path.join(root, 'public', 'images', 'navtech');
if (!fs.existsSync(dest)) { fs.mkdirSync(dest, { recursive: true }); }

// 2. Copy images
const files = ['case1-1.jpeg','case1-2.jpeg','case1-3.jpeg','case1-4.jpeg','case2-1.jpeg','case2-2.jpeg'];
let missing = 0;
files.forEach(f => {
  const src = path.join(root, f);
  const dst = path.join(dest, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log('  copied: public/images/navtech/' + f);
  } else {
    console.warn('  MISSING: ' + f + ' — rename the WhatsApp image and put it in ' + root);
    missing++;
  }
});

if (missing > 0) {
  console.log('\n' + missing + ' image(s) missing. Check renames above.');
  process.exit(1);
}

console.log('\nAll 6 images copied.');
console.log('\nNow run:');
console.log('  Remove-Item -Recurse -Force .next');
console.log('  pnpm dev');
