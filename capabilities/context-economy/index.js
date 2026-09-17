'use strict';

const crypto = require('node:crypto');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const clone = value => structuredClone(value);
const units = value => [...JSON.stringify(value)].length;

const CAPSULE_REQUIRED = [
  'objective', 'exactRefs', 'mutableScope', 'invariants', 'acceptance',
  'resourceBoundary', 'stopGates', 'contextBudget'
];
const CAPSULE_PROTECTED = [
  'authority', 'truthRefs', 'expectedRevision', 'fence', 'readScope',
  'writeScope', 'capabilities', 'dataMode', 'effectMode', 'privacyClass',
  'acceptance', 'stopGates', 'outputContract', 'expiry'
];

function buildContextCapsule(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('CAPSULE_INVALID');
  for (const field of CAPSULE_REQUIRED) {
    if (!Object.hasOwn(input, field)) throw new Error(`CAPSULE_REQUIRED:${field}`);
  }
  const budget = input.contextBudget;
  if (!budget || !Number.isSafeInteger(budget.total) || !Number.isSafeInteger(budget.outputReserve) ||
      budget.total <= budget.outputReserve || !budget.sourceCaps || typeof budget.sourceCaps !== 'object') {
    throw new Error('BUDGET_INVALID');
  }
  const protectedFields = Object.fromEntries(
    CAPSULE_PROTECTED.filter(field => Object.hasOwn(input, field)).map(field => [field, clone(input[field])])
  );
  const protectedUnits = units(protectedFields);
  const available = budget.total - budget.outputReserve;
  if (protectedUnits > available) throw new Error('PROTECTED_FIELD_BUDGET_EXCEEDED');

  let remaining = available - protectedUnits;
  let contextMiss = null;
  const sources = [...(input.sources || [])].sort(
    (a, b) => Number(b.priority || 0) - Number(a.priority || 0) || String(a.id).localeCompare(String(b.id))
  );
  const selected = [];
  for (const source of sources) {
    const cap = budget.sourceCaps[source.id];
    if (!Number.isSafeInteger(cap) || cap < 0) throw new Error(`SOURCE_CAP_REQUIRED:${source.id}`);
    const chars = [...String(source.content ?? '')];
    const take = Math.min(chars.length, cap, remaining);
    const truncated = take < chars.length;
    const marker = truncated && take >= 12 ? '...[TRUNCATED]' : '';
    const content = chars.slice(0, Math.max(0, take - [...marker].length)).join('') + marker;
    selected.push({ id: String(source.id), required: Boolean(source.required), priority: Number(source.priority || 0), content, truncated });
    remaining -= [...content].length;
    if (source.required && (truncated || !content) && !contextMiss) {
      contextMiss = { sourceId: String(source.id), reason: truncated ? 'REQUIRED_SOURCE_TRUNCATED' : 'REQUIRED_SOURCE_MISSING' };
    }
  }
  return Object.freeze({
    schema: 'context-capsule/v2',
    status: contextMiss ? 'CONTEXT_MISS' : 'READY',
    objective: input.objective,
    exactRefs: clone(input.exactRefs),
    mutableScope: input.mutableScope,
    invariants: clone(input.invariants),
    resourceBoundary: clone(input.resourceBoundary),
    protectedFields,
    sources: selected,
    budgetDecision: {
      tokenizer: budget.tokenizer || 'unicode-codepoint/v1',
      total: budget.total,
      outputReserve: budget.outputReserve,
      protectedUnits,
      remaining,
      degradationTrace: selected.filter(source => source.truncated).map(source => source.id),
      contextMiss
    }
  });
}

function compactHealth(full, options = {}) {
  if (!full || typeof full !== 'object' || Array.isArray(full) || typeof full.status !== 'string' || !full.status) {
    throw new Error('HEALTH_FULL_INVALID');
  }
  const maxChecks = Number.isSafeInteger(options.maxChecks) ? options.maxChecks : 8;
  if (maxChecks < 0 || maxChecks > 32) throw new Error('HEALTH_COMPACT_OPTIONS_INVALID');
  const checks = Array.isArray(full.checks)
    ? full.checks.slice(0, maxChecks).map(check => ({ name: String(check.name), status: String(check.status) }))
    : [];
  const shared = ['status', 'sampledAt', 'revision', 'fenceRef', 'stalenessMs', 'fullRef', 'errorCode'];
  const output = {
    schema: 'health-compact/v1',
    status: full.status,
    sampledAt: full.sampledAt || null,
    revision: full.revision ?? null,
    fenceRef: full.fenceRef ?? null,
    checks,
    counts: full.counts && typeof full.counts === 'object' ? { ...full.counts } : {},
    stalenessMs: Number.isFinite(full.stalenessMs) ? full.stalenessMs : null,
    omittedCount: Math.max(0, Object.keys(full).filter(key => !shared.includes(key) && key !== 'checks' && key !== 'counts').length + Math.max(0, (full.checks?.length || 0) - checks.length)),
    fullRef: full.fullRef || null,
    errorCode: full.errorCode || null
  };
  return Object.freeze(output);
}

