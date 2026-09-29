'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { PROFILE_CONTRACTS, VOLATILITY, compileContextPlan, recordContextOutcome, assertPlanIntegrity } = require('./context-compiler');

const hash = 'a'.repeat(64);
const source = (id, ref, roles, extra = {}) => ({ id, ref, roles, hash, ...extra });

test('commercial profiles are explicit and versioned', () => {
  assert.deepEqual(Object.keys(PROFILE_CONTRACTS).sort(), ['independent-qa','native-domain','product-build','repo-engineering','runtime-repair']);
  for (const profile of Object.values(PROFILE_CONTRACTS)) assert.match(profile.version, /^\d+\.\d+\.\d+$/);
  assert.deepEqual(PROFILE_CONTRACTS['runtime-repair'].requiredRoles, ['DESIRED_STATE','RUNTIME_READBACK']);
});

test('repo engineering keeps required baseline and only relevant optional pointers', () => {
  const plan = compileContextPlan({
    profile: 'repo-engineering',
    task: { id: 'task-1', objective: 'repair context compiler tests' },
    acceptance: ['tests pass'], authority: 'NONE', scopes: { read: ['repo'], write: ['capabilities/context'] },
    sourceMap: [
      source('repo', 'git:main', ['REPOSITORY_BASELINE'], { name: 'repository baseline', required: true, priority: 10, volatility: VOLATILITY.STABLE }),
      source('spec', 'docs/context.md', ['SPEC'], { name: 'context compiler specification', tags: ['context', 'compiler'], priority: 5 }),
      source('mail', 'mail/thread', ['EVIDENCE'], { name: 'unrelated mail thread', tags: ['email'] }),
      source('leak', 'other/context-compiler.md', ['UNRELATED_PRIVATE_ROLE'], { name: 'context compiler secret map', tags: ['context', 'compiler'], priority: 50 })
    ]
  });
  assert.equal(plan.status, 'READY');
  assert.deepEqual(plan.selectedSources.map(item => item.id), ['repo','spec']);
  assert.ok(plan.omissions.some(item => item.id === 'mail' && item.reason === 'NOT_RELEVANT_TO_CURRENT_OBJECTIVE'));
  assert.ok(plan.omissions.some(item => item.id === 'leak' && item.reason === 'ROLE_NOT_ALLOWED_BY_STRATEGY'));
  assert.equal(plan.expansionRequests.length, 0);
  assert.equal(plan.cachePlan.mode, 'STABLE_PREFIX_CANDIDATE');
  assert.match(plan.cachePlan.stablePrefixId, /^[a-f0-9]{64}$/);
  assert.deepEqual(plan.cachePlan.stableSources.map(item => item.id), ['repo']);
  assert.deepEqual(plan.cachePlan.dynamicSources.map(item => item.id), ['spec']);
});

test('missing required source role produces exact missing cone', () => {
  const plan = compileContextPlan({ profile: 'product-build', task: { objective: 'build product UI' }, sourceMap: [source('repo', 'git:main', ['REPOSITORY_BASELINE'])] });
  assert.equal(plan.status, 'CONTEXT_MISS');
  assert.deepEqual(plan.missing[0], { code: 'MISSING_REQUIRED_SOURCE_ROLE', roles: ['PRODUCT_SPEC'] });
});

test('runtime profile requests exact JIT readback but does not hydrate it', () => {
  const plan = compileContextPlan({
    profile: 'runtime-repair', task: { objective: 'diagnose runtime drift' },
    sourceMap: [
      source('desired', 'git:release-manifest', ['DESIRED_STATE'], { volatility: VOLATILITY.STABLE }),
      source('runtime', 'runtime://health', ['RUNTIME_READBACK'], { maxBytes: 4096, volatility: VOLATILITY.LIVE })
    ],
    budget: { maxHydrationBytes: 8192 }
  });
  assert.equal(plan.status, 'READY');
  assert.deepEqual(plan.expansionRequests, [{ action: 'EXACT_JIT_FETCH', id: 'runtime', ref: 'runtime://health', expectedHash: hash, maxBytes: 4096 }]);
  assert.equal(Object.hasOwn(plan.selectedSources[0], 'content'), false);
  const missingDesired = compileContextPlan({
    profile: 'runtime-repair',
    task: { objective: 'repair runtime drift' },
    sourceMap: [source('runtime', 'runtime://health', ['RUNTIME_READBACK'], { maxBytes: 4096 })]
  });
  assert.equal(missingDesired.status, 'CONTEXT_MISS');
  assert.deepEqual(missingDesired.missing[0], { code: 'MISSING_REQUIRED_SOURCE_ROLE', roles: ['DESIRED_STATE'] });
});

