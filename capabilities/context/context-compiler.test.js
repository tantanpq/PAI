'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { PROFILE_CONTRACTS, VOLATILITY, compileContextPlan, recordContextOutcome, assertPlanIntegrity } = require('./context-compiler');

const hash = 'a'.repeat(64);
const source = (id, ref, roles, extra = {}) => ({ id, ref, roles, hash, ...extra });

test('commercial profiles are explicit and versioned', () => {
  assert.deepEqual(Object.keys(PROFILE_CONTRACTS).sort(), ['independent-qa','native-domain','product-build','repo-engineering','runtime-repair']);
  for (const profile of Object.values(PROFILE_CONTRACTS)) {
    assert.match(profile.version, /^\d+\.\d+\.\d+$/);
    assert.equal(Object.isFrozen(profile), true);
    assert.equal(Object.isFrozen(profile.requiredRoles), true);
    assert.equal(Object.isFrozen(profile.exactRoles), true);
    assert.equal(Object.isFrozen(profile.optionalRoles), true);
  }
  assert.deepEqual(PROFILE_CONTRACTS['runtime-repair'].requiredRoles, ['DESIRED_STATE','RUNTIME_READBACK']);
  assert.throws(() => PROFILE_CONTRACTS['repo-engineering'].requiredRoles.push('MUTATED'), TypeError);
});

test('strategy declaration is unambiguous and explicit invalid profiles fail closed', () => {
  assert.throws(
    () => compileContextPlan({
      profile: 'does-not-exist',
      task: { objective: 'x' },
      sourceMap: []
    }),
    { code: 'CONTEXT_PROFILE_INVALID' }
  );
  assert.throws(
    () => compileContextPlan({
      profile: 'repo-engineering',
      strategy: { id: 'custom', version: '1.0.0' },
      task: { objective: 'x' },
      sourceMap: []
    }),
    { code: 'CONTEXT_STRATEGY_AMBIGUOUS' }
  );
});

test('source metadata explicit invalid values fail closed', () => {
  for (const [field, value, code] of [
    ['required', 'true', 'SOURCE_REQUIRED_INVALID'],
    ['available', 'false', 'SOURCE_AVAILABLE_INVALID'],
    ['priority', 'high', 'SOURCE_PRIORITY_INVALID'],
    ['volatility', 'PERMANENT', 'SOURCE_VOLATILITY_INVALID'],
    ['resolution', 'FULL_BODY', 'SOURCE_RESOLUTION_INVALID'],
    ['authorityClass', 0, 'SOURCE_AUTHORITY_CLASS_INVALID'],
    ['truthClass', false, 'SOURCE_TRUTH_CLASS_INVALID']
  ]) {
    assert.throws(
      () => compileContextPlan({
        profile: 'repo-engineering',
        task: { objective: 'validate metadata' },
        sourceMap: [{ id: 'repo', ref: 'git:main', roles: ['REPOSITORY_BASELINE'], [field]: value }]
      }),
      { code }
    );
  }
});

test('required-role coverage reranks against still-uncovered roles', () => {
  const plan = compileContextPlan({
    strategy: {
      id: 'cover',
      version: '1.0.0',
      requiredRoles: ['A', 'B', 'C', 'D'],
      exactRoles: [],
      optionalRoles: [],
      maxSelectedSources: 2
    },
    task: { objective: 'cover all required roles within two refs' },
    query: 'no-optional-match',
    sourceMap: [
      source('ab', 'ref:ab', ['A', 'B'], { priority: 100 }),
      source('ac', 'ref:ac', ['A', 'C'], { priority: 90 }),
      source('bd', 'ref:bd', ['B', 'D'], { priority: 80 }),
      source('cd', 'ref:cd', ['C', 'D'], { priority: 1 })
    ]
  });
  assert.equal(plan.status, 'READY');
  assert.deepEqual(plan.selectedSources.map(item => item.id), ['ab', 'cd']);
  assert.deepEqual(plan.missing, []);
});

