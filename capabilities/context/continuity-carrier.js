'use strict';

const crypto = require('node:crypto');

const text = value => typeof value === 'string' && value.length > 0;
const bytes = value => Buffer.byteLength(JSON.stringify(value), 'utf8');
const sha256 = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
function fail(code) { const error = new Error(code); error.code = code; throw error; }
function strings(value, field) { if (!Array.isArray(value) || value.some(item => !text(item))) fail(`CONTINUITY_${field}_INVALID`); return [...value]; }
function refs(value) {
  if (!Array.isArray(value)) fail('CONTINUITY_REFS_INVALID');
  const normalized = value.map(item => {
    if (!item || typeof item !== 'object' || !text(item.id) || !text(item.ref) || !/^[a-f0-9]{64}$/.test(item.hash || '')) fail('CONTINUITY_REF_INVALID');
    return { id: item.id, ref: item.ref, hash: item.hash, kind: text(item.kind) ? item.kind : 'evidence' };
  });
  const seen = new Set();
  return normalized.filter(item => {
    const key = `${item.kind}\u0000${item.id}\u0000${item.ref}\u0000${item.hash}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id) || a.ref.localeCompare(b.ref));
}

function buildContinuityCarrier(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.hasOwn(input, 'rawHistory') || !text(input.objective) || !text(input.nextOutcome) || !input.budget || !Number.isSafeInteger(input.budget.totalBytes) || !Number.isSafeInteger(input.budget.outputReserveBytes) || input.budget.totalBytes <= input.budget.outputReserveBytes || !Number.isSafeInteger(input.budget.maxWorkingItems) || input.budget.maxWorkingItems < 0) fail(Object.hasOwn(input, 'rawHistory') ? 'RAW_HISTORY_NOT_ACCEPTED' : 'CONTINUITY_INPUT_INVALID');
  const protectedState = {
    objective: input.objective,
    constraints: strings(input.constraints || [], 'CONSTRAINTS'),
    acceptedDecisions: strings(input.acceptedDecisions || [], 'DECISIONS'),
    openLoops: strings(input.openLoops || [], 'OPEN_LOOPS'),
    programRefs: strings(input.programRefs || [], 'PROGRAM_REFS'),
    evidenceRefs: refs(input.evidenceRefs || []),
    terminalResult: input.terminalResult === null || input.terminalResult === undefined ? null : refs([input.terminalResult])[0],
    nextOutcome: input.nextOutcome
  };
  const available = input.budget.totalBytes - input.budget.outputReserveBytes;
  const protectedBytes = bytes(protectedState);
  if (protectedBytes > available) return Object.freeze({ schema: 'continuity-carrier/v1', status: 'CONTEXT_MISS', protectedState: null, protectedDigest: sha256(protectedState), workingSet: [], budget: { ...input.budget, protectedBytes, workingBytes: 0, remainingBytes: available - protectedBytes }, miss: { code: 'CONTEXT_MISS', reason: 'PROTECTED_CONTINUITY_EXCEEDS_BUDGET' } });
  const candidates = Array.isArray(input.workingSet) ? input.workingSet.map(item => {
    if (!item || typeof item !== 'object' || !text(item.id) || !text(item.value) || !text(item.createdAt)) fail('WORKING_SET_INVALID');
    return { id: item.id, value: item.value, createdAt: item.createdAt, sourceRef: text(item.sourceRef) ? item.sourceRef : null };
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id)) : [];
  const workingSet = [];
  let remainingBytes = available - protectedBytes;
  for (const candidate of candidates) {
    if (workingSet.length >= input.budget.maxWorkingItems) break;
    const cost = bytes(candidate);
    if (cost > remainingBytes) continue;
    workingSet.push(candidate);
    remainingBytes -= cost;
  }
  const carrier = { schema: 'continuity-carrier/v1', status: 'READY', protectedState, workingSet, archivePolicy: { rawHistory: 'COLD_NOT_PRELOADED', summariesAreTruth: false, exactEvidenceIsJit: true }, budget: { ...input.budget, protectedBytes, workingBytes: available - protectedBytes - remainingBytes, remainingBytes } };
  return Object.freeze({ ...carrier, sha256: sha256(carrier) });
}

function buildSuccessorCheckpoint(input = {}) {
  return buildContinuityCarrier({ ...input, workingSet: [], budget: { ...input.budget, maxWorkingItems: 0 } });
}

module.exports = { buildContinuityCarrier, buildSuccessorCheckpoint };
