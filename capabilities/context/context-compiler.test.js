'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { PROFILE_CONTRACTS, compileContextPlan, recordContextOutcome } = require('./context-compiler');

const hash = 'a'.repeat(64);
const source = (id, ref, roles, extra = {}) => ({ id, ref, roles, hash, ...extra });

test('commercial profiles are explicit and versioned', () => {
  assert.deepEqual(Object.keys(PROFILE_CONTRACTS).sort(), ['independent-qa','native-domain','product-build','repo-engineering','runtime-repair']);
  for (const profile of Object.values(PROFILE_CONTRACTS)) assert.match(profile.version, /^\d+\.\d+\.\d+$/);
});

test('repo engineering keeps required baseline and only relevant optional pointers', () => {
  const plan = compileContextPlan({
    profile: 'repo-engineering',
    task: { id: 'task-1', objective: 'repair context compiler tests' },
    acceptance: ['tests pass'], authority: 'NONE', scopes: { read: ['repo'], write: ['capabilities/context'] },
    sourceMap: [
      source('repo', 'git:main', ['REPOSITORY_BASELINE'], { name: 'repository baseline', required: true, priority: 10 }),
      source('spec', 'docs/context.md', ['SPEC'], { name: 'context compiler specification', tags: ['context', 'compiler'], priority: 5 }),
      source('mail', 'mail/thread', ['EVIDENCE'], { name: 'unrelated mail thread', tags: ['email'] })
    ]
  });
  assert.equal(plan.status, 'READY');
  assert.deepEqual(plan.selectedSources.map(item => item.id), ['repo','spec']);
  assert.ok(plan.omissions.some(item => item.id === 'mail' && item.reason === 'NOT_RELEVANT_TO_CURRENT_OBJECTIVE'));
  assert.equal(plan.expansionRequests.length, 0);
});

test('missing required source role produces exact missing cone', () => {
  const plan = compileContextPlan({ profile: 'product-build', task: { objective: 'build product UI' }, sourceMap: [source('repo', 'git:main', ['REPOSITORY_BASELINE'])] });
  assert.equal(plan.status, 'CONTEXT_MISS');
  assert.deepEqual(plan.missing[0], { code: 'MISSING_REQUIRED_SOURCE_ROLE', roles: ['PRODUCT_SPEC'] });
});

test('runtime profile requests exact JIT readback but does not hydrate it', () => {
  const plan = compileContextPlan({
    profile: 'runtime-repair', task: { objective: 'diagnose runtime drift' },
    sourceMap: [source('runtime', 'runtime://health', ['RUNTIME_READBACK'], { maxBytes: 4096 })],
    budget: { maxHydrationBytes: 8192 }
  });
  assert.equal(plan.status, 'READY');
  assert.deepEqual(plan.expansionRequests, [{ action: 'EXACT_JIT_FETCH', id: 'runtime', ref: 'runtime://health', expectedHash: hash, maxBytes: 4096 }]);
  assert.equal(Object.hasOwn(plan.selectedSources[0], 'content'), false);
});

test('source bodies are rejected from discovery input', () => {
  assert.throws(() => compileContextPlan({ profile: 'repo-engineering', task: { objective: 'x' }, sourceMap: [{ id: 'repo', ref: 'git:main', roles: ['REPOSITORY_BASELINE'], content: 'do not preload' }] }), { code: 'SOURCE_BODY_IN_DISCOVERY_FORBIDDEN' });
});

test('same semantic source ref merges roles deterministically and conflicting hashes fail', () => {
  const plan = compileContextPlan({
    strategy: { id: 'custom', version: '1.0.0', requiredRoles: ['A','B'], exactRoles: [], optionalRoles: [] },
    task: { objective: 'merge source roles' },
    sourceMap: [source('one', 'ref:1', ['A']), source('two', 'ref:1', ['B'])]
  });
  assert.equal(plan.status, 'READY');
  assert.deepEqual(plan.selectedSources[0].roles, ['A','B']);
  assert.throws(() => compileContextPlan({ strategy: { id: 'custom', version: '1.0.0', requiredRoles: ['A'] }, task: { objective: 'x' }, sourceMap: [source('one','ref:1',['A']), { ...source('two','ref:1',['A']), hash: 'b'.repeat(64) }] }), { code: 'SOURCE_METADATA_CONFLICT' });
});

test('plan identity is deterministic across source ordering', () => {
  const input = {
    profile: 'independent-qa', task: { objective: 'verify exact candidate' },
    acceptance: ['all tests pass'], constraints: ['do not trust builder transcript'],
    sourceMap: [source('tests','tests.md',['TEST_CONTRACT']), source('subject','git:head',['FROZEN_SUBJECT'])]
  };
  const a = compileContextPlan(input);
  const b = compileContextPlan({ ...input, sourceMap: [...input.sourceMap].reverse() });
  assert.equal(a.status, 'READY');
  assert.deepEqual(a.expansionRequests.map(request => request.maxBytes), [16384, 16384]);
  assert.equal(a.contextPlanId, b.contextPlanId);
  assert.equal(a.taskFingerprint, b.taskFingerprint);
});

test('context episode links strategy to accepted result without raw content', () => {
  const plan = compileContextPlan({ profile: 'native-domain', task: { objective: 'read native object' }, sourceMap: [source('object','native:1',['NATIVE_OBJECT'])] });
  const episode = recordContextOutcome({ plan, result: { resultId: 'result-1', disposition: 'ACCEPTED', accepted: true, verificationRef: 'receipt:1', inputTokens: 120, outputTokens: 40, correctionCount: 0, restatementCount: 0 } });
  assert.equal(episode.outcome.accepted, true);
  assert.equal(episode.rawContentStored, false);
  assert.match(episode.episodeId, /^[a-f0-9]{64}$/);
  assert.throws(() => recordContextOutcome({ plan, result: { resultId: 'bad', disposition: 'ACCEPTED', prompt: 'raw secret' } }), { code: 'RAW_OUTCOME_BODY_FORBIDDEN' });
  assert.throws(() => recordContextOutcome({ plan, result: { resultId: 'bad-2', disposition: 'REJECTED', accepted: true } }), { code: 'CONTEXT_EPISODE_RESULT_INVALID' });
});
