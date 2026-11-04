/* Temp codemod: replace horizontal scroll-reveal offsets (x: ±N) with vertical
   ones so pre-reveal translateX can't widen the page on stacked mobile grids. */
const fs = require('fs');
const path = require('path');

const FILES = [
  'src/modules/client/(marketing)/pages/HipaaPage.tsx',
  'src/modules/client/(marketing)/pages/FhirEmrPage.tsx',
  'src/modules/client/(marketing)/pages/McpPage.tsx',
  'src/modules/client/(marketing)/components/McpSection.tsx',
  'src/modules/client/(marketing)/components/Hero.tsx',
];

let total = 0;
for (const rel of FILES) {
  const full = path.join(__dirname, rel);
  const src = fs.readFileSync(full, 'utf8');
  const next = src
    .replace(/initial=\{\{ opacity: 0, x: -?\d+ \}\}/g, 'initial={{ opacity: 0, y: 14 }}')
    .replace(/(whileInView|animate)=\{\{ opacity: 1, x: 0 \}\}/g, '$1={{ opacity: 1, y: 0 }}');
  const hits = (src.match(/initial=\{\{ opacity: 0, x: -?\d+ \}\}/g) || []).length;
  if (next !== src) {
    fs.writeFileSync(full, next);
    total += hits;
    console.log(`converted ${hits} reveal pair(s) in ${rel}`);
  }
}
console.log('---');
console.log(`${total} pairs converted to vertical reveals`);
