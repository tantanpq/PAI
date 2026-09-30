'use strict';

const crypto = require('node:crypto');

const BODY_FIELDS = Object.freeze(['body', 'content', 'fullContent', 'raw', 'text', 'transcript', 'messages', 'prompt']);
const RESOLUTION = Object.freeze({ POINTER_ONLY: 'POINTER_ONLY', EXACT_JIT: 'EXACT_JIT' });
const VOLATILITY = Object.freeze({ STABLE: 'STABLE', SESSION: 'SESSION', LIVE: 'LIVE' });
const VOLATILITY_RANK = Object.freeze({ STABLE: 0, SESSION: 1, LIVE: 2 });
const OUTCOME_DISPOSITIONS = new Set(['ACCEPTED', 'REJECTED', 'NEEDS_REVISION', 'UNKNOWN']);

const PROFILE_CONTRACTS = Object.freeze({
  'repo-engineering': Object.freeze({
    id: 'repo-engineering', version: '1.0.0', requiredRoles: ['REPOSITORY_BASELINE'],
    exactRoles: [], optionalRoles: ['SPEC', 'RESULT', 'EVIDENCE', 'DEPENDENCY'], maxSelectedSources: 8
  }),
  'product-build': Object.freeze({
    id: 'product-build', version: '1.0.0', requiredRoles: ['PRODUCT_SPEC', 'REPOSITORY_BASELINE'],
    exactRoles: ['PRODUCT_SPEC'], optionalRoles: ['RESULT', 'EVIDENCE', 'DEPENDENCY', 'ASSET'], maxSelectedSources: 10
  }),
  'runtime-repair': Object.freeze({
    id: 'runtime-repair', version: '1.0.0', requiredRoles: ['DESIRED_STATE', 'RUNTIME_READBACK'],
    exactRoles: ['RUNTIME_READBACK'], optionalRoles: ['REPOSITORY_BASELINE', 'RESULT', 'EVIDENCE'], maxSelectedSources: 8
  }),
  'independent-qa': Object.freeze({
    id: 'independent-qa', version: '1.0.0', requiredRoles: ['FROZEN_SUBJECT', 'TEST_CONTRACT'],
    exactRoles: ['FROZEN_SUBJECT', 'TEST_CONTRACT'], optionalRoles: ['DEPENDENCY', 'RESULT', 'EVIDENCE'], maxSelectedSources: 10
  }),
  'native-domain': Object.freeze({
    id: 'native-domain', version: '1.0.0', requiredRoles: ['NATIVE_OBJECT'],
    exactRoles: ['NATIVE_OBJECT'], optionalRoles: ['POLICY', 'EVIDENCE'], maxSelectedSources: 6
  })
});

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function object(value) { return value && typeof value === 'object' && !Array.isArray(value); }
function deepFreeze(value) {
  if (!value || typeof value !== 'object') return value;
  for (const child of Object.values(value)) deepFreeze(child);
  if (!Object.isFrozen(value)) Object.freeze(value);
  return value;
}
deepFreeze(PROFILE_CONTRACTS);
function text(value) { return typeof value === 'string' && value.trim().length > 0; }
function optionalText(owner, field, fallback, code) {
  if (!Object.hasOwn(owner, field)) return fallback;
  if (!text(owner[field])) fail(code);
  return owner[field].trim();
}
function strings(value, code) {
  if (value == null) return [];
  if (!Array.isArray(value) || value.some(item => !text(item))) fail(code);
  return [...new Set(value.map(item => item.trim()))].sort();
}
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (object(value)) return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
function sha256(value) { return crypto.createHash('sha256').update(typeof value === 'string' ? value : canonical(value)).digest('hex'); }
function jsonBytes(value) { return Buffer.byteLength(JSON.stringify(value), 'utf8'); }
function assertNoBodies(value, code) {
  if (!object(value)) return;
  if (BODY_FIELDS.some(field => Object.hasOwn(value, field))) fail(code);
}

