const fs = require('fs');
const path = require('path');
const base = 'D:/DrGodly/DrGodly/frontend';
const d = path.join(base, 'node_modules');
const e = fs.existsSync(d) ? fs.readdirSync(d) : [];
console.log('node_modules entries:', e.length);
console.log('has next:', e.includes('next'));
console.log('has .pnpm:', e.includes('.pnpm'));
console.log('has .package-lock.json:', e.includes('.package-lock.json'));
console.log('package-lock.json exists:', fs.existsSync(path.join(base, 'package-lock.json')));
console.log('pnpm-lock.yaml exists:', fs.existsSync(path.join(base, 'pnpm-lock.yaml')));
if (e.includes('next')) {
  const pj = JSON.parse(fs.readFileSync(path.join(d, 'next', 'package.json'), 'utf8'));
  console.log('installed next version:', pj.version);
}
