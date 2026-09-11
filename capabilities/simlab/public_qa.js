'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { runSimPack, replayDigest, minimizeCounterexample } = require('./simlab-core');

const root = __dirname;
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const pack = JSON.parse(fs.readFileSync(path.join(root, 'simpacks', 'duplicate-event-v1.json'), 'utf8'));
const duplicateCount = (values) => values.length - new Set(values).size;
const good = ({ sequence }) => { const acceptedIds = [...new Set(sequence)]; return { acceptedIds, duplicateCount: duplicateCount(acceptedIds) }; };
const mutant = ({ sequence }) => { const acceptedIds = [...sequence]; return { acceptedIds, duplicateCount: duplicateCount(acceptedIds) }; };
const unknown = () => ({ acceptedIds: [] });

assert.equal(pkg.name, 'pai-simlab-core');
assert.equal(pkg.version, '0.1.0');
assert.equal(pkg.license, 'Apache-2.0');
assert.equal(Object.keys(pkg.dependencies || {}).length, 0);
assert.equal(pack.syntheticOnly, true);
assert.equal(pack.license, 'Apache-2.0');

for (const protectedName of ['chief-simlab.js', 'verification-property-registry.json', 'kernel-contract.json', 'CHIEF_USAGE_CONTRACT.json']) {
  assert.equal(fs.existsSync(path.join(root, protectedName)), false, protectedName);
}

const pass = runSimPack(pack, good);
const fail = runSimPack(pack, mutant);
const incomplete = runSimPack(pack, unknown);
assert.equal(pass.result.verdict, 'PASS');
assert.equal(fail.result.verdict, 'FAIL');
assert.equal(incomplete.result.verdict, 'UNKNOWN');
assert.equal(replayDigest(pack, good, 1000).uniqueDigests, 1);
const counterexample = minimizeCounterexample(pack, mutant, 'duplicate-event');
assert.equal(counterexample.minimizedLength, 2);
assert.equal(counterexample.productionReady, false);
assert.equal(pass.result.authority.promotion, 'NONE');

console.log('SIMLAB_PUBLIC_QA_PASS synthetic_only=true pass_fail_unknown=preserved replay=deterministic mutant=rejected counterexample=minimized authority=NONE protected_r7=excluded');
