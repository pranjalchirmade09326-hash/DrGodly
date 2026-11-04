/* Temp codemod: raise sub-legible micro typography (10px -> 11px) across src. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'src');
const SKIP = new Set(['node_modules', '.next', 'vendor']);
let changed = 0;
let files = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(tsx|ts)$/.test(entry.name)) continue;
    const src = fs.readFileSync(full, 'utf8');
    const next = src.replace(/text-\[10px\]/g, 'text-[11px]').replace(/text-\[9px\]/g, 'text-[10px]');
    if (next !== src) {
      fs.writeFileSync(full, next);
      files += 1;
      changed += (src.match(/text-\[(9|10)px\]/g) || []).length;
      console.log('updated ' + path.relative(ROOT, full));
    }
  }
}

walk(ROOT);
console.log('---');
console.log(files + ' files, ' + changed + ' type classes raised');
