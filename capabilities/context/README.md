# PAI Context Compiler / Context Kit

**Status:** `0.3.0-rc.1 COMMERCIAL CONTRACT CANDIDATE` (`0.1.0` remains the current tagged stable release)

Context Kit is a dependency-free CommonJS package for deterministic context compilation, bounded context capsules, metadata-first exact-JIT retrieval, protected continuity carriers, and outcome-linked Context Episodes.

The commercial direction is deliberately narrow: **compile the smallest sufficient source-backed context plan, preserve the fields that cannot be traded away, and evaluate the chosen strategy against a verified outcome.**

## Product layers

- **Context Compiler:** task/profile/source-map orchestration with deterministic plan identity, explicit omissions, exact missing-cone semantics and JIT expansion requests.
- **Context Capsule:** deterministic evidence projection with privacy, precedence and bounded selection.
- **Retrieval Economy:** metadata-first discovery and exact hash-verified JIT recovery.
- **Continuity Carrier:** protected objective/decision/open-loop/evidence state plus a bounded working set.
- **Context Episode:** a raw-content-free record linking one context strategy and source set to an accepted/rejected Result plus observable token/cost/latency/correction metrics.

The package performs no network, filesystem or memory-store I/O. Source discovery/fetch and authorization remain adapter/caller responsibilities.

## Built-in commercial profiles

| Profile | Required source roles | Default exact-JIT |
| --- | --- | --- |
| `repo-engineering` | `REPOSITORY_BASELINE` | pointer-first |
| `product-build` | `PRODUCT_SPEC`, `REPOSITORY_BASELINE` | product spec |
| `runtime-repair` | `RUNTIME_READBACK` | runtime readback |
| `independent-qa` | `FROZEN_SUBJECT`, `TEST_CONTRACT` | frozen subject + tests |
| `native-domain` | `NATIVE_OBJECT` | native object |

Custom strategies are allowed only when they carry an explicit id/version and required/exact/optional source-role contract.

## Commercial invariants

1. **VERIFY != HYDRATE** — identity/hash/provenance checks do not imply loading bodies.
2. **Pointer first, exact JIT second** — discovery metadata contains no source bodies.
3. **Protected semantics fail closed** — objective, acceptance, authority/effect/scope, constraints and provenance are not silently removed for size.
4. **Exact missing cone only** — missing context identifies the required role/ref instead of requesting full history.
5. **One semantic object, one active representation** — equivalent refs are merged deterministically.
6. **Outcome-linked evaluation** — strategy quality is judged against verified Results and observed corrections/restatements/cost/latency/tokens, not model self-rating.
7. **No raw prompt telemetry** — Context Episodes contain ids/refs/outcomes/metrics, not prompts or transcripts.
8. **Adapters are replaceable** — GitHub, Drive, MCP, filesystem, SaaS and enterprise knowledge connectors remain outside the core.

See [COMMERCIAL_CONTRACT.md](COMMERCIAL_CONTRACT.md).

## Install from a local checkout

```bash
npm install ./capabilities/context
```

No npm-registry publication is claimed by this candidate.

## Commercial compiler example

```js
const { compileContextPlan, recordContextOutcome } = require('pai-context-kit');

const plan = compileContextPlan({
  profile: 'repo-engineering',
  task: { id: 'fix-42', objective: 'repair the context compiler regression' },
  acceptance: ['targeted tests pass'],
  authority: 'READ_ONLY',
  scopes: { read: ['repo'], write: ['capabilities/context'] },
  sourceMap: [
    {
      id: 'repo',
      ref: 'git:main@abc123',
      roles: ['REPOSITORY_BASELINE'],
      hash: 'a'.repeat(64),
      priority: 10
    },
    {
      id: 'spec',
      ref: 'docs/context.md',
      roles: ['SPEC'],
      tags: ['context', 'compiler']
    }
  ]
});

if (plan.status === 'CONTEXT_MISS') {
  console.log(plan.missing);
}

const episode = recordContextOutcome({
  plan,
  result: {
    resultId: 'result-42',
    disposition: 'ACCEPTED',
    accepted: true,
    verificationRef: 'ci:run-123',
    inputTokens: 900,
    outputTokens: 160,
    correctionCount: 0
  }
});
```

## Existing capsule API

The earlier `compile()` API remains available unchanged for evidence-item capsule compilation.

```js
const { compile } = require('pai-context-kit');

const result = compile({
  owner: { principalId: 'person-a', accountId: 'account-a', workspaceId: 'workspace-a' },
  profile: 'resume',
  budget: 3,
  coverage: { observedUserSignals: 1, unobservedHostedChatTurns: 0 },
  items: [{
    kind: 'intent',
    id: 'intent-1',
    value: 'resume the verified work',
    privacyClass: 'PUBLIC',
    provenance: { source: 'accepted-evidence' },
    freshness: '2026-09-11T00:00:00Z'
  }]
});
```

## Retrieval and continuity

```js
const { planRetrieval, buildContinuityCarrier } = require('pai-context-kit');

const retrieval = planRetrieval({
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

## Qualification

Run:

```bash
npm test
npm run benchmark
npm run qa
npm pack
```

The 0.3 candidate is additive over 0.2. It must preserve the original Context Capsule tests, Context Kit v2 retrieval/continuity tests, the new commercial compiler tests, public-boundary QA, deterministic benchmark behavior and clean-consumer package use.

The broader PAI campaign's 78.39% p95 visible-context reduction remains workload-specific provenance, not a universal package guarantee. A stable commercial release additionally requires representative baseline-vs-compiled evaluation with the same acceptance contract and no false-success/accepted-result regression.

## Boundary

Context Compiler is not a memory database, semantic truth store, scheduler, model router, executor, hosted-chat capture service or authority system. The portable core is intentionally generic; learned personal context strategy, continuity, qualified knowledge and outcome feedback remain higher-layer PAI moat.

License: Apache-2.0. PAI trademarks and Protected Core remain reserved/excluded.