test('explicit null protected arrays fail closed rather than becoming empty', () => {
  for (const [field, code] of [
    ['constraints', 'CONSTRAINTS_INVALID'],
    ['acceptedDecisions', 'DECISIONS_INVALID'],
    ['acceptance', 'ACCEPTANCE_INVALID'],
    ['negations', 'NEGATIONS_INVALID'],
    ['contradictions', 'CONTRADICTIONS_INVALID'],
    ['supersessionRefs', 'SUPERSESSION_REFS_INVALID']
  ]) {
    assert.throws(
      () => compileContextPlan({
        profile: 'repo-engineering',
        task: { objective: 'preserve protected arrays' },
        [field]: null,
        sourceMap: [source('repo', 'git:main', ['REPOSITORY_BASELINE'])]
      }),
      { code }
    );
  }
  for (const [field, code] of [['read', 'READ_SCOPE_INVALID'], ['write', 'WRITE_SCOPE_INVALID']]) {
    assert.throws(
      () => compileContextPlan({
        profile: 'repo-engineering',
        task: { objective: 'preserve protected scopes' },
        scopes: { [field]: null },
        sourceMap: [source('repo', 'git:main', ['REPOSITORY_BASELINE'])]
      }),
      { code }
    );
  }
});

test('required roles need one selected source, while explicit required refs remain exact requirements', () => {
  const rolePlan = compileContextPlan({
    profile: 'repo-engineering',
    task: { objective: 'compile repository change' },
    query: 'no-extra-context-match',
    sourceMap: [
      source('primary', 'git:primary', ['REPOSITORY_BASELINE'], { priority: 10 }),
      source('alternate', 'git:alternate', ['REPOSITORY_BASELINE'], { priority: 1 })
    ]
  });
  assert.equal(rolePlan.status, 'READY');
  assert.deepEqual(rolePlan.selectedSources.map(item => item.id), ['primary']);
  assert.ok(rolePlan.omissions.some(item => item.id === 'alternate' && item.required === false));

  const multiRole = compileContextPlan({
    strategy: { id: 'multi-role', version: '1.0.0', requiredRoles: ['A', 'B'], exactRoles: [], optionalRoles: [] },
    task: { objective: 'minimum sufficient required roles' },
    query: 'no-extra-context-match',
    sourceMap: [
      source('one-role', 'ref:a', ['A'], { priority: 100 }),
      source('two-roles', 'ref:ab', ['A', 'B'], { priority: 1 })
    ]
  });
  assert.equal(multiRole.status, 'READY');
  assert.deepEqual(multiRole.selectedSources.map(item => item.id), ['two-roles']);

  const exactRequired = compileContextPlan({
    profile: 'repo-engineering',
    task: { objective: 'compile repository change' },
    budget: { maxSelectedSources: 1 },
    sourceMap: [
      source('primary', 'git:primary', ['REPOSITORY_BASELINE'], { required: true, priority: 10 }),
      source('must-have', 'evidence:must-have', ['EVIDENCE'], { required: true, priority: 9 })
    ]
  });
  assert.equal(exactRequired.status, 'CONTEXT_MISS');
  assert.ok(exactRequired.missing.some(item => item.code === 'REQUIRED_SOURCE_NOT_SELECTED'));
});

test('profile source ceiling cannot be widened by caller budget', () => {
  const sourceMap = [
    source('repo', 'git:main', ['REPOSITORY_BASELINE'], { priority: 100 }),
    ...Array.from({ length: 9 }, (_, index) =>
      source(`spec-${index}`, `spec:${index}`, ['SPEC'], { tags: ['context'], priority: 50 - index })
    )
  ];
  const plan = compileContextPlan({
    profile: 'repo-engineering',
    task: { objective: 'use context specs' },
    query: 'context',
    budget: { maxSelectedSources: 100 },
    sourceMap
  });
  assert.equal(plan.status, 'READY');
  assert.equal(plan.budgetDecision.maxSelectedSources, PROFILE_CONTRACTS['repo-engineering'].maxSelectedSources);
  assert.equal(plan.selectedSources.length, PROFILE_CONTRACTS['repo-engineering'].maxSelectedSources);
  assert.ok(plan.omissions.some(item => item.reason === 'SOURCE_LIMIT_EXCEEDED'));
});

