'use strict';

const fs = require('node:fs');
const path = require('node:path');

const files = ['context-capsule.js', 'retrieval-economy.js', 'continuity-carrier.js', 'index.js'];
const forbidden = [
  /[A-Z]:\\Users\\/i,
  /PAI_PROJECT/,
  /ProgramData/i,
  /localhost|127\.0\.0\.1/i,
  /claimService|taskBox|promptEvidence/i,
  /(?:sk-[A-Za-z0-9_-]{12,}|Bearer\s+[A-Za-z0-9._-]{12,})/
];
for (const name of files) {
  const content = fs.readFileSync(path.join(__dirname, name), 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(content)) throw new Error(`PUBLIC_BOUNDARY_FAIL:${name}:${pattern}`);
  }
}
console.log(`CONTEXT_KIT_PUBLIC_QA_PASS files=${files.length}`);