function sharedHealthParity(full, compact) {
  return ['status', 'sampledAt', 'revision', 'fenceRef', 'stalenessMs', 'fullRef', 'errorCode']
    .every(key => (full[key] ?? null) === compact[key]);
}

const SECRET = /(?:sk-[A-Za-z0-9_-]{12,}|Bearer\s+[A-Za-z0-9._-]{12,}|(?:password|api[_-]?key|access[_-]?token|secret)\s*[:=]\s*\S+)/gi;
const INJECTION = /(?:ignore (?:all|previous) instructions|system prompt|developer message)/i;

function reduceToolResult(input, options = {}) {
  if (!input || typeof input.raw !== 'string' || !input.source || !input.mime) throw new Error('TOOL_RESULT_INVALID');
  const sanitized = input.raw.replace(SECRET, '[REDACTED]');
  const bytes = Buffer.from(sanitized, 'utf8');
  const hash = sha256(bytes);
  const store = options.store || ((content, meta) => ({ artifactRef: `sha256:${meta.hash}`, retainedBytes: Buffer.byteLength(content) }));
  const retained = store(sanitized, { hash, mime: input.mime, source: input.source });
  if (!retained || typeof retained.artifactRef !== 'string') throw new Error('ARTIFACT_RETENTION_FAILED');
  const maxBytes = Number.isSafeInteger(options.maxBytes) ? options.maxBytes : 1024;
  if (maxBytes < 0) throw new Error('MAX_BYTES_INVALID');
  let end = Math.min(bytes.length, maxBytes);
  while (end > 0 && (bytes[end] & 0xC0) === 0x80) end--;
  return Object.freeze({
    schema: 'tool-result-envelope/v1',
    artifactRef: retained.artifactRef,
    hash,
    mime: input.mime,
    trustClass: input.trustClass || 'UNTRUSTED',
    source: input.source,
    capturedAt: input.capturedAt || null,
    reducerVersion: 'deterministic-v1',
    truncated: end < bytes.length,
    omittedBytes: bytes.length - end,
    excerpt: bytes.subarray(0, end).toString('utf8'),
    exactRanges: end ? [{ startByte: 0, endByteExclusive: end }] : [],
    injectionDetected: INJECTION.test(sanitized),
    redacted: sanitized !== input.raw
  });
}

const CACHE_STRATEGIES = new Set(['NONE', 'STABLE_PREFIX', 'EXPLICIT_BREAKPOINTS', 'PROVIDER_MANAGED']);
function capabilityProjection(profile, available, profiles, strategy = 'NONE') {
  if (!profiles || !Object.hasOwn(profiles, profile) || !Array.isArray(profiles[profile])) throw new Error('PROFILE_UNKNOWN');
  if (!CACHE_STRATEGIES.has(strategy)) throw new Error('CACHE_STRATEGY_UNKNOWN');
  const allow = new Set(profiles[profile].map(String));
  const tools = [...new Set((available || []).map(String))].filter(tool => allow.has(tool)).sort();
  if (!tools.length) throw new Error('PROFILE_EMPTY');
  const stable = { schema: 'capability-projection/v1', profile, tools };
  const capabilitySetId = sha256(JSON.stringify(stable));
  return Object.freeze({ ...stable, capabilitySetId, cache: { strategy, stablePrefixHash: strategy === 'NONE' ? null : capabilitySetId, dynamicSuffix: [] } });
}

function selectRepositoryContext(files, query, budget = 1000) {
  if (!Array.isArray(files) || !Number.isFinite(budget) || budget < 0) throw new Error('REPO_MAP_INVALID');
  const terms = String(query).toLowerCase().split(/\W+/).filter(Boolean);
  const ranked = files.map(file => ({
    path: String(file.path),
    symbols: Array.isArray(file.symbols) ? file.symbols.map(String) : [],
    score: terms.reduce((score, term) => score + (String(file.path).toLowerCase().includes(term) ? 5 : 0) +
      (file.symbols || []).filter(symbol => String(symbol).toLowerCase().includes(term)).length * 3, 0)
  })).sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
  const selected = [];
  let estimatedTokens = 0;
  for (const file of ranked) {
    const cost = Math.ceil(8 + file.symbols.join(' ').length / 4);
    if (estimatedTokens + cost > budget) continue;
    selected.push(file);
    estimatedTokens += cost;
  }
  const hit = selected.some(file => file.score > 0);
  return Object.freeze({ schema: 'repo-map-selection/v1', selected, estimatedTokens, status: hit ? 'READY' : 'CONTEXT_MISS', reason: hit ? null : 'NO_RANKED_MATCH' });
}

module.exports = {
  CAPSULE_PROTECTED,
  CACHE_STRATEGIES,
  buildContextCapsule,
  compactHealth,
  sharedHealthParity,
  reduceToolResult,
  capabilityProjection,
  selectRepositoryContext,
  sha256,
  units
};
