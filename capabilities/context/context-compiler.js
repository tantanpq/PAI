'use strict';

const crypto = require('node:crypto');

const BODY_FIELDS = Object.freeze(['body', 'content', 'fullContent', 'raw', 'text', 'transcript', 'messages', 'prompt']);
const RESOLUTION = Object.freeze({ POINTER_ONLY: 'POINTER_ONLY', EXACT_JIT: 'EXACT_JIT' });
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
    id: 'runtime-repair', version: '1.0.0', requiredRoles: ['RUNTIME_READBACK'],
    exactRoles: ['RUNTIME_READBACK'], optionalRoles: ['DESIRED_STATE', 'REPOSITORY_BASELINE', 'RESULT', 'EVIDENCE'], maxSelectedSources: 8
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
function text(value) { return typeof value === 'string' && value.trim().length > 0; }
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
  if (text(input.profile) && PROFILE_CONTRACTS[input.profile]) return PROFILE_CONTRACTS[input.profile];
  if (object(input.strategy) && text(input.strategy.id) && text(input.strategy.version)) {
    return Object.freeze({
      id: input.strategy.id.trim(), version: input.strategy.version.trim(),
      requiredRoles: strings(input.strategy.requiredRoles, 'STRATEGY_REQUIRED_ROLES_INVALID'),
      exactRoles: strings(input.strategy.exactRoles, 'STRATEGY_EXACT_ROLES_INVALID'),
      optionalRoles: strings(input.strategy.optionalRoles, 'STRATEGY_OPTIONAL_ROLES_INVALID'),
      maxSelectedSources: Number.isSafeInteger(input.strategy.maxSelectedSources) && input.strategy.maxSelectedSources > 0 ? input.strategy.maxSelectedSources : 8
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
  if (source.freshness != null && (!text(source.freshness) || !Number.isFinite(Date.parse(source.freshness)))) fail('SOURCE_FRESHNESS_INVALID');
  return {
    id: source.id.trim(), ref: source.ref.trim(), roles,
    name: text(source.name) ? source.name.trim() : source.id.trim(),
    tags: strings(source.tags, 'SOURCE_TAGS_INVALID'),
    required: source.required === true,
    priority: Number.isFinite(source.priority) ? Number(source.priority) : 0,
    available: source.available !== false,
    hash: source.hash || null,
    sizeBytes: source.sizeBytes ?? null,
    maxBytes: source.maxBytes ?? null,
    authorityClass: text(source.authorityClass) ? source.authorityClass.trim() : null,
    truthClass: text(source.truthClass) ? source.truthClass.trim() : null,
    freshness: source.freshness || null,
    resolution: source.resolution === RESOLUTION.EXACT_JIT ? RESOLUTION.EXACT_JIT : RESOLUTION.POINTER_ONLY
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
    byRef.set(key, {
      ...prior,
      roles: [...new Set([...prior.roles, ...source.roles])].sort(),
      tags: [...new Set([...prior.tags, ...source.tags])].sort(),
      required: prior.required || source.required,
      priority: Math.max(prior.priority, source.priority),
      available: prior.available && source.available,
      hash: prior.hash || source.hash,
      sizeBytes: prior.sizeBytes ?? source.sizeBytes,
      maxBytes: prior.maxBytes ?? source.maxBytes,
      authorityClass: prior.authorityClass || source.authorityClass,
      truthClass: prior.truthClass || source.truthClass,
      freshness: prior.freshness || source.freshness,
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
  const budget = object(input.budget) ? input.budget : {};
  const maxSelectedSources = Number.isSafeInteger(budget.maxSelectedSources) && budget.maxSelectedSources > 0 ? budget.maxSelectedSources : strategy.maxSelectedSources;
  const maxMetadataBytes = Number.isSafeInteger(budget.maxMetadataBytes) && budget.maxMetadataBytes >= 512 ? budget.maxMetadataBytes : 8192;
  const maxHydrationBytes = Number.isSafeInteger(budget.maxHydrationBytes) && budget.maxHydrationBytes >= 0 ? budget.maxHydrationBytes : 32768;
  const sources = mergeSources(input.sourceMap || []);
  const query = text(input.query) ? input.query.trim() : input.task.objective.trim();
  const terms = [...new Set(query.toLowerCase().split(/\W+/).filter(Boolean))].sort();

  const requiredRoles = new Set(strategy.requiredRoles);
  const exactRoles = new Set(strategy.exactRoles);
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
    return {
      ...source,
      required: source.required || requiredByRole,
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
    if (!source.required && source.relevance <= 0) {
      omissions.push({ id: source.id, ref: source.ref, reason: 'NOT_RELEVANT_TO_CURRENT_OBJECTIVE', required: false });
      continue;
    }
    if (selected.length >= maxSelectedSources && !source.required) {
      omissions.push({ id: source.id, ref: source.ref, reason: 'SOURCE_LIMIT_EXCEEDED', required: false });
      continue;
    }
    const projected = {
      id: source.id, ref: source.ref, roles: source.roles, name: source.name, required: source.required,
      priority: source.priority, hash: source.hash, sizeBytes: source.sizeBytes, maxBytes: source.maxBytes,
      authorityClass: source.authorityClass, truthClass: source.truthClass, freshness: source.freshness,
      resolution: source.resolution
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
  const defaultExactMaxBytes = exactSelected.length ? Math.floor(maxHydrationBytes / exactSelected.length) : 0;
  const exactRequests = exactSelected.map(source => ({
    action: 'EXACT_JIT_FETCH', id: source.id, ref: source.ref, expectedHash: source.hash,
    maxBytes: source.maxBytes || defaultExactMaxBytes
  }));
  const exactBudget = exactRequests.reduce((sum, request) => sum + request.maxBytes, 0);
  const protectedState = {
    taskId: text(input.task.id) ? input.task.id.trim() : null,
    objective: input.task.objective.trim(),
    taskClass: text(input.task.class) ? input.task.class.trim() : null,
    projectRef: text(input.task.projectRef) ? input.task.projectRef.trim() : null,
    checkpointRef: text(input.task.checkpointRef) ? input.task.checkpointRef.trim() : null,
    constraints: strings(input.constraints, 'CONSTRAINTS_INVALID'),
    acceptedDecisions: strings(input.acceptedDecisions, 'DECISIONS_INVALID'),
    acceptance: strings(input.acceptance, 'ACCEPTANCE_INVALID'),
    authority: text(input.authority) ? input.authority.trim() : 'NONE',
    effectClass: text(input.effectClass) ? input.effectClass.trim() : 'NONE',
    privacyClass: text(input.privacyClass) ? input.privacyClass.trim() : 'PUBLIC',
    scopes: object(input.scopes) ? {
      read: strings(input.scopes.read, 'READ_SCOPE_INVALID'),
      write: strings(input.scopes.write, 'WRITE_SCOPE_INVALID'),
      effect: text(input.scopes.effect) ? input.scopes.effect.trim() : 'NONE'
    } : { read: [], write: [], effect: 'NONE' },
    outputContract: text(input.outputContract) ? input.outputContract.trim() : null
  };
  const taskFingerprint = sha256({ strategy: { id: strategy.id, version: strategy.version }, protectedState });
  const missReasons = [];
  if (missingRoles.length) missReasons.push({ code: 'MISSING_REQUIRED_SOURCE_ROLE', roles: missingRoles });
  if (missingSelectedRequired.length) missReasons.push({ code: 'REQUIRED_SOURCE_NOT_SELECTED', sourceIds: missingSelectedRequired });
  if (exactRequests.some(request => request.maxBytes < 1)) missReasons.push({ code: 'HYDRATION_BUDGET_EXCEEDED', requestedBytes: exactBudget, maxHydrationBytes });
  else if (exactBudget > maxHydrationBytes && exactRequests.length) missReasons.push({ code: 'HYDRATION_BUDGET_EXCEEDED', requestedBytes: exactBudget, maxHydrationBytes });

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
    invariants: ['VERIFY_NE_HYDRATE', 'POINTER_FIRST', 'PROTECTED_SEMANTICS', 'EXACT_MISSING_CONE_ONLY', 'OUTCOME_LINKABLE']
  };
  const contextPlanId = sha256(planBase);
  return Object.freeze({ ...planBase, contextPlanId });
}

function recordContextOutcome({ plan, result } = {}) {
  if (!object(plan) || plan.schema !== 'context-compiler-plan/v1' || !text(plan.contextPlanId) || !object(result)) fail('CONTEXT_EPISODE_INPUT_INVALID');
  for (const field of BODY_FIELDS) if (Object.hasOwn(result, field)) fail('RAW_OUTCOME_BODY_FORBIDDEN');
  const allowed = new Set(['resultId', 'disposition', 'accepted', 'verificationRef', 'correctionCount', 'restatementCount', 'contextMissCount', 'latencyMs', 'inputTokens', 'outputTokens', 'costUsd']);
  if (Object.keys(result).some(key => !allowed.has(key))) fail('CONTEXT_EPISODE_FIELD_INVALID');
  if (!text(result.resultId) || !OUTCOME_DISPOSITIONS.has(result.disposition)) fail('CONTEXT_EPISODE_RESULT_INVALID');
  if (result.accepted != null && typeof result.accepted !== 'boolean') fail('CONTEXT_EPISODE_RESULT_INVALID');
  if (result.accepted === true && result.disposition !== 'ACCEPTED') fail('CONTEXT_EPISODE_RESULT_INVALID');
  if (result.accepted === false && result.disposition === 'ACCEPTED') fail('CONTEXT_EPISODE_RESULT_INVALID');
  const metric = (value, field) => value == null ? null : (Number.isFinite(value) && value >= 0 ? Number(value) : fail(`CONTEXT_EPISODE_${field}_INVALID`));
  const count = (value, field) => value == null ? 0 : (Number.isSafeInteger(value) && value >= 0 ? value : fail(`CONTEXT_EPISODE_${field}_INVALID`));
  const outcome = {
    resultId: result.resultId.trim(), disposition: result.disposition, accepted: result.accepted ?? null,
    verificationRef: text(result.verificationRef) ? result.verificationRef.trim() : null
  };
  const metrics = {
    correctionCount: count(result.correctionCount, 'CORRECTION_COUNT'),
    restatementCount: count(result.restatementCount, 'RESTATEMENT_COUNT'),
    contextMissCount: count(result.contextMissCount, 'CONTEXT_MISS_COUNT'),
    latencyMs: metric(result.latencyMs, 'LATENCY_MS'),
    inputTokens: metric(result.inputTokens, 'INPUT_TOKENS'),
    outputTokens: metric(result.outputTokens, 'OUTPUT_TOKENS'),
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
    metrics,
    rawContentStored: false
  };
  return Object.freeze({ ...episodeBase, episodeId: sha256(episodeBase) });
}

module.exports = { PROFILE_CONTRACTS, RESOLUTION, compileContextPlan, recordContextOutcome };