test('custom strategy contract digest prevents built-in id collision and semantic aliasing', () => {
  const a = compileContextPlan({
    strategy: { id: 'repo-engineering', version: '1.0.0', requiredRoles: ['A'], exactRoles: [], optionalRoles: [] },
    task: { objective: 'same task' },
    sourceMap: [source('one', 'ref:1', ['A'])]
  });
  const b = compileContextPlan({
    strategy: { id: 'repo-engineering', version: '1.0.0', requiredRoles: ['B'], exactRoles: [], optionalRoles: [] },
    task: { objective: 'same task' },
    sourceMap: [source('one', 'ref:1', ['B'])]
  });
  assert.equal(a.strategy.profile, null);
  assert.equal(b.strategy.profile, null);
  assert.notEqual(a.strategy.contractDigest, b.strategy.contractDigest);
  assert.notEqual(a.taskFingerprint, b.taskFingerprint);
  assert.notEqual(a.contextPlanId, b.contextPlanId);
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


test('custom strategy ceilings fail closed when explicitly invalid', () => {
  for (const maxSelectedSources of [0, -1, 1.5, '2']) {
    assert.throws(
      () => compileContextPlan({
        strategy: {
          id: 'custom-budget',
          version: '1.0.0',
          requiredRoles: ['A'],
          exactRoles: [],
          optionalRoles: [],
          maxSelectedSources
        },
        task: { objective: 'respect custom strategy ceiling' },
        sourceMap: [source('one', 'ref:1', ['A'])]
      }),
      { code: 'STRATEGY_MAX_SELECTED_SOURCES_INVALID' }
    );
  }
});

test('explicit malformed protected classifications fail closed', () => {
  for (const [field, value, code] of [
    ['privacyClass', '', 'PRIVACY_CLASS_INVALID'],
    ['authority', 0, 'AUTHORITY_INVALID'],
    ['effectClass', false, 'EFFECT_CLASS_INVALID'],
    ['outputContract', {}, 'OUTPUT_CONTRACT_INVALID'],
    ['truthState', [], 'TRUTH_STATE_INVALID'],
    ['sourceStatus', '', 'SOURCE_STATUS_INVALID']
  ]) {
    assert.throws(
      () => compileContextPlan({
        profile: 'repo-engineering',
        task: { objective: 'protect classifications' },
        [field]: value,
        sourceMap: [source('repo', 'git:main', ['REPOSITORY_BASELINE'])]
      }),
      { code }
    );
  }
  assert.throws(
    () => compileContextPlan({
      profile: 'repo-engineering',
      task: { objective: 'protect scopes' },
      scopes: 'repo',
      sourceMap: [source('repo', 'git:main', ['REPOSITORY_BASELINE'])]
    }),
    { code: 'SCOPES_INVALID' }
  );
  assert.throws(
    () => compileContextPlan({
      profile: 'repo-engineering',
      task: { objective: 'protect effect scope' },
      scopes: { effect: false },
      sourceMap: [source('repo', 'git:main', ['REPOSITORY_BASELINE'])]
    }),
    { code: 'EFFECT_SCOPE_INVALID' }
  );
});

test('explicit invalid budgets fail closed instead of widening to defaults', () => {
  for (const budget of [
    { maxSelectedSources: 0 },
    { maxSelectedSources: null },
    { maxMetadataBytes: 511 },
    { maxMetadataBytes: null },
    { maxHydrationBytes: -1 },
    { maxHydrationBytes: null }
  ]) {
    assert.throws(
      () => compileContextPlan({
        profile: 'repo-engineering',
        task: { objective: 'respect caller budget' },
        budget,
        sourceMap: [source('repo', 'git:main', ['REPOSITORY_BASELINE'])]
      }),
      { code: 'CONTEXT_BUDGET_INVALID' }
    );
  }
});

test('exact-JIT sources require a verifiable expected hash', () => {
  const miss = compileContextPlan({
    profile: 'native-domain',
    task: { objective: 'read exact native object' },
    sourceMap: [{ id: 'object', ref: 'native:1', roles: ['NATIVE_OBJECT'] }]
  });
  assert.equal(miss.status, 'CONTEXT_MISS');
  assert.deepEqual(miss.missing, [{ code: 'EXACT_SOURCE_HASH_REQUIRED', sourceIds: ['object'] }]);
  assert.deepEqual(miss.expansionRequests, []);
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

test('protected task identity and episode metadata reject malformed explicit values', () => {
  assert.throws(
    () => compileContextPlan({
      profile: 'repo-engineering',
      task: { objective: 'protect task identity', projectRef: 0 },
      sourceMap: [source('repo', 'git:main', ['REPOSITORY_BASELINE'])]
    }),
    { code: 'PROJECT_REF_INVALID' }
  );
  const plan = compileContextPlan({
    profile: 'repo-engineering',
    task: { objective: 'protect episode metadata' },
    sourceMap: [source('repo', 'git:main', ['REPOSITORY_BASELINE'])]
  });
  assert.throws(
    () => recordContextOutcome({
      plan,
      result: { resultId: 'r', disposition: 'UNKNOWN', provider: 7 }
    }),
    { code: 'CONTEXT_EPISODE_RESULT_INVALID' }
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
  assert.deepEqual(episode.omittedSources, plan.omissions);
  assert.deepEqual(episode.missing, plan.missing);
  assert.deepEqual(episode.expansionRequests, plan.expansionRequests);
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
