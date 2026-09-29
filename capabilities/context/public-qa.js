'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = __dirname;
const pkg = require('./package.json');

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
  !pkg.exports?.['./compiler'] ||
  !pkg.exports?.['./context-capsule'] ||
  !pkg.exports?.['./retrieval-economy'] ||
  !pkg.exports?.['./continuity-carrier']
) {
  throw new Error('COMMERCIAL_PACKAGE_METADATA_INVALID');
}
for (const field of ['dependencies', 'optionalDependencies', 'peerDependencies']) {
  if (pkg[field] && Object.keys(pkg[field]).length) throw new Error(`COMMERCIAL_PACKAGE_DEPENDENCY_BOUNDARY_INVALID:${field}`);
}

const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const dryRun = execFileSync(npmBin, ['pack', '--dry-run', '--json', '--ignore-scripts'], {
  cwd: root,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe']
});
let packed;
try {
  const parsed = JSON.parse(dryRun);
  packed = parsed?.[0]?.files?.map(item => item.path).filter(Boolean);
} catch (_) {
  throw new Error('PACKAGE_DRY_RUN_PARSE_FAILED');
}
if (!Array.isArray(packed) || !packed.length || !packed.includes('package.json') || !packed.includes('public-qa.js')) {
  throw new Error('PACKAGE_DRY_RUN_FILESET_INVALID');
}
const packageFiles = [...new Set(packed)].sort();

const forbiddenEverywhere = [
  /[A-Z]:\\Users\\/i,
  /\/home\/[a-z0-9._-]+\//i,
  new RegExp(['Program', 'Data'].join(''), 'i'),
  new RegExp(['PAI', 'PROJECT'].join('_')),
  /localhost:\d+|127\.0\.0\.1:\d+/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /Bearer\s+[A-Za-z0-9._-]{20,}/
];
const executableOnly = [
  new RegExp(['claim', 'Service'].join(''), 'i'),
  new RegExp(['task', 'Box'].join(''), 'i'),
  new RegExp(['prompt', 'Evidence'].join(''), 'i'),
  new RegExp(['PAI', 'CHIEF'].join('_'), 'i')
];

for (const name of packageFiles) {
  const filePath = path.join(root, name);
  if (!fs.existsSync(filePath)) throw new Error(`PACKED_FILE_MISSING:${name}`);
  const stat = fs.lstatSync(filePath);
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`PACKED_FILE_TYPE_INVALID:${name}`);
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
  `CONTEXT_KIT_PUBLIC_QA_PASS packed_files=${packageFiles.length} secrets=0 private_paths=0 protected_runtime_code=0 commercial_contract=1 types=1 dependency_free=1`
);
