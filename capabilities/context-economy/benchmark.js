'use strict';
const { buildContextCapsule, sha256 } = require('./index.js');

const fixture = {
  objective: 'deterministic benchmark', exactRefs: ['public-fixture'], mutableScope: 'none',
  invariants: ['authority', 'privacy', 'acceptance'], acceptance: ['READY'],
  resourceBoundary: { network: false }, stopGates: ['CONTEXT_MISS'], authority: 'NONE',
  truthRefs: ['public-fixture'], privacyClass: 'PUBLIC',
  contextBudget: { total: 4096, outputReserve: 512, sourceCaps: { task: 1200, evidence: 1200 } },
  sources: [
    { id: 'task', required: true, priority: 2, content: 'bounded task '.repeat(60) },
    { id: 'evidence', required: false, priority: 1, content: 'public evidence '.repeat(60) }
  ]
};
const digests = new Set();
const started = process.hrtime.bigint();
for (let i = 0; i < 1000; i++) digests.add(sha256(JSON.stringify(buildContextCapsule(fixture))));
const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
if (digests.size !== 1) throw new Error('NON_DETERMINISTIC');
console.log(JSON.stringify({ schema: 'pai-context-economy-benchmark/v1', status: 'PASS', iterations: 1000, uniqueDigests: digests.size, elapsedMs: Number(elapsedMs.toFixed(3)), fixtureClass: 'SYNTHETIC_PUBLIC' }));
