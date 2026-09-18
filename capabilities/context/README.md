# PAI Context Kit

**Status:** `0.2.0 RELEASE CANDIDATE` (`0.1.0` remains the current tagged release)

Context Kit is a small, dependency-free CommonJS package for deterministic context capsules, metadata-first exact-JIT retrieval, and protected continuity carriers.

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

Version 0.2 adds two public-safe layers without changing the authority boundary:

- **Retrieval Economy:** broad discovery accepts metadata/pointers only, selects one exact JIT ref, verifies exact primary/archive artifacts by SHA-256, and reconciles stale attempt projections through a stable identity.
- **Continuity Carrier:** keeps objective, constraints, accepted decisions, open loops, exact evidence refs, terminal Result and next outcome protected; recent working context is budgeted and raw history stays cold.

The core principle is: **continuity is protected state plus exact evidence refs plus a bounded recent working set plus JIT retrieval—not the whole transcript.**

## What it does not do

Context Kit is not a memory database, hosted-chat capture service, truth authority, agent scheduler, or broad semantic search service. Its retrieval planner ranks only caller-supplied metadata and never decides truth. It does not claim token savings without a representative corpus and tokenizer/model assumptions.

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

Metadata-first retrieval and protected continuity:

```js
const { planRetrieval, buildContinuityCarrier } = require('pai-context-kit');

const plan = planRetrieval({
  query: 'context budget',
  candidates: [{ id: 'budget', ref: 'src/context-budget.js', tags: ['context', 'budget'] }]
});

const carrier = buildContinuityCarrier({
  objective: 'continue one bounded outcome',
  nextOutcome: 'verify the exact release',
  constraints: ['do not invent authority'],
  acceptedDecisions: ['metadata-first retrieval'],
  openLoops: ['publish after QA'],
  programRefs: ['PROGRAM/CONTEXT_KIT'],
  evidenceRefs: [{ id: 'result', ref: 'results/RESULT.md', hash: 'a'.repeat(64) }],
  terminalResult: null,
  workingSet: [],
  budget: { totalBytes: 4096, outputReserveBytes: 512, maxWorkingItems: 2 }
});
```

See `SCHEMA.md` for the input/output contract. Run `npm test`, `npm run benchmark`, and `npm run example`.

## Release evidence

The 0.1 compiler and its original 6-test suite remain intact. The 0.2 candidate adds six independent tests for metadata-only discovery, exact archive lookup and hash verification, stable-ID lifecycle convergence, protected continuity under budget pressure, deterministic successor checkpoints, and bounded protected-overflow failure.

Release qualification on PR #15 and post-merge `main` both passed the same GitHub Actions gates:

- exact source SHA-256 identity;
- original tests: **6/6 PASS**;
- deterministic benchmark: **1,000 replay iterations / 1 unique SHA-256**;
- `npm pack` succeeds;
- clean temporary consumer installs and uses the packed package successfully;
- public catalog/link integrity passes with 13 assets.

The first benchmark fixture incorrectly expected a lower-precedence unknown item to fit inside budget=5; it failed as it should. The fixture was corrected to budget=6 without changing compiler/test source bytes. Negative evidence is retained in PR #15.

The v2 benchmark reports economy and continuity quality separately. The broader PAI campaign's 78.39% p95 reduction remains workload-specific provenance, not a universal package guarantee. See `RELEASE_RECEIPT.md` for the tagged 0.1 release identity, `RELEASE_CANDIDATE_0.2.0.md` for candidate evidence, and `PROVENANCE.md` for source lineage.

## Protected boundary

This package does not include private Personal continuity data, deep PAI Mind/Chief implementation, proprietary retrieval/ranking/routing/adaptation intelligence, private evaluation/failure corpora, credentials, host topology or authority internals.

License: Apache-2.0. PAI trademarks and Protected Core remain reserved/excluded.
