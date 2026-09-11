'use strict';

const crypto = require('node:crypto');

class ContextCapsuleError extends Error {
  constructor(code) { super(code); this.name = 'ContextCapsuleError'; this.code = code; }
}

const PROFILES = Object.freeze({
  resume: { name: 'Resume Capsule', kinds: ['intent', 'outcome', 'memory', 'currentPicture', 'programResult', 'experience', 'artifact', 'unknown', 'constraint'], privacy: 1 },
  passport: { name: 'Continuity Passport', kinds: ['intent', 'outcome', 'memory', 'programResult', 'experience', 'unknown', 'constraint'], privacy: 0 },
  work: { name: 'Work Context', kinds: ['intent', 'outcome', 'currentPicture', 'programResult', 'experience', 'artifact', 'unknown', 'constraint'], privacy: 1 }
});
const PRECEDENCE = Object.freeze({ programResult: 0, currentPicture: 1, outcome: 2, intent: 3, experience: 4, memory: 5, constraint: 6, unknown: 7, artifact: 8 });
const PRIVACY = Object.freeze({ PUBLIC: 0, PERSONAL: 1, SECRET: 2 });
const OMIT = Object.freeze({ PROFILE_EXCLUDED: 'PROFILE_EXCLUDED', PRIVACY_REDACTED: 'PRIVACY_REDACTED', DUPLICATE: 'DUPLICATE', BUDGET_EXCEEDED: 'BUDGET_EXCEEDED' });

function fail(code) { throw new ContextCapsuleError(code); }
function object(value) { return value && typeof value === 'object' && !Array.isArray(value); }
function text(value) { return typeof value === 'string' && value.length > 0; }
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (object(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
function digest(value) { return crypto.createHash('sha256').update(canonical(value)).digest('hex'); }
function clone(value) { return structuredClone(value); }
function secretLike(value) {
  const source = canonical(value);
  return /(?:password|passwd|secret|api[_-]?key|authorization|bearer|private[_-]?key)\s*["':=]+\s*[^,}\s]+/i.test(source) || /-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(source);
}
function validateItem(item) {
  if (!object(item) || !text(item.kind) || PRECEDENCE[item.kind] === undefined || !text(item.id) ||
      !text(item.value) || !text(item.privacyClass) || PRIVACY[item.privacyClass] === undefined ||
      !object(item.provenance) || !text(item.provenance.source) || !text(item.freshness) ||
      (item.hash !== undefined && !/^[a-f0-9]{64}$/.test(item.hash)) || secretLike(item)) fail('MALFORMED_INPUT');
  if (['programResult', 'experience', 'artifact'].includes(item.kind) && (!text(item.locator) || !/^[a-f0-9]{64}$/.test(item.hash || ''))) fail('MALFORMED_INPUT');
  return clone(item);
}
function validate(request) {
  if (!object(request) || !object(request.owner) || !['principalId', 'accountId', 'workspaceId'].every((k) => text(request.owner[k])) ||
      !text(request.profile) || !PROFILES[request.profile] || !Number.isSafeInteger(request.budget) || request.budget < 1 ||
      !Array.isArray(request.items) || !object(request.coverage) || !Number.isSafeInteger(request.coverage.observedUserSignals) ||
      request.coverage.observedUserSignals < 0 || !Number.isSafeInteger(request.coverage.unobservedHostedChatTurns) || request.coverage.unobservedHostedChatTurns < 0) fail('MALFORMED_INPUT');
}

function compile(request, options = {}) {
  validate(request);
  const policy = PROFILES[request.profile];
  const candidates = request.items.map(validateItem).sort((a, b) =>
    PRECEDENCE[a.kind] - PRECEDENCE[b.kind] || a.id.localeCompare(b.id) || digest(a).localeCompare(digest(b)));
  const omissions = [];
  const selected = [];
  const seen = new Set();
  for (const item of candidates) {
    const identity = item.kind === 'memory' ? `memory:${item.id}` : item.id;
    let reason;
    if (!policy.kinds.includes(item.kind)) reason = OMIT.PROFILE_EXCLUDED;
    else if (PRIVACY[item.privacyClass] > policy.privacy) reason = OMIT.PRIVACY_REDACTED;
    else if (seen.has(identity)) reason = OMIT.DUPLICATE;
    if (reason) { omissions.push({ id: item.id, kind: item.kind, reason }); continue; }
    seen.add(identity);
    if (selected.length >= request.budget) { omissions.push({ id: item.id, kind: item.kind, reason: OMIT.BUDGET_EXCEEDED }); continue; }
    selected.push(item);
  }
  const unknowns = selected.filter((item) => item.kind === 'unknown');
  const contextMiss = unknowns.length ? { code: 'CONTEXT_MISS', unknownIds: unknowns.map((item) => item.id).sort() } : null;
  const stablePrefixId = digest({ schema: 'context-capsule/v1', owner: request.owner }).slice(0, 24);
  const capsule = {
    schema: 'context-capsule/v1', profile: policy.name, stablePrefixId,
    owner: clone(request.owner), ownership: { truthStore: 'durable-personal-memory', projectionOnly: true },
    declaredPolicy: { selectionKinds: [...policy.kinds], maximumPrivacy: Object.keys(PRIVACY).find((key) => PRIVACY[key] === policy.privacy), budgetUnit: 'items', budget: request.budget },
    coverage: clone(request.coverage), items: selected, omissions,
    contextMiss, enrichment: { requested: false, status: 'NOT_USED_DETERMINISTIC_BASELINE' }
  };
  return Object.freeze({ capsule: clone(capsule), canonical: canonical(capsule), sha256: digest(capsule) });
}

module.exports = { compile, canonical, ContextCapsuleError, PROFILES };
