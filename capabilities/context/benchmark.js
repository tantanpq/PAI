'use strict';

const assert = require('node:assert/strict');
const { compile } = require('./context-capsule');

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
console.log(JSON.stringify({
  status: 'CONTEXT_BENCHMARK_PASS',
  iterations: 1000,
  uniqueSha256: shas.size,
  inputBytes,
  outputBytes,
  selectedItems: first.capsule.items.length,
  omittedItems: first.capsule.omissions.length,
  contextMissUnknowns: first.capsule.contextMiss.unknownIds.length,
  note: 'Byte counts are fixture-specific and are not a token-savings claim.'
}, null, 2));