test('source bodies are rejected from discovery input', () => {
  assert.throws(() => compileContextPlan({ profile: 'repo-engineering', task: { objective: 'x' }, sourceMap: [{ id: 'repo', ref: 'git:main', roles: ['REPOSITORY_BASELINE'], content: 'do not preload' }] }), { code: 'SOURCE_BODY_IN_DISCOVERY_FORBIDDEN' });
});

test('same semantic source ref merges roles deterministically and conflicting hashes fail', () => {
  const input = {
    strategy: { id: 'custom', version: '1.0.0', requiredRoles: ['A','B'], exactRoles: [], optionalRoles: [] },
    task: { objective: 'merge source roles' },
    sourceMap: [
      source('two', 'ref:1', ['B'], { name: 'Zulu alias' }),
      source('one', 'ref:1', ['A'], { name: 'Alpha alias' })
    ]
  };
  const plan = compileContextPlan(input);
  const reversed = compileContextPlan({ ...input, sourceMap: [...input.sourceMap].reverse() });
  assert.equal(plan.status, 'READY');
  assert.deepEqual(plan.selectedSources[0].roles, ['A','B']);
  assert.equal(plan.selectedSources[0].id, 'one');
  assert.equal(plan.selectedSources[0].name, 'Alpha alias');
  assert.equal(plan.contextPlanId, reversed.contextPlanId);
  assert.throws(() => compileContextPlan({ strategy: { id: 'custom', version: '1.0.0', requiredRoles: ['A'] }, task: { objective: 'x' }, sourceMap: [source('one','ref:1',['A']), { ...source('two','ref:1',['A']), hash: 'b'.repeat(64) }] }), { code: 'SOURCE_METADATA_CONFLICT' });
  assert.throws(() => compileContextPlan({
    strategy: { id: 'custom', version: '1.0.0', requiredRoles: ['A'] },
    task: { objective: 'x' },
    sourceMap: [
      source('one','ref:1',['A'], { authorityClass: 'READ_ONLY' }),
      source('two','ref:1',['A'], { authorityClass: 'WRITE' })
    ]
  }), { code: 'SOURCE_METADATA_CONFLICT' });
});


test('required sources fail closed when the selected-source ceiling is exceeded', () => {
  const plan = compileContextPlan({
    strategy: { id: 'bounded', version: '1.0.0', requiredRoles: [], exactRoles: [], optionalRoles: [], maxSelectedSources: 1 },
    task: { objective: 'bounded required refs' },
    budget: { maxSelectedSources: 1 },
    sourceMap: [
      source('one','ref:1',['CUSTOM'], { required: true, priority: 2 }),
      source('two','ref:2',['CUSTOM'], { required: true, priority: 1 })
    ]
  });
  assert.equal(plan.status, 'CONTEXT_MISS');
  assert.ok(plan.omissions.some(item => item.id === 'two' && item.reason === 'REQUIRED_SOURCE_LIMIT_EXCEEDED'));
  assert.ok(plan.missing.some(item => item.code === 'REQUIRED_SOURCE_NOT_SELECTED'));
});