function strategyFor(input = {}) {
  const hasProfile = Object.hasOwn(input, 'profile');
  const hasStrategy = Object.hasOwn(input, 'strategy');
  if (hasProfile && hasStrategy) fail('CONTEXT_STRATEGY_AMBIGUOUS');
  if (hasProfile) {
    if (!text(input.profile) || !PROFILE_CONTRACTS[input.profile]) fail('CONTEXT_PROFILE_INVALID');
    return PROFILE_CONTRACTS[input.profile];
  }
  if (hasStrategy) {
    if (!object(input.strategy) || !text(input.strategy.id) || !text(input.strategy.version)) fail('CONTEXT_STRATEGY_INVALID');
    const hasStrategyLimit = Object.hasOwn(input.strategy, 'maxSelectedSources');
    if (hasStrategyLimit && (!Number.isSafeInteger(input.strategy.maxSelectedSources) || input.strategy.maxSelectedSources <= 0)) {
      fail('STRATEGY_MAX_SELECTED_SOURCES_INVALID');
    }
    return deepFreeze({
      id: input.strategy.id.trim(), version: input.strategy.version.trim(),
      requiredRoles: strings(input.strategy.requiredRoles, 'STRATEGY_REQUIRED_ROLES_INVALID'),
      exactRoles: strings(input.strategy.exactRoles, 'STRATEGY_EXACT_ROLES_INVALID'),
      optionalRoles: strings(input.strategy.optionalRoles, 'STRATEGY_OPTIONAL_ROLES_INVALID'),
      maxSelectedSources: hasStrategyLimit ? input.strategy.maxSelectedSources : 8
    });
  }
  fail('CONTEXT_STRATEGY_REQUIRED');
}
function normalizeSource(source) {
  if (!object(source)) fail('SOURCE_METADATA_INVALID');
  assertNoBodies(source, 'SOURCE_BODY_IN_DISCOVERY_FORBIDDEN');
  if (!text(source.id) || !text(source.ref)) fail('SOURCE_METADATA_INVALID');
  const roles = strings(source.roles, 'SOURCE_ROLES_INVALID');
  if (!roles.length) fail('SOURCE_ROLES_INVALID');
  if (source.hash != null && !/^[a-f0-9]{64}$/.test(source.hash)) fail('SOURCE_HASH_INVALID');
  if (source.sizeBytes != null && (!Number.isSafeInteger(source.sizeBytes) || source.sizeBytes < 0)) fail('SOURCE_SIZE_INVALID');
  if (source.maxBytes != null && (!Number.isSafeInteger(source.maxBytes) || source.maxBytes < 1)) fail('SOURCE_MAX_BYTES_INVALID');
  if (Object.hasOwn(source, 'required') && typeof source.required !== 'boolean') fail('SOURCE_REQUIRED_INVALID');
  if (Object.hasOwn(source, 'available') && typeof source.available !== 'boolean') fail('SOURCE_AVAILABLE_INVALID');
  if (Object.hasOwn(source, 'priority') && !Number.isFinite(source.priority)) fail('SOURCE_PRIORITY_INVALID');
  if (Object.hasOwn(source, 'volatility') && !Object.hasOwn(VOLATILITY_RANK, source.volatility)) fail('SOURCE_VOLATILITY_INVALID');
  if (Object.hasOwn(source, 'resolution') && !Object.values(RESOLUTION).includes(source.resolution)) fail('SOURCE_RESOLUTION_INVALID');
  let freshness = null;
  if (Object.hasOwn(source, 'freshness')) {
    if (!text(source.freshness) || !Number.isFinite(Date.parse(source.freshness))) fail('SOURCE_FRESHNESS_INVALID');
    freshness = new Date(source.freshness).toISOString();
  }
  return {
    id: source.id.trim(), ref: source.ref.trim(), roles,
    name: optionalText(source, 'name', source.id.trim(), 'SOURCE_NAME_INVALID'),
    tags: strings(source.tags, 'SOURCE_TAGS_INVALID'),
    required: source.required ?? false,
    priority: source.priority ?? 0,
    available: source.available ?? true,
    hash: source.hash || null,
    sizeBytes: source.sizeBytes ?? null,
    maxBytes: source.maxBytes ?? null,
    authorityClass: optionalText(source, 'authorityClass', null, 'SOURCE_AUTHORITY_CLASS_INVALID'),
    truthClass: optionalText(source, 'truthClass', null, 'SOURCE_TRUTH_CLASS_INVALID'),
    freshness,
    volatility: source.volatility ?? VOLATILITY.SESSION,
    resolution: source.resolution ?? RESOLUTION.POINTER_ONLY
  };
}
function mergeSources(sourceMap = []) {
  if (!Array.isArray(sourceMap) || sourceMap.length > 256) fail('SOURCE_MAP_INVALID');
  const byRef = new Map();
  for (const raw of sourceMap) {
    const source = normalizeSource(raw);
    const key = source.ref;
    if (!byRef.has(key)) { byRef.set(key, source); continue; }
    const prior = byRef.get(key);
    if (prior.hash && source.hash && prior.hash !== source.hash) fail('SOURCE_METADATA_CONFLICT');
    for (const field of ['authorityClass', 'truthClass']) {
      if (prior[field] && source[field] && prior[field] !== source[field]) fail('SOURCE_METADATA_CONFLICT');
    }
    if (prior.sizeBytes != null && source.sizeBytes != null && prior.sizeBytes !== source.sizeBytes) {
      fail('SOURCE_METADATA_CONFLICT');
    }
    const freshness = [prior.freshness, source.freshness].filter(Boolean).sort().at(-1) || null;
    const maxBytes = prior.maxBytes != null && source.maxBytes != null
      ? Math.min(prior.maxBytes, source.maxBytes)
      : (prior.maxBytes ?? source.maxBytes);
    byRef.set(key, {
      ...prior,
      id: [prior.id, source.id].sort()[0],
      name: [prior.name, source.name].sort()[0],
      roles: [...new Set([...prior.roles, ...source.roles])].sort(),
      tags: [...new Set([...prior.tags, ...source.tags])].sort(),
      required: prior.required || source.required,
      priority: Math.max(prior.priority, source.priority),
      available: prior.available && source.available,
      hash: prior.hash || source.hash,
      sizeBytes: prior.sizeBytes ?? source.sizeBytes,
      maxBytes,
      authorityClass: prior.authorityClass || source.authorityClass,
      truthClass: prior.truthClass || source.truthClass,
      freshness,
      volatility: VOLATILITY_RANK[prior.volatility] >= VOLATILITY_RANK[source.volatility] ? prior.volatility : source.volatility,
      resolution: prior.resolution === RESOLUTION.EXACT_JIT || source.resolution === RESOLUTION.EXACT_JIT ? RESOLUTION.EXACT_JIT : RESOLUTION.POINTER_ONLY
    });
  }
  return [...byRef.values()].sort((a, b) => a.ref.localeCompare(b.ref) || a.id.localeCompare(b.id));
}

