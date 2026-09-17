'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const files = ['index.js', 'README.md', 'PROVENANCE.md', 'RELEASE_RECEIPT.md', 'test.js', 'benchmark.js', 'package.json'];
const forbidden = [
  /[A-Z]:\\Users\\/i,
  /\/home\/[a-z0-9._-]+\//i,
  /127\.0\.0\.1:\d+/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /(?:claim[_-]?token|database[_-]?password)\s*[:=]\s*\S+/i
];
for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const pattern of forbidden) if (pattern.test(text)) throw new Error(`PUBLIC_BOUNDARY_FAIL:${file}:${pattern}`);
}
const pkg = require('./package.json');
if (pkg.license !== 'Apache-2.0' || pkg.private === true) throw new Error('LICENSE_OR_PACKAGE_BOUNDARY_FAIL');
console.log('CONTEXT_ECONOMY_PUBLIC_QA_PASS files=7 secrets=0 private_paths=0 protected_runtime_terms=0');
