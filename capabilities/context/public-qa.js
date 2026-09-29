'use strict';

const fs = require('node:fs');
const path = require('node:path');

const files = [
  'context-capsule.js',
  'retrieval-economy.js',
  'continuity-carrier.js',
  'context-compiler.js',
  'context-compiler.test.js',
  'index.js',
  'index.d.ts',
  'COMMERCIAL_CONTRACT.md',
  'RELEASE_CANDIDATE_0.3.0.md'
];
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
const pkg = require('./package.json');
if (pkg.private === true || pkg.license !== 'Apache-2.0' || !pkg.types || pkg.version !== '0.3.0-rc.1') {
  throw new Error('COMMERCIAL_PACKAGE_METADATA_INVALID');
}
console.log(`CONTEXT_KIT_PUBLIC_QA_PASS files=${files.length} commercial_contract=1 types=1`);
