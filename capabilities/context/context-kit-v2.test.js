'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { planRetrieval, resolveExactArtifact, convergeLifecycleProjection, buildContinuityCarrier, buildSuccessorCheckpoint, sha256 } = require('./index');

test('broad discovery is metadata-only and selects one exact JIT ref', () => {
  const plan = planRetrieval({ query: 'context budget', candidates: [
    { id: 'budget', ref: 'src/context-budget.js', name: 'Context budget', tags: ['context', 'budget'], sizeBytes: 1200 },
    { id: 'health', ref: 'src/health.js', name: 'Health', tags: ['status'], sizeBytes: 900 }
  ], maxResults: 2 });
  assert.equal(plan.status, 'READY');
  assert.equal(plan.discovery.bodyCount, 0);
  assert.equal(plan.next.action, 'EXACT_JIT_FETCH');
  assert.equal(plan.selectedId, 'budget');
  const miss = planRetrieval({ query: 'unrelated', candidates: [{ id: 'budget', ref: 'src/context-budget.js' }] });
  assert.equal(miss.status, 'CONTEXT_MISS');
  assert.equal(miss.pointers.length, 0);
  assert.throws(() => planRetrieval({ query: 'x', candidates: [{ id: 'x', ref: 'x.md', content: 'hydrated' }] }), { code: 'BROAD_DISCOVERY_BODY_FORBIDDEN' });
});

test('exact artifact lookup uses a bounded archive pointer and verifies hash', () => {
  const content = 'verified terminal artifact'; const hash = sha256(Buffer.from(content));
  const result = resolveExactArtifact({ stableId: 'TASK-1', expectedHash: hash, primaryRef: 'items/task.md', archiveRef: 'archive/items/task.md', available: [{ stableId: 'TASK-1', ref: 'archive/items/task.md', content }] });
  assert.equal(result.status, 'READY');
  assert.equal(result.source, 'ARCHIVE_EXACT_REF');
  assert.throws(() => resolveExactArtifact({ stableId: 'TASK-1', expectedHash: hash, primaryRef: 'items/task.md', archiveRef: 'archive/items/task.md', available: [{ stableId: 'TASK-1', ref: 'archive/items/task.md', content: 'drift' }] }), { code: 'EXACT_ARTIFACT_HASH_DRIFT' });
});

test('stable identity rejects a stale running attempt after terminal retry', () => {
  const projection = convergeLifecycleProjection({ stableId: 'TASK-1', cachedAttemptId: 'attempt-old', attempts: [
    { stableId: 'TASK-1', attemptId: 'attempt-old', state: 'RUNNING', updatedAt: '2026-09-18T19:00:00Z' },
    { stableId: 'TASK-1', attemptId: 'attempt-new', state: 'DONE', updatedAt: '2026-09-18T19:12:00Z' }
  ] });
  assert.equal(projection.state, 'DONE');
  assert.equal(projection.source, 'STABLE_ID_FALLBACK');
  assert.equal(projection.staleCachedAttemptRejected, true);
});

const continuityInput = () => ({
  objective: 'resume one bounded outcome', nextOutcome: 'verify exact release',
  constraints: ['do not invent authority'], acceptedDecisions: ['metadata-first retrieval'], openLoops: ['publish after QA'],
  programRefs: ['PROGRAM/CONTEXT'],
  evidenceRefs: [{ id: 'result-1', ref: 'results/RESULT.md', hash: 'a'.repeat(64), kind: 'result' }],
  terminalResult: { id: 'terminal-1', ref: 'handoffs/HANDOFF.md', hash: 'b'.repeat(64), kind: 'terminal' },
  workingSet: [{ id: 'recent-2', value: 'latest useful turn', createdAt: '2026-09-18T19:10:00Z', sourceRef: 'turn:2' }, { id: 'recent-1', value: 'older useful turn', createdAt: '2026-09-18T19:00:00Z', sourceRef: 'turn:1' }],
  budget: { totalBytes: 4096, outputReserveBytes: 512, maxWorkingItems: 1 }
});

test('protected continuity survives budget pressure while working history stays bounded', () => {
  const carrier = buildContinuityCarrier(continuityInput());
  assert.equal(carrier.status, 'READY');
  assert.equal(carrier.workingSet.length, 1);
  assert.equal(carrier.protectedState.acceptedDecisions[0], 'metadata-first retrieval');
  assert.equal(carrier.protectedState.terminalResult.hash, 'b'.repeat(64));
  assert.equal(carrier.archivePolicy.rawHistory, 'COLD_NOT_PRELOADED');
  assert.throws(() => buildContinuityCarrier({ ...continuityInput(), rawHistory: ['whole transcript'] }), { code: 'RAW_HISTORY_NOT_ACCEPTED' });
});

test('successor checkpoint excludes the working transcript deterministically', () => {
  const first = buildSuccessorCheckpoint(continuityInput());
  const second = buildSuccessorCheckpoint(continuityInput());
  assert.equal(first.workingSet.length, 0);
  assert.equal(first.sha256, second.sha256);
});

test('protected continuity overflow fails closed without echoing the oversized payload', () => {
  const result = buildContinuityCarrier({ ...continuityInput(), constraints: ['x'.repeat(5000)], budget: { totalBytes: 512, outputReserveBytes: 128, maxWorkingItems: 0 } });
  assert.equal(result.status, 'CONTEXT_MISS');
  assert.equal(result.protectedState, null);
  assert.match(result.protectedDigest, /^[a-f0-9]{64}$/);
  assert.equal(result.miss.reason, 'PROTECTED_CONTINUITY_EXCEEDS_BUDGET');
});
