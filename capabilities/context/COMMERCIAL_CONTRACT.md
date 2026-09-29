# Context Compiler Commercial Contract R1

## Purpose

Context Compiler is the portable product surface of Context Kit. It turns a bounded task plus a caller-owned source map into the smallest source-backed context plan that preserves protected semantics and can be evaluated against a verified outcome.

It is intentionally not a memory database, search engine, model router, scheduler, agent runtime, authority system, credential store, or source of truth.

## Commercial invariants

1. **Source owner stays external.** The compiler selects and describes context; it never becomes truth authority.
2. **VERIFY != HYDRATE.** Metadata, identity, hash, provenance and freshness may be checked without loading a source body.
3. **Protected semantics fail closed.** Objective, acceptance, authority/effect boundary, read/write/effect scopes, constraints, decisions, truth/source status, negation, contradiction, supersession and source provenance are never silently dropped to hit a budget.
4. **Exact missing cone only.** Missing information emits structured `CONTEXT_MISS` for the required source role or exact ref. It does not request a full-history reload.
5. **Deterministic plan identity.** Equivalent task semantics and source metadata produce the same task fingerprint and context-plan identity regardless of source ordering.
6. **Outcome-linked evaluation.** A context strategy is evaluated by its verified Result, corrections/restatements and observable cost/latency/token metrics, not model self-rating.
7. **No raw prompt telemetry.** Context episodes contain identities, refs, omission reasons, outcome labels and observable metrics only.
8. **Adapters are replaceable.** GitHub, Drive, MCP, filesystem, SaaS and enterprise-knowledge connectors implement discovery/fetch outside the compiler.
9. **One generic core, domain profiles.** Product/runtime/repo/QA/native differences are expressed through versioned context profiles, not forks of the compiler.
10. **No savings claim without evidence.** Token/cost reductions are workload-specific unless reproduced on a declared corpus, tokenizer/model and acceptance contract.

## Built-in profiles

| Profile | Required source role | Exact-JIT default |
| --- | --- | --- |
| `repo-engineering` | `REPOSITORY_BASELINE` | pointer-first |
| `product-build` | `PRODUCT_SPEC`, `REPOSITORY_BASELINE` | product spec |
| `runtime-repair` | `DESIRED_STATE`, `RUNTIME_READBACK` | runtime readback |
| `independent-qa` | `FROZEN_SUBJECT`, `TEST_CONTRACT` | frozen subject + tests |
| `native-domain` | `NATIVE_OBJECT` | native object |

Callers may supply a custom versioned strategy with explicit required/exact/optional roles.

## Adapter contract

Adapters SHOULD expose two bounded operations:

1. **discover** → metadata only: `id/ref/roles/hash/size/freshness/authorityClass/truthClass/tags`.
2. **fetchExact** → exactly one requested ref with byte/hash verification and caller-owned authorization.

The compiler never performs network or filesystem I/O itself.

## Context episode contract

`recordContextOutcome()` binds:

`task fingerprint -> strategy -> selected refs -> omissions/misses -> acceptance/baseline identity -> Result disposition -> observable metrics`.

Allowed evaluation metadata includes acceptance-contract ref, baseline-plan ref, provider/model/tokenizer identity and false-success label. Observable metrics include corrections, restatements, context misses, tool calls, latency, input/output tokens, input/output/hydrated bytes and cost. Missing metrics stay unmeasured; they are never guessed.

## Commercial qualification gates

A stable release requires:

- deterministic unit/regression tests;
- protected-field and required-source-role coverage;
- metadata-only broad discovery;
- exact JIT recovery and hash/budget failure tests;
- clean-consumer package install/use;
- public/privacy/secret/provenance scan;
- representative compact-vs-baseline comparison with the same acceptance contract;
- no increase in false-success or accepted-result regression on the declared benchmark;
- backwards compatibility or an explicit semver migration note;
- independent exact-candidate review;
- rollback/revoke path.

## Moat boundary

The portable compiler is intentionally generic. PAI-specific advantage belongs above it: learned context strategy selection from verified trajectories, personal continuity, qualified knowledge, source precedence, negative knowledge and outcome feedback. Those layers may consume Context Episodes but are not embedded in the public compiler.


## Supported package surface

`pai-context-kit` is the supported product-facing API for new consumers. The existing `pai-context-economy` package remains a lower-level public foundation/provenance surface; new integrations should not need to compose both packages. A later standalone repository may consolidate those primitives behind Context Kit/Compiler without changing their verified semantics.

No third parallel Context package should be created merely to rename this capability.

## Standalone repository extraction gate

Keep Context Compiler inside the PAI Open Foundation monorepo while its portable contract is still changing materially. Extract it to a standalone repository only when all of the following are true:

- one supported product-facing API (`pai-context-kit` / Context Compiler) is stable and the older Context Economy surface is clearly compatibility/provenance, not a competing front door;
- exact package CI, clean-consumer use and independent exact-candidate QA pass on the same frozen bytes;
- at least one representative baseline-vs-compiled evaluation proves useful economy with the same acceptance contract and no false-success/accepted-result regression;
- public/private/protected-core boundaries are reproducible from the package itself;
- adapter boundaries are stable enough that GitHub/filesystem/MCP/Drive-style integrations do not require core forks;
- semver, migration, rollback/revoke, provenance and license contracts are explicit;
- a standalone repository materially improves distribution, integration or independent reuse instead of merely duplicating the monorepo.

Use `WFLOW_REPO_BUILDER_R1` for that extraction/productization boundary. The standalone repo must preserve source/result provenance back to the accepted monorepo release and must not silently absorb PAI-specific authority, personal continuity or private strategy-learning state.

## Context reduction and provider caching

Context selection/compaction and provider prompt caching are related but distinct optimizations.

The compiler may classify source descriptors as `STABLE`, `SESSION`, or `LIVE` and emits a provider-neutral `cachePlan`:
- stable, hash-bound refs may form a reusable prefix candidate;
- session/live or unhashed refs stay in the dynamic set;
- adapters decide whether a provider supports caching and how to express breakpoints/accounting;
- the compiler never claims a cache hit and never expands context merely to cross a provider cache threshold without measured value.

Cache economics must be benchmarked with actual provider usage. A cache hit that retains unnecessary context can still cost more than a smaller uncached plan, while compaction can change a prefix and reduce reuse.