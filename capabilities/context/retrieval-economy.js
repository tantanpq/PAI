'use strict';

const crypto = require('node:crypto');

const BODY_FIELDS = Object.freeze(['body', 'content', 'fullContent', 'raw', 'text']);
const TERMINAL = new Set(['DONE', 'NOT_DONE', 'BLOCKED', 'CANCELLED', 'SUPERSEDED']);
const text = value => typeof value === 'string' && value.length > 0;
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const bytes = value => Buffer.byteLength(JSON.stringify(value), 'utf8');

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function metadataOnly(candidate) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate) || !text(candidate.id) || !text(candidate.ref)) fail('RETRIEVAL_CANDIDATE_INVALID');
  if (BODY_FIELDS.some(field => candidate[field] !== undefined && candidate[field] !== null)) fail('BROAD_DISCOVERY_BODY_FORBIDDEN');
  if (candidate.hash !== undefined && !/^[a-f0-9]{64}$/.test(candidate.hash)) fail('RETRIEVAL_HASH_INVALID');
  return {
    id: candidate.id,
    ref: candidate.ref,
    name: text(candidate.name) ? candidate.name : candidate.id,
    kind: text(candidate.kind) ? candidate.kind : 'source',
    tags: Array.isArray(candidate.tags) ? [...new Set(candidate.tags.map(String))].sort() : [],
    sizeBytes: Number.isSafeInteger(candidate.sizeBytes) && candidate.sizeBytes >= 0 ? candidate.sizeBytes : null,
    hash: candidate.hash || null,
    archiveRef: text(candidate.archiveRef) ? candidate.archiveRef : null
  };
}

function planRetrieval({ query, candidates, maxResults = 5, maxMetadataBytes = 4096 } = {}) {
  if (!text(query) || !Array.isArray(candidates) || !Number.isSafeInteger(maxResults) || maxResults < 1 || maxResults > 32 || !Number.isSafeInteger(maxMetadataBytes) || maxMetadataBytes < 256) fail('RETRIEVAL_PLAN_INVALID');
  const terms = query.toLowerCase().split(/\W+/).filter(Boolean);
  const ranked = candidates.map(metadataOnly).map(pointer => {
    const searchable = `${pointer.id} ${pointer.ref} ${pointer.name} ${pointer.kind} ${pointer.tags.join(' ')}`.toLowerCase();
    const exact = [pointer.id, pointer.ref, pointer.name].some(value => value.toLowerCase() === query.toLowerCase());
    const score = (exact ? 1000 : 0) + terms.reduce((sum, term) => sum + (searchable.includes(term) ? 1 : 0), 0);
    return { ...pointer, score };
  }).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id) || a.ref.localeCompare(b.ref));
  const selected = [];
  for (const pointer of ranked) {
    if (pointer.score <= 0) continue;
    if (selected.length >= maxResults) break;
    const next = [...selected, pointer];
    if (bytes(next) > maxMetadataBytes) continue;
    selected.push(pointer);
  }
  const hit = selected.find(pointer => pointer.score > 0) || null;
  return Object.freeze({
    schema: 'retrieval-plan/v1',
    status: hit ? 'READY' : 'CONTEXT_MISS',
    query,
    pointers: selected,
    selectedRef: hit?.ref || null,
    selectedId: hit?.id || null,
    discovery: { mode: 'METADATA_ONLY', bodyCount: 0, resultCount: selected.length, maxResults, maxMetadataBytes },
    next: hit ? { action: 'EXACT_JIT_FETCH', id: hit.id, ref: hit.ref } : null,
    miss: hit ? null : { code: 'CONTEXT_MISS', reason: 'NO_RELEVANT_POINTER' }
  });
}

function resolveExactArtifact({ stableId, expectedHash, primaryRef, archiveRef, available, maxBytes = 8192 } = {}) {
  if (!text(stableId) || !text(expectedHash) || !/^[a-f0-9]{64}$/.test(expectedHash) || !text(primaryRef) || !Array.isArray(available) || available.length > 2 || !Number.isSafeInteger(maxBytes) || maxBytes < 1) fail('EXACT_FETCH_INVALID');
  const refs = [primaryRef, archiveRef].filter(text);
  const candidates = available.filter(item => item && item.stableId === stableId && refs.includes(item.ref) && typeof item.content === 'string');
  for (const ref of refs) {
    const item = candidates.find(candidate => candidate.ref === ref);
    if (!item) continue;
    const actualHash = sha256(Buffer.from(item.content, 'utf8'));
    if (actualHash !== expectedHash) fail('EXACT_ARTIFACT_HASH_DRIFT');
    const contentBytes = Buffer.byteLength(item.content, 'utf8');
    if (contentBytes > maxBytes) return Object.freeze({ schema: 'exact-artifact/v1', status: 'CONTEXT_MISS', stableId, ref, hash: actualHash, content: null, contentBytes, maxBytes, miss: { code: 'CONTEXT_MISS', reason: 'EXACT_SOURCE_EXCEEDS_BUDGET' } });
    return Object.freeze({ schema: 'exact-artifact/v1', status: 'READY', stableId, ref, hash: actualHash, content: item.content, contentBytes, maxBytes, source: ref === primaryRef ? 'PRIMARY_EXACT_REF' : 'ARCHIVE_EXACT_REF' });
  }
  return Object.freeze({ schema: 'exact-artifact/v1', status: 'CONTEXT_MISS', stableId, ref: null, hash: expectedHash, content: null, contentBytes: 0, maxBytes, miss: { code: 'CONTEXT_MISS', reason: 'EXACT_SOURCE_NOT_FOUND' } });
}

function convergeLifecycleProjection({ stableId, cachedAttemptId = null, attempts } = {}) {
  if (!text(stableId) || !Array.isArray(attempts) || attempts.length > 32) fail('LIFECYCLE_PROJECTION_INVALID');
  const rows = attempts.filter(row => row && row.stableId === stableId && text(row.attemptId) && text(row.state) && text(row.updatedAt))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.attemptId.localeCompare(b.attemptId));
  const selected = rows.find(row => TERMINAL.has(row.state)) || rows[0] || null;
  if (!selected) return Object.freeze({ schema: 'lifecycle-projection/v1', status: 'CONTEXT_MISS', stableId, attemptId: null, state: null, miss: { code: 'CONTEXT_MISS', reason: 'STABLE_ID_NOT_FOUND' } });
  return Object.freeze({ schema: 'lifecycle-projection/v1', status: 'READY', stableId, attemptId: selected.attemptId, state: selected.state, updatedAt: selected.updatedAt, source: selected.attemptId === cachedAttemptId ? 'CACHED_EXACT_ATTEMPT' : 'STABLE_ID_FALLBACK', staleCachedAttemptRejected: Boolean(cachedAttemptId && selected.attemptId !== cachedAttemptId) });
}

module.exports = { planRetrieval, resolveExactArtifact, convergeLifecycleProjection, sha256 };
