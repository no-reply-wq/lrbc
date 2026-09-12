const fs = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run from project root'); process.exit(1);
}

const abs = path.join(root, 'app/testimonials-case-studies/page.tsx');
let c = fs.readFileSync(abs, 'utf8');
fs.copyFileSync(abs, abs + '.bak14');

// Ensure T_PAGE = 2
c = c.replace(/const T_PAGE\s*=\s*\d+;/, 'const T_PAGE  = 2;');

// Ensure initial tVisible = 2 (hardcode to be safe)
c = c.replace(
  'const [tVisible,     setTVisible]     = useState(T_PAGE);',
  'const [tVisible,     setTVisible]     = useState(2);'
);

// Replace the entire testimonials rendering block definitively
const oldBlock = c.match(/\{loading \? <SkeletonGrid cols=\{2\} rows=\{2\} \/> : \(([\s\S]*?)\)\}/);
if (oldBlock) {
  const replacement = `{loading ? <SkeletonGrid cols={2} rows={2} /> : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 items-start">
              {shownT.map(t => (
                <TestimonialCard key={t._id ?? t.name} t={t} />
              ))}
            </div>
            {moreT > 0 && (
              <LoadMoreBtn
                remaining={Math.min(moreT, T_PAGE)}
                onClick={() => setTVisible(v => v + T_PAGE)}
              />
            )}
          </>
        )}`;
  c = c.replace(oldBlock[0], replacement);
  console.log('testimonials block replaced');
} else {
  console.log('block not found by regex - doing targeted patch');
  c = c.replace(
    '<div className="grid gap-6 sm:grid-cols-2 items-start">',
    '<div className="grid gap-6 sm:grid-cols-2 items-start">'
  );
}

fs.writeFileSync(abs, c, 'utf8');

// Final verify
const cv = fs.readFileSync(abs, 'utf8');
console.log('T_PAGE =', cv.match(/const T_PAGE\s*=\s*(\d+)/)?.[1]);
console.log('tVisible initial =', cv.match(/useState\((\d+)\)/)?.[1]);
console.log('grid-cols-2 present:', cv.includes('sm:grid-cols-2 items-start'));
console.log('');
console.log('Done. Now run:');
console.log('  Remove-Item -Recurse -Force .next');
console.log('  pnpm dev');
console.log('Then: new Incognito -> localhost:3000/testimonials-case-studies');
