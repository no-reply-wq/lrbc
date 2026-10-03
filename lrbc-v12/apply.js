// Copies the updated files into the project. No backups are created.
// Run from the project root (folder with package.json):  node lrbc-v12/apply.js
const fs = require("fs"), path = require("path");
const root = process.cwd(), src = path.join(__dirname, "files");
if (!fs.existsSync(path.join(root, "package.json"))) { console.error("Run this from the project root (the folder that contains package.json)."); process.exit(1); }
let n = 0;
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    const rel = path.relative(src, p), dest = path.join(root, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(p, dest); n++;
    console.log("  updated", rel.split(path.sep).join("/"));
  }
})(src);
console.log(`\nDone — ${n} files updated.`);
