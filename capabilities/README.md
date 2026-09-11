# PAI Capability Catalog

PAI separates **capability existence**, **public packaging**, and **commercial support**. A capability can be real internally without yet being a public product.

## Maturity vocabulary

- `EXPERIMENTAL`: useful for exploration; no supported public contract.
- `PACKAGE_CANDIDATE`: a public software/package surface is being prepared and tested.
- `PUBLIC_FOUNDATION`: reusable public method, schema, pattern or bounded software package that passed its declared release boundary.
- `PILOT_ONLY`: a released bounded pilot whose evidence does not justify general production-platform maturity.
- `RELEASED`: a specific public version has passed its release boundary; the more specific maturity label still governs its claims.
- `SUPPORTED_PRODUCT`: installation/update/support/privacy/security expectations are explicitly provided.

Presence in this repository does not automatically imply `SUPPORTED_PRODUCT`.

## Context & Continuity

**Goal:** make useful context portable, bounded and reconstructable without treating chat memory as operational authority.

Current public state: **Context Kit 0.1.0 — `PUBLIC_FOUNDATION`**.

Released surface:

- deterministic Context Capsule compiler;
- public profiles/schema;
- context budget and privacy boundaries;
- deterministic precedence/dedup and structured `CONTEXT_MISS`;
- sample usage, benchmark, provenance and release receipt;
- clean-consumer package verification.

Protected boundary:

- private personal continuity;
- proprietary retrieval/ranking/routing/adaptation intelligence;
- private user data and internal authority machinery.

## W_Flow

**Goal:** publish resumable, replay-safe work-loop specifications that are useful across providers and tools.

Current public state: **W_Flow Core 0.1.0 — `PUBLIC_FOUNDATION`**.

Released surface:

- provider-neutral state/transition contract;
- deterministic transition/evaluation harness;
- loop blueprint schema and instance template;
- replay/idempotency and `NO_MATERIAL_DELTA` semantics;
- local-blocker containment contract;
- external authority-gate semantics;
- one logical owner + exact mutable-scope declaration;
- benchmark, public QA, provenance and release receipt.

Protected boundary:

- private PAI Program compilation and autonomous orchestration internals;
- Governor/RSM/Claim/Farm implementation and production authority;
- runtime-exclusive writer enforcement.

## Assurance & SimLab

**Goal:** make system claims falsifiable with deterministic checks, explicit evidence and reproducible failures.

Current public state: **SimLab Core 0.1.0 — `PUBLIC PILOT / PILOT_ONLY`**.

Released pilot surface:

- dependency-free deterministic synthetic verification runner;
- `PASS / FAIL / UNKNOWN` result semantics;
- bounded property checks;
- public SimPack contract and first synthetic SimPack;
- known-good and known-bad fixtures;
- deterministic replay identity;
- supported sequence counterexample minimization;
- benchmark, public QA, provenance and release receipt.

The public pilot is synthetic-only. Real OS/service/network/provider behavior remains bounded-real-canary gated outside the package.

Protected boundary:

- protected R7 runner and property/evaluator intelligence;
- protected failure/evaluation corpora;
- private repair intelligence;
- customer-specific reconstruction and sovereign/private execution;
- production promotion authority.

## PAI Personal

PAI Personal is the protected flagship product direction. Public components may eventually support it, but this repository does not claim a generally available Personal release today.

## PAI Assurance

PAI Assurance is the leading near-term commercial direction. Public methodology should remain genuinely useful, while private/customer-specific verification, reconstruction and proprietary assurance intelligence remain separately governed.

## Distribution boundary

The executable releases above are currently distributed from this GitHub repository. npm/PyPI registry publication is not claimed. Public release evidence is not the same thing as a supported commercial product or measured market demand.
