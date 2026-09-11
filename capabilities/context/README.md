# PAI Context Kit

**Status:** `PUBLIC 0.1.0`

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

The current public distribution is the GitHub source package in this repository. No npm-registry publication is claimed by this release.

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

## Release evidence

The recovered compiler and its original 6-test suite are reused byte-identically. The public package adds package metadata, standalone docs, provenance, a synthetic example, a behavior benchmark and the Apache-2.0 license.

Release qualification on PR #15 and post-merge `main` both passed the same GitHub Actions gates:

- exact source SHA-256 identity;
- original tests: **6/6 PASS**;
- deterministic benchmark: **1,000 replay iterations / 1 unique SHA-256**;
- `npm pack` succeeds;
- clean temporary consumer installs and uses the packed package successfully;
- public catalog/link integrity passes with 13 assets.

The first benchmark fixture incorrectly expected a lower-precedence unknown item to fit inside budget=5; it failed as it should. The fixture was corrected to budget=6 without changing compiler/test source bytes. Negative evidence is retained in PR #15.

The benchmark reports fixture-specific byte counts only. They are not a token-savings claim. See `RELEASE_RECEIPT.md` for the release identity and `PROVENANCE.md` for source lineage.

## Protected boundary

This package does not include private Personal continuity data, deep PAI Mind/Chief implementation, proprietary retrieval/ranking/routing/adaptation intelligence, private evaluation/failure corpora, credentials, host topology or authority internals.

License: Apache-2.0. PAI trademarks and Protected Core remain reserved/excluded.
