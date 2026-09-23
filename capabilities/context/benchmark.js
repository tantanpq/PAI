'use strict';

const assert = require('node:assert/strict');
const { compile, planRetrieval, resolveExactArtifact, buildContinuityCarrier, sha256 } = require('./index');

const hash = 'a'.repeat(64);
const item = (kind, id, value, extra = {}) => ({
  kind, id, value, privacyClass: 'PUBLIC',
  provenance: { source: 'benchmark-fixture' },
  freshness: '2026-09-11T00:00:00Z',
  ...extra
});

const request = {
  owner: { principalId: 'benchmark-user', accountId: 'benchmark-account', workspaceId: 'benchmark-workspace' },
  profile: 'resume',
  budget: 6,
  coverage: { observedUserSignals: 4, unobservedHostedChatTurns: 1 },
  items: [
    item('intent', 'i1', 'continue verified work'),
    item('outcome', 'o1', 'public package qualified'),
    item('programResult', 'p1', 'DONE/PASS', { locator: 'Program/Phase/Result', hash }),
    item('constraint', 'c1', 'do not invent missing state'),
    item('unknown', 'u1', 'runtime state not observed'),
    item('memory', 'm1', 'private preference', { privacyClass: 'PERSONAL' }),
    item('memory', 'm1', 'duplicate private preference', { privacyClass: 'PERSONAL' }),
    item('artifact', 'a1', 'release candidate', { locator: 'artifact/ref', hash })
  ]
};

const first = compile(request);
const shas = new Set([first.sha256]);
for (let i = 0; i < 1000; i += 1) {
  const clone = structuredClone(request);
  if (i % 2) clone.items.reverse();
  shas.add(compile(clone).sha256);
}
assert.equal(shas.size, 1, 'deterministic replay produced more than one SHA');
assert.equal(first.capsule.items.length, 6, 'budget must select exactly six items');
assert.ok(first.capsule.omissions.some((x) => x.reason === 'DUPLICATE'));
assert.ok(first.capsule.omissions.some((x) => x.reason === 'BUDGET_EXCEEDED'));
assert.deepEqual(first.capsule.contextMiss, { code: 'CONTEXT_MISS', unknownIds: ['u1'] });

const bad = structuredClone(request);
bad.items.push(item('memory', 'credential', 'api_key="live-value"'));
assert.throws(() => compile(bad), { code: 'MALFORMED_INPUT' });

const inputBytes = Buffer.byteLength(JSON.stringify(request));
const outputBytes = Buffer.byteLength(first.canonical);
const rawHistory = Array.from({ length: 20 }, (_, index) => ({ turn: index + 1, text: `historical narrative ${index + 1} `.repeat(80) }));
const continuity = buildContinuityCarrier({
  objective: 'continue verified work', nextOutcome: 'verify exact package',
  constraints: ['do not invent missing state'], acceptedDecisions: ['metadata-first retrieval'], openLoops: ['publish after QA'],
  programRefs: ['PROGRAM/CONTEXT_KIT'],
  evidenceRefs: [{ id: 'result', ref: 'results/RESULT.md', hash, kind: 'result' }, { id: 'result', ref: 'results/RESULT.md', hash, kind: 'result' }],
  terminalResult: { id: 'handoff', ref: 'handoffs/HANDOFF.md', hash, kind: 'terminal' },
  workingSet: rawHistory.slice(-3).map(row => ({ id: `turn-${row.turn}`, value: row.text.slice(0, 160), createdAt: `2026-09-18T19:${String(row.turn).padStart(2, '0')}:00Z`, sourceRef: `turn:${row.turn}` })),
  budget: { totalBytes: 4096, outputReserveBytes: 512, maxWorkingItems: 2 }
});
const retrieval = planRetrieval({ query: 'context budget', candidates: [
  { id: 'budget', ref: 'src/context-budget.js', name: 'Context budget', tags: ['context', 'budget'] },
  { id: 'health', ref: 'src/health.js', name: 'Health status', tags: ['health'] }
] });
const oversizedContent = 'bounded exact source '.repeat(1024);
const oversizedHash = sha256(Buffer.from(oversizedContent));
const oversizedExact = resolveExactArtifact({
  stableId: 'oversized-source',
  expectedHash: oversizedHash,
  primaryRef: 'sources/oversized.md',
  available: [{ stableId: 'oversized-source', ref: 'sources/oversized.md', content: oversizedContent }],
  maxBytes: 1024
});
assert.equal(oversizedExact.status, 'CONTEXT_MISS');
assert.equal(oversizedExact.content, null);
assert.equal(oversizedExact.miss.reason, 'EXACT_SOURCE_EXCEEDS_BUDGET');
assert.equal(continuity.protectedState.evidenceRefs.length, 1);

const rawHistoryBytes = Buffer.byteLength(JSON.stringify(rawHistory));
const continuityBytes = Buffer.byteLength(JSON.stringify(continuity));
const protectedChecks = {
  objective: continuity.protectedState.objective === 'continue verified work',
  constraints: continuity.protectedState.constraints.length === 1,
  decisions: continuity.protectedState.acceptedDecisions.length === 1,
  openLoops: continuity.protectedState.openLoops.length === 1,
  exactSourceRefs: continuity.protectedState.evidenceRefs[0].hash === hash,
  terminalStateRef: continuity.protectedState.terminalResult.hash === hash
};
assert.ok(Object.values(protectedChecks).every(Boolean));
assert.equal(retrieval.discovery.bodyCount, 0);
const protectedFieldCoveragePercent = Number(((Object.values(protectedChecks).filter(Boolean).length / Object.values(protectedChecks).length) * 100).toFixed(2));
const semanticKeys = continuity.protectedState.evidenceRefs.map(ref => `${ref.kind}\u0000${ref.id}\u0000${ref.ref}\u0000${ref.hash}`);
const duplicateSemanticObjectCount = semanticKeys.length - new Set(semanticKeys).size;
assert.equal(protectedFieldCoveragePercent, 100);
assert.equal(duplicateSemanticObjectCount, 0);
console.log(JSON.stringify({
  schema: 'pai-context-kit-benchmark/v2',
  status: 'CONTEXT_BENCHMARK_PASS',
  iterations: 1000,
  uniqueSha256: shas.size,
  capsuleEconomy: { inputBytes, outputBytes, selectedItems: first.capsule.items.length, omittedItems: first.capsule.omissions.length },
  continuityEconomy: { rawHistoryBytes, assembledContextBytes: continuityBytes, reductionPercent: Number(((1 - continuityBytes / rawHistoryBytes) * 100).toFixed(2)) },
  continuityQuality: { protectedChecks, passed: Object.values(protectedChecks).every(Boolean), workingItems: continuity.workingSet.length },
  retrievalQuality: { discoveryBodyCount: retrieval.discovery.bodyCount, selectedId: retrieval.selectedId, nextAction: retrieval.next.action, oversizedExactBodyHydrated: oversizedExact.content !== null },
  semanticEconomy: { protectedFieldCoveragePercent, duplicateSemanticObjectCount, verifyImpliesHydrate: false, stopRule: 'NO_MATERIAL_DELTA' },
  contextMissUnknowns: first.capsule.contextMiss.unknownIds.length,
  provenanceNote: 'The broader PAI campaign measured 17,700 to 3,825 p95 visible tokens (78.39%) on its frozen workload. This public benchmark is synthetic and does not claim universal token savings.'
}, null, 2));
