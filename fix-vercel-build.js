/**
 * fix-vercel-build.js
 * node fix-vercel-build.js
 *
 * Fixes both Vercel build errors:
 *  1. Removes output:'export' — causes crash on dynamic API routes
 *  2. Removes trailingSlash — not needed on Vercel, causes routing issues
 *  3. Adds MONGODB_URI guard instructions (env var must be set in Vercel dashboard)
 */

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from project root'); process.exit(1);
}

const cfgPath = path.join(root, 'next.config.ts');
fs.copyFileSync(cfgPath, cfgPath + '.bak_vercel');

fs.writeFileSync(cfgPath, `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export" REMOVED — caused build crash on dynamic API routes.
  // Vercel supports server-side rendering natively; no static export needed.

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
`);

console.log('✅  next.config.ts fixed');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('NEXT STEP — Add MONGODB_URI to Vercel:');
console.log('  1. Go to vercel.com → your project → Settings');
console.log('  2. Click "Environment Variables"');
console.log('  3. Add:  MONGODB_URI  =  your MongoDB connection string');
console.log('  4. Click Save, then redeploy');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('Then push to GitHub:');
console.log('  git add next.config.ts');
console.log('  git commit -m "fix: remove output export for Vercel"');
console.log('  git push');
