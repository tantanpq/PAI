'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const pkg = require('./package.json');

function walk(entry) {
  const target = path.join(root, entry);
  if (!fs.existsSync(target)) throw new Error(`PACKAGE_FILE_MISSING:${entry}`);
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink()) throw new Error(`PACKAGE_SYMLINK_FORBIDDEN:${entry}`);
  if (stat.isDirectory()) {
    return fs.readdirSync(target).sort().flatMap(name => walk(path.join(entry, name)));
  }
  return [entry];
}

if (
  pkg.private === true ||
  pkg.license !== 'Apache-2.0' ||
  pkg.version !== '0.3.0-rc.1' ||
  pkg.types !== 'index.d.ts' ||
  pkg.engines?.node !== '>=22' ||
  pkg.sideEffects !== false ||
  pkg.repository?.directory !== 'capabilities/context' ||
  !pkg.bugs?.url ||
  !pkg.homepage ||
  !pkg.exports?.['./compiler']
) {
  throw new Error('COMMERCIAL_PACKAGE_METADATA_INVALID');
}
for (const field of ['dependencies', 'optionalDependencies', 'peerDependencies']) {
  if (pkg[field] && Object.keys(pkg[field]).length) throw new Error(`COMMERCIAL_PACKAGE_DEPENDENCY_BOUNDARY_INVALID:${field}`);
}

const packageFiles = [...new Set((pkg.files || []).flatMap(walk))].sort();
const forbiddenEverywhere = [
  /[A-Z]:\\Users\\/i,
  /\/home\/[a-z0-9._-]+\//i,
  /ProgramData/i,
  /PAI_PROJECT/,
  /localhost:\d+|127\.0\.0\.1:\d+/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /Bearer\s+[A-Za-z0-9._-]{20,}/
];
const executableOnly = [
  /claimService/i,
  /taskBox/i,
  /promptEvidence/i,
  /PAI_CHIEF/i
];

for (const name of packageFiles) {
  if (name === 'public-qa.js') continue;
  const filePath = path.join(root, name);
  const content = fs.readFileSync(filePath, 'utf8');
  for (const pattern of forbiddenEverywhere) {
    if (pattern.test(content)) throw new Error(`PUBLIC_BOUNDARY_FAIL:${name}:${pattern}`);
  }
  if (/\.(?:c?js|mjs|ts|d\.ts)$/.test(name)) {
    for (const pattern of executableOnly) {
      if (pattern.test(content)) throw new Error(`PROTECTED_RUNTIME_TERM_IN_EXECUTABLE:${name}:${pattern}`);
    }
  }
}

console.log(
  `CONTEXT_KIT_PUBLIC_QA_PASS package_files=${packageFiles.length} secrets=0 private_paths=0 protected_runtime_code=0 commercial_contract=1 types=1 dependency_free=1`
);