test('plan identity is deterministic across source ordering', () => {
  const input = {
    profile: 'independent-qa', task: { objective: 'verify exact candidate' },
    acceptance: ['all tests pass'], constraints: ['do not trust builder transcript'],
    truthState: 'CANDIDATE', sourceStatus: 'EXACT_HEAD',
    negations: ['do not trust builder transcript'], contradictions: ['stale handoff conflicts with exact head'],
    supersessionRefs: ['pr:older-head'],
    sourceMap: [source('tests','tests.md',['TEST_CONTRACT']), source('subject','git:head',['FROZEN_SUBJECT'])]
  };
  const a = compileContextPlan(input);
  const b = compileContextPlan({ ...input, sourceMap: [...input.sourceMap].reverse() });
  assert.equal(a.status, 'READY');
  assert.deepEqual(a.expansionRequests.map(request => request.maxBytes), [16384, 16384]);
  assert.equal(a.contextPlanId, b.contextPlanId);
  assert.equal(a.taskFingerprint, b.taskFingerprint);
  assert.deepEqual(a.protectedState.negations, ['do not trust builder transcript']);
  assert.equal(a.protectedState.truthState, 'CANDIDATE');
  assert.equal(a.protectedState.sourceStatus, 'EXACT_HEAD');
  assert.deepEqual(a.protectedState.supersessionRefs, ['pr:older-head']);
});

test('compiled plan is deeply immutable and outcome recording rejects tampered plan identity', () => {
  const plan = compileContextPlan({
    profile: 'repo-engineering',
    task: { objective: 'bind exact plan identity' },
    acceptance: ['identity preserved'],
    sourceMap: [source('repo', 'git:main', ['REPOSITORY_BASELINE'], { volatility: VOLATILITY.STABLE })]
  });
  assert.equal(assertPlanIntegrity(plan), true);
  assert.equal(Object.isFrozen(plan), true);
  assert.equal(Object.isFrozen(plan.selectedSources), true);
  assert.equal(Object.isFrozen(plan.selectedSources[0]), true);
  assert.throws(() => { plan.selectedSources.push(source('late', 'git:late', ['SPEC'])); }, TypeError);
  const tampered = structuredClone(plan);
  tampered.protectedState.objective = 'tampered objective';
  assert.throws(
    () => recordContextOutcome({ plan: tampered, result: { resultId: 'tampered', disposition: 'UNKNOWN' } }),
    { code: 'CONTEXT_PLAN_INTEGRITY_MISMATCH' }
  );
});

test('context episode links strategy to accepted result without raw content', () => {
  const plan = compileContextPlan({ profile: 'native-domain', task: { objective: 'read native object' }, sourceMap: [source('object','native:1',['NATIVE_OBJECT'])] });
  const episode = recordContextOutcome({ plan, result: {
    resultId: 'result-1', disposition: 'ACCEPTED', accepted: true, verificationRef: 'receipt:1',
    acceptanceContractRef: 'acceptance:v1', baselinePlanId: 'baseline:1',
    provider: 'provider-a', model: 'model-a', tokenizer: 'tokenizer-a', falseSuccess: false,
    inputTokens: 120, outputTokens: 40, inputBytes: 600, outputBytes: 180, hydratedBytes: 256,
    toolCallCount: 2, correctionCount: 0, restatementCount: 0
  } });
  assert.equal(episode.outcome.accepted, true);
  assert.equal(episode.evaluation.acceptanceContractRef, 'acceptance:v1');
  assert.equal(episode.evaluation.falseSuccess, false);
  assert.equal(episode.metrics.hydratedBytes, 256);
  assert.equal(episode.metrics.toolCallCount, 2);
  assert.equal(episode.rawContentStored, false);
  const unmeasured = recordContextOutcome({
    plan,
    result: { resultId: 'result-unmeasured', disposition: 'UNKNOWN' }
  });
  assert.equal(unmeasured.metrics.correctionCount, null);
  assert.equal(unmeasured.metrics.restatementCount, null);
  assert.equal(unmeasured.metrics.contextMissCount, null);
  assert.equal(unmeasured.metrics.toolCallCount, null);
  assert.match(episode.episodeId, /^[a-f0-9]{64}$/);
  assert.throws(() => recordContextOutcome({ plan, result: { resultId: 'bad', disposition: 'ACCEPTED', prompt: 'raw secret' } }), { code: 'RAW_OUTCOME_BODY_FORBIDDEN' });
  assert.throws(() => recordContextOutcome({ plan, result: { resultId: 'bad-2', disposition: 'REJECTED', accepted: true } }), { code: 'CONTEXT_EPISODE_RESULT_INVALID' });
});