function relevance(source, terms) {
  if (!terms.length) return 0;
  const haystack = `${source.id} ${source.ref} ${source.name} ${source.roles.join(' ')} ${source.tags.join(' ')}`.toLowerCase();
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}

function compileContextPlan(input = {}) {
  if (!object(input) || !object(input.task) || !text(input.task.objective)) fail('CONTEXT_PLAN_INPUT_INVALID');
  assertNoBodies(input.task, 'RAW_TASK_BODY_FORBIDDEN');
  const strategy = strategyFor(input);
  if (input.budget != null && !object(input.budget)) fail('CONTEXT_BUDGET_INVALID');
  const budget = input.budget || {};
  const boundedBudget = (value, fallback, predicate) => {
    if (value == null) return fallback;
    if (!Number.isSafeInteger(value) || !predicate(value)) fail('CONTEXT_BUDGET_INVALID');
    return value;
  };
  const maxSelectedSources = boundedBudget(budget.maxSelectedSources, strategy.maxSelectedSources, value => value > 0);
  const maxMetadataBytes = boundedBudget(budget.maxMetadataBytes, 8192, value => value >= 512);
  const maxHydrationBytes = boundedBudget(budget.maxHydrationBytes, 32768, value => value >= 0);
  const sources = mergeSources(input.sourceMap || []);
  const query = text(input.query) ? input.query.trim() : input.task.objective.trim();
  const terms = [...new Set(query.toLowerCase().split(/\W+/).filter(Boolean))].sort();

  const requiredRoles = new Set(strategy.requiredRoles);
  const exactRoles = new Set(strategy.exactRoles);
  const optionalRoles = new Set(strategy.optionalRoles);
  const allowedRoles = new Set([...requiredRoles, ...exactRoles, ...optionalRoles]);
  const selected = [];
  const omissions = [];
  const missingRoles = [];

  for (const role of [...requiredRoles].sort()) {
    const candidates = sources.filter(source => source.roles.includes(role) && source.available);
    if (!candidates.length) missingRoles.push(role);
  }

  const ranked = sources.map(source => {
    const requiredByRole = source.roles.some(role => requiredRoles.has(role));
    const exactByRole = source.roles.some(role => exactRoles.has(role));
    const allowedByRole = source.roles.some(role => allowedRoles.has(role));
    return {
      ...source,
      required: source.required || requiredByRole,
      allowedByRole,
      resolution: source.resolution === RESOLUTION.EXACT_JIT || exactByRole ? RESOLUTION.EXACT_JIT : RESOLUTION.POINTER_ONLY,
      relevance: relevance(source, terms)
    };
  }).sort((a, b) => Number(b.required) - Number(a.required) || b.priority - a.priority || b.relevance - a.relevance || a.ref.localeCompare(b.ref));

  let metadataBytes = 0;
  for (const source of ranked) {
    if (!source.available) {
      omissions.push({ id: source.id, ref: source.ref, reason: 'SOURCE_UNAVAILABLE', required: source.required });
      continue;
    }
    if (!source.required && !source.allowedByRole) {
      omissions.push({ id: source.id, ref: source.ref, reason: 'ROLE_NOT_ALLOWED_BY_STRATEGY', required: false });
      continue;
    }
    if (!source.required && source.relevance <= 0) {
      omissions.push({ id: source.id, ref: source.ref, reason: 'NOT_RELEVANT_TO_CURRENT_OBJECTIVE', required: false });
      continue;
    }
    if (selected.length >= maxSelectedSources) {
      omissions.push({
        id: source.id,
        ref: source.ref,
        reason: source.required ? 'REQUIRED_SOURCE_LIMIT_EXCEEDED' : 'SOURCE_LIMIT_EXCEEDED',
        required: source.required
      });
      continue;
    }
    const projected = {
      id: source.id, ref: source.ref, roles: source.roles, name: source.name, required: source.required,
      priority: source.priority, hash: source.hash, sizeBytes: source.sizeBytes, maxBytes: source.maxBytes,
      authorityClass: source.authorityClass, truthClass: source.truthClass, freshness: source.freshness,
      volatility: source.volatility, resolution: source.resolution
    };
    const nextBytes = jsonBytes([...selected, projected]);
    if (nextBytes > maxMetadataBytes) {
      omissions.push({ id: source.id, ref: source.ref, reason: source.required ? 'REQUIRED_METADATA_BUDGET_EXCEEDED' : 'METADATA_BUDGET_EXCEEDED', required: source.required });
      continue;
    }
    selected.push(projected);
    metadataBytes = nextBytes;
  }

  const missingSelectedRequired = omissions.filter(item => item.required).map(item => item.id).sort();
  const exactSelected = selected.filter(source => source.resolution === RESOLUTION.EXACT_JIT);
  const exactUnhashed = exactSelected.filter(source => !source.hash);
  const exactFetchable = exactSelected.filter(source => source.hash);
  const defaultExactMaxBytes = exactFetchable.length ? Math.floor(maxHydrationBytes / exactFetchable.length) : 0;
  const exactRequests = exactFetchable.map(source => ({
    action: 'EXACT_JIT_FETCH', id: source.id, ref: source.ref, expectedHash: source.hash,
    maxBytes: source.maxBytes || defaultExactMaxBytes
  }));
  const exactBudget = exactRequests.reduce((sum, request) => sum + request.maxBytes, 0);
  const protectedText = (owner, field, fallback, code) => {
    if (!Object.hasOwn(owner, field)) return fallback;
    if (!text(owner[field])) fail(code);
    return owner[field].trim();
  };
  if (Object.hasOwn(input, 'scopes') && !object(input.scopes)) fail('SCOPES_INVALID');
  const protectedState = {
    taskId: text(input.task.id) ? input.task.id.trim() : null,
    objective: input.task.objective.trim(),
    taskClass: text(input.task.class) ? input.task.class.trim() : null,
    projectRef: text(input.task.projectRef) ? input.task.projectRef.trim() : null,
    checkpointRef: text(input.task.checkpointRef) ? input.task.checkpointRef.trim() : null,
    constraints: strings(input.constraints, 'CONSTRAINTS_INVALID'),
    acceptedDecisions: strings(input.acceptedDecisions, 'DECISIONS_INVALID'),
    acceptance: strings(input.acceptance, 'ACCEPTANCE_INVALID'),
    authority: protectedText(input, 'authority', 'NONE', 'AUTHORITY_INVALID'),
    effectClass: protectedText(input, 'effectClass', 'NONE', 'EFFECT_CLASS_INVALID'),
    privacyClass: protectedText(input, 'privacyClass', 'PUBLIC', 'PRIVACY_CLASS_INVALID'),
    scopes: object(input.scopes) ? {
      read: strings(input.scopes.read, 'READ_SCOPE_INVALID'),
      write: strings(input.scopes.write, 'WRITE_SCOPE_INVALID'),
      effect: protectedText(input.scopes, 'effect', 'NONE', 'EFFECT_SCOPE_INVALID')
    } : { read: [], write: [], effect: 'NONE' },
    outputContract: protectedText(input, 'outputContract', null, 'OUTPUT_CONTRACT_INVALID'),
    truthState: protectedText(input, 'truthState', null, 'TRUTH_STATE_INVALID'),
    sourceStatus: protectedText(input, 'sourceStatus', null, 'SOURCE_STATUS_INVALID'),
    negations: strings(input.negations, 'NEGATIONS_INVALID'),
    contradictions: strings(input.contradictions, 'CONTRADICTIONS_INVALID'),
    supersessionRefs: strings(input.supersessionRefs, 'SUPERSESSION_REFS_INVALID')
  };
  const taskFingerprint = sha256({ strategy: { id: strategy.id, version: strategy.version }, protectedState });
  const missReasons = [];
  if (missingRoles.length) missReasons.push({ code: 'MISSING_REQUIRED_SOURCE_ROLE', roles: missingRoles });
  if (missingSelectedRequired.length) missReasons.push({ code: 'REQUIRED_SOURCE_NOT_SELECTED', sourceIds: missingSelectedRequired });
  if (exactUnhashed.length) missReasons.push({ code: 'EXACT_SOURCE_HASH_REQUIRED', sourceIds: exactUnhashed.map(source => source.id).sort() });
  if (exactRequests.some(request => request.maxBytes < 1)) missReasons.push({ code: 'HYDRATION_BUDGET_EXCEEDED', requestedBytes: exactBudget, maxHydrationBytes });
  else if (exactBudget > maxHydrationBytes && exactRequests.length) missReasons.push({ code: 'HYDRATION_BUDGET_EXCEEDED', requestedBytes: exactBudget, maxHydrationBytes });

  const stablePrefixSources = selected
    .filter(source => source.volatility === VOLATILITY.STABLE && source.hash)
    .map(source => ({ id: source.id, ref: source.ref, hash: source.hash, roles: source.roles, resolution: source.resolution }));
  const dynamicSources = selected
    .filter(source => !(source.volatility === VOLATILITY.STABLE && source.hash))
    .map(source => ({ id: source.id, ref: source.ref, hash: source.hash, volatility: source.volatility }));
  const cachePlan = {
    mode: stablePrefixSources.length ? 'STABLE_PREFIX_CANDIDATE' : 'NONE',
    stablePrefixId: stablePrefixSources.length ? sha256({ strategy: { id: strategy.id, version: strategy.version }, sources: stablePrefixSources }) : null,
    stableSources: stablePrefixSources,
    dynamicSources,
    providerSpecific: false,
    note: 'Adapters decide whether/how to use provider caching; this plan does not guarantee a cache hit.'
  };

  const planBase = {
    schema: 'context-compiler-plan/v1',
    status: missReasons.length ? 'CONTEXT_MISS' : 'READY',
    strategy: { id: strategy.id, version: strategy.version, profile: PROFILE_CONTRACTS[strategy.id] ? strategy.id : null },
    taskFingerprint,
    protectedState,
    selectedSources: selected,
    omissions,
    expansionRequests: exactRequests,
    missing: missReasons,
    budgetDecision: { maxSelectedSources, maxMetadataBytes, maxHydrationBytes, selectedSourceCount: selected.length, metadataBytes, requestedHydrationBytes: exactBudget },
    cachePlan,
    invariants: ['VERIFY_NE_HYDRATE', 'POINTER_FIRST', 'PROTECTED_SEMANTICS', 'EXACT_MISSING_CONE_ONLY', 'OUTCOME_LINKABLE', 'CACHE_PLAN_NE_CONTEXT_TRUTH']
  };
  const contextPlanId = sha256(planBase);
  return deepFreeze({ ...planBase, contextPlanId });
}

