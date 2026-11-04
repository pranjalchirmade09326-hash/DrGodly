/* Temp report: count raw palette classes in the clinical cockpit components. */
const fs = require('fs');

const FILES = [
  'src/modules/client/telemedicine/doctor/component/online-consultation/DoctorTelemedicineCockpit.tsx',
  'src/modules/client/telemedicine/doctor/component/online-consultation/PatientDossierPanel.tsx',
  'src/modules/client/telemedicine/doctor/component/online-consultation/CdsCockpitPanel.tsx',
];

const RE = /\b(?:bg|text|border|from|via|to|ring|divide|fill|stroke)-(slate|blue|purple|teal|cyan|indigo|sky|violet|gray|zinc)-[0-9]{2,3}(?:\/[0-9]{1,3})?\b/g;

for (const f of FILES) {
  const src = fs.readFileSync(f, 'utf8');
  const hits = src.match(RE) || [];
  const counts = {};
  for (const h of hits) counts[h] = (counts[h] || 0) + 1;
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  console.log(`\n=== ${f} — ${entries.length} distinct / ${hits.length} total`);
  console.log(entries.map(([k, v]) => `${k}:${v}`).join('  '));
}
