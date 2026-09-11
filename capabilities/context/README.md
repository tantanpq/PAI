# PAI Context Kit

**Status:** `0.1.0 RELEASE CANDIDATE`

Context Kit is a small, dependency-free CommonJS package for turning an explicit set of evidence items into a deterministic, bounded context capsule.

It targets a common failure mode in long-running AI work: either carrying too much stale context forever, or losing the few source-backed facts and constraints needed to resume safely.

## What it does

- deterministic ordering and SHA-256 identity for identical evidence;
- three declared profiles: Resume Capsule, Continuity Passport, Work Context;
- explicit precedence, deduplication and item-budget behavior;
- PUBLIC / PERSONAL / SECRET redaction boundaries;
- fail-closed rejection of malformed or credential-like input;
- structured `CONTEXT_MISS` when selected evidence explicitly contains unknowns;
- source/provenance fields remain visible instead of being collapsed into model confidence;
- pure projection: compilation does not persist or mutate a memory store.

## What it does not do

Context Kit is not a memory database, retrieval/ranking engine, hosted-chat capture service, truth authority, agent scheduler, or claim that every relevant fact fits into a bounded context. It does not claim token savings without a representative corpus and tokenizer/model assumptions.

## Install from a local checkout

```bash
npm install ./capabilities/context
```

## Use

```js
const { compile } = require('pai-context-kit');

const result = compile({
  owner: { principalId: 'person-a', accountId: 'account-a', workspaceId: 'workspace-a' },
  profile: 'resume',
  budget: 3,
  coverage: { observedUserSignals: 1, unobservedHostedChatTurns: 0 },
  items: [
    {
      kind: 'intent',
      id: 'intent-1',
      value: 'resume the verified work',
      privacyClass: 'PUBLIC',
      provenance: { source: 'accepted-evidence' },
      freshness: '2026-09-11T00:00:00Z'
    }
  ]
});

console.log(result.capsule);
```

See `SCHEMA.md` for the input/output contract. Run `npm test`, `npm run benchmark`, and `npm run example`.

## Evidence boundary

The recovered compiler and its original 6-test suite are reused byte-identically. The public release candidate adds package metadata, standalone docs, provenance, a synthetic example, a behavior benchmark and the Apache-2.0 license.

The internal/source baseline is **6/6 PASS**. The release candidate must still pass CI on its exact PR bytes, including package tests, benchmark replay, `npm pack`, clean-consumer install/use, public-integrity checks and release readback before this status becomes a supported public release.

The benchmark reports fixture-specific byte counts only. They are not a token-savings claim.

## Protected boundary

This package does not include private Personal continuity data, deep PAI Mind/Chief implementation, proprietary retrieval/ranking/routing/adaptation intelligence, private evaluation/failure corpora, credentials, host topology or authority internals.

License: Apache-2.0. PAI trademarks and Protected Core remain reserved/excluded.