function assertPlanIntegrity(plan) {
  if (!object(plan) || plan.schema !== 'context-compiler-plan/v1' || !text(plan.contextPlanId)) fail('CONTEXT_PLAN_INTEGRITY_INVALID');
  const { contextPlanId, ...planBase } = plan;
  if (sha256(planBase) !== contextPlanId) fail('CONTEXT_PLAN_INTEGRITY_MISMATCH');
  return true;
}

function recordContextOutcome({ plan, result } = {}) {
  if (!object(plan) || !object(result)) fail('CONTEXT_EPISODE_INPUT_INVALID');
  assertPlanIntegrity(plan);
  for (const field of BODY_FIELDS) if (Object.hasOwn(result, field)) fail('RAW_OUTCOME_BODY_FORBIDDEN');
  const allowed = new Set([
    'resultId', 'disposition', 'accepted', 'verificationRef',
    'acceptanceContractRef', 'baselinePlanId', 'provider', 'model', 'tokenizer', 'falseSuccess',
    'correctionCount', 'restatementCount', 'contextMissCount', 'toolCallCount',
    'latencyMs', 'inputTokens', 'outputTokens', 'inputBytes', 'outputBytes', 'hydratedBytes', 'costUsd'
  ]);
  if (Object.keys(result).some(key => !allowed.has(key))) fail('CONTEXT_EPISODE_FIELD_INVALID');
  if (!text(result.resultId) || !OUTCOME_DISPOSITIONS.has(result.disposition)) fail('CONTEXT_EPISODE_RESULT_INVALID');
  if (result.accepted != null && typeof result.accepted !== 'boolean') fail('CONTEXT_EPISODE_RESULT_INVALID');
  if (result.accepted === true && result.disposition !== 'ACCEPTED') fail('CONTEXT_EPISODE_RESULT_INVALID');
  if (result.accepted === false && result.disposition === 'ACCEPTED') fail('CONTEXT_EPISODE_RESULT_INVALID');
  if (result.falseSuccess != null && typeof result.falseSuccess !== 'boolean') fail('CONTEXT_EPISODE_RESULT_INVALID');
  const metric = (value, field) => value == null ? null : (Number.isFinite(value) && value >= 0 ? Number(value) : fail(`CONTEXT_EPISODE_${field}_INVALID`));
  const count = (value, field) => value == null ? null : (Number.isSafeInteger(value) && value >= 0 ? value : fail(`CONTEXT_EPISODE_${field}_INVALID`));
  const outcome = {
    resultId: result.resultId.trim(), disposition: result.disposition, accepted: result.accepted ?? null,
    verificationRef: text(result.verificationRef) ? result.verificationRef.trim() : null
  };
  const evaluation = {
    acceptanceContractRef: text(result.acceptanceContractRef) ? result.acceptanceContractRef.trim() : null,
    baselinePlanId: text(result.baselinePlanId) ? result.baselinePlanId.trim() : null,
    provider: text(result.provider) ? result.provider.trim() : null,
    model: text(result.model) ? result.model.trim() : null,
    tokenizer: text(result.tokenizer) ? result.tokenizer.trim() : null,
    falseSuccess: result.falseSuccess ?? null
  };
  const metrics = {
    correctionCount: count(result.correctionCount, 'CORRECTION_COUNT'),
    restatementCount: count(result.restatementCount, 'RESTATEMENT_COUNT'),
    contextMissCount: count(result.contextMissCount, 'CONTEXT_MISS_COUNT'),
    toolCallCount: count(result.toolCallCount, 'TOOL_CALL_COUNT'),
    latencyMs: metric(result.latencyMs, 'LATENCY_MS'),
    inputTokens: metric(result.inputTokens, 'INPUT_TOKENS'),
    outputTokens: metric(result.outputTokens, 'OUTPUT_TOKENS'),
    inputBytes: metric(result.inputBytes, 'INPUT_BYTES'),
    outputBytes: metric(result.outputBytes, 'OUTPUT_BYTES'),
    hydratedBytes: metric(result.hydratedBytes, 'HYDRATED_BYTES'),
    costUsd: metric(result.costUsd, 'COST_USD')
  };
  const selectedSources = plan.selectedSources.map(source => ({ id: source.id, ref: source.ref, hash: source.hash, roles: source.roles, resolution: source.resolution }));
  const episodeBase = {
    schema: 'context-episode/v1',
    contextPlanId: plan.contextPlanId,
    taskFingerprint: plan.taskFingerprint,
    strategy: plan.strategy,
    selectedSources,
    omissionReasons: [...new Set(plan.omissions.map(item => item.reason))].sort(),
    missingCodes: [...new Set(plan.missing.map(item => item.code))].sort(),
    budgetDecision: plan.budgetDecision,
    outcome,
    evaluation,
    metrics,
    rawContentStored: false
  };
  return deepFreeze({ ...episodeBase, episodeId: sha256(episodeBase) });
}

module.exports = { PROFILE_CONTRACTS, RESOLUTION, VOLATILITY, compileContextPlan, recordContextOutcome, assertPlanIntegrity };
