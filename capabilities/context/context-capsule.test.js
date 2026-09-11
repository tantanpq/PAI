'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { compile } = require('./context-capsule');

const owner = { principalId: 'person-a', accountId: 'account-a', workspaceId: 'space-a' };
const hash = 'a'.repeat(64);
const item = (kind, id, value, extra = {}) => ({ kind, id, value, privacyClass: 'PUBLIC', provenance: { source: 'accepted-evidence' }, freshness: '2026-09-08T00:00:00Z', ...extra });
const allItems = () => [
  item('memory', 'm1', 'prefers concise plans', { privacyClass: 'PERSONAL', qualification: 'ADMITTED' }),
  item('memory', 'm1', 'duplicate lower-order memory', { privacyClass: 'PERSONAL', qualification: 'ADMITTED' }),
  item('intent', 'i1', 'ship deterministic continuity'), item('outcome', 'o1', 'capsule accepted'),
  item('currentPicture', 'cp1', 'memory cards are accepted', { locator: 'Current Picture/ref' }),
  item('programResult', 'pr1', 'DONE/PASS', { locator: 'Program/Phase/Result', hash }),
  item('experience', 'e1', 'known-bad provider overwrite avoided', { locator: 'Experience/ref', hash }),
  item('artifact', 'a1', 'candidate artifact', { locator: '04_CONTEXT_CAPSULE/context-capsule.js', hash }),
  item('unknown', 'u1', 'hosted turn content is unobserved'),
  item('constraint', 'c1', 'must not create another truth store'),
  item('memory', 's1', 'redacted private fact', { privacyClass: 'SECRET' })
];
const request = (profile = 'resume', budget = 20) => ({ owner, profile, budget, items: allItems(), coverage: { observedUserSignals: 3, unobservedHostedChatTurns: 2 } });

test('identical evidence has canonical deterministic output and stable prefix identity', () => {
  const a = compile(request()); const reordered = request(); reordered.items.reverse(); const b = compile(reordered);
  assert.equal(a.canonical, b.canonical); assert.equal(a.sha256, b.sha256); assert.equal(a.capsule.stablePrefixId, b.capsule.stablePrefixId);
  const changed = request(); changed.owner.principalId = 'person-b'; assert.notEqual(compile(changed).capsule.stablePrefixId, a.capsule.stablePrefixId);
});

test('source precedence, dedup, omissions, privacy, budget, unknowns, constraints and exact refs are preserved', () => {
  const result = compile(request('resume', 8)).capsule;
  assert.equal(result.items[0].kind, 'programResult');
  assert.equal(result.items.filter((x) => x.id === 'm1').length, 1);
  assert.ok(result.omissions.some((x) => x.reason === 'DUPLICATE'));
  assert.ok(result.omissions.some((x) => x.reason === 'PRIVACY_REDACTED'));
  assert.ok(result.omissions.some((x) => x.reason === 'BUDGET_EXCEEDED'));
  assert.equal(result.items.length, 8); assert.equal(result.items.find((x) => x.id === 'pr1').locator, 'Program/Phase/Result');
  assert.ok(result.items.some((x) => x.kind === 'constraint'));
  assert.deepEqual(result.contextMiss, { code: 'CONTEXT_MISS', unknownIds: ['u1'] });
});

test('three declared profiles differ only by selection, redaction and budget policy', () => {
  const resume = compile(request('resume')).capsule; const passport = compile(request('passport')).capsule; const work = compile(request('work')).capsule;
  assert.equal(resume.profile, 'Resume Capsule'); assert.equal(passport.profile, 'Continuity Passport'); assert.equal(work.profile, 'Work Context');
  assert.equal(passport.items.some((x) => x.kind === 'currentPicture'), false);
  assert.equal(work.items.some((x) => x.kind === 'memory'), false);
  for (const capsule of [resume, passport, work]) assert.deepEqual(capsule.ownership, { truthStore: 'durable-personal-memory', projectionOnly: true });
});

test('malformed and secret-bearing inputs are rejected without credentials entering output', () => {
  assert.throws(() => compile({}), { code: 'MALFORMED_INPUT' });
  const bad = request(); bad.items.push(item('memory', 'credential', 'api_key="live-value"'));
  assert.throws(() => compile(bad), { code: 'MALFORMED_INPUT' });
});

test('optional enrichment absence or failure cannot alter or block deterministic baseline', () => {
  const absent = compile(request()); const failing = compile(request(), { enricher: () => { throw new Error('offline'); } });
  assert.equal(absent.sha256, failing.sha256); assert.equal(failing.capsule.enrichment.status, 'NOT_USED_DETERMINISTIC_BASELINE');
});

test('projection compilation does not call or mutate durable repository/card adapters', () => {
  const frozen = request(); const before = JSON.stringify(frozen); const result = compile(frozen);
  assert.equal(JSON.stringify(frozen), before); assert.equal(result.capsule.ownership.projectionOnly, true);
  assert.equal(result.capsule.coverage.observedUserSignals, 3); assert.equal(result.capsule.coverage.unobservedHostedChatTurns, 2);
});
