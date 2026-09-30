# Context Kit schema

Context Kit 0.3 is additive: the `compile()` Context Capsule v1 API, Retrieval Economy and Continuity Carrier remain compatible while Context Compiler adds a versioned orchestration and outcome-evaluation layer.

## Context Compiler plan

`compileContextPlan()` accepts:

- `profile`: one built-in profile, or `strategy` with explicit id/version/role contract;
- `task.objective`: required;
- optional task identity/class/project/checkpoint refs;
- protected `constraints`, `acceptedDecisions`, `acceptance`, `authority`, `effectClass`, `privacyClass`, `scopes`, `outputContract`, truth/source status, negations, contradictions and supersession refs; defaults apply only when optional classification fields are omitted, while malformed explicit classifications fail closed;
- a metadata-only `sourceMap`;
- bounded `maxSelectedSources`, `maxMetadataBytes`, and `maxHydrationBytes`; omitted values use profile/default ceilings, while explicitly invalid values fail closed instead of widening to a default.

Source descriptors require `id`, `ref` and one or more `roles`. Optional fields include hash, size, maxBytes, tags, priority, freshness, authorityClass, truthClass, availability, resolution and `volatility = STABLE | SESSION | LIVE`. A hash is mandatory whenever the selected strategy resolves that source as `EXACT_JIT`; otherwise the plan returns `CONTEXT_MISS / EXACT_SOURCE_HASH_REQUIRED` and emits no unusable fetch request. Built-in/custom strategies admit non-required sources only when at least one role is declared in that strategy; each `requiredRole` requires at least one selected source that satisfies the role and required-role candidates are re-ranked against roles still uncovered after each selection, while descriptor-level `required: true` protects that exact ref; caller-marked `required: true` sources remain protected task-specific requirements. Conflicting hash/authority/truth metadata for the same ref fails closed.

Source-body fields such as `body`, `content`, `raw`, `text`, `messages`, `transcript` or `prompt` are forbidden in discovery input.

Output schema: `context-compiler-plan/v1`.

It contains:
- deterministic `taskFingerprint` and `contextPlanId`;
- versioned strategy/profile;
- protected state;
- selected source metadata;
- explicit omissions;
- exact `EXACT_JIT_FETCH` requests;
- structured missing-role/ref/budget reasons;
- budget decision;
- provider-neutral `cachePlan` with hash-bound stable-prefix candidates and dynamic refs;
- stable invariants.

A required role with no available source returns `CONTEXT_MISS`. It does not trigger a broad history/source-body reload.

## Built-in source-role profiles

- `repo-engineering`: requires `REPOSITORY_BASELINE`.
- `product-build`: requires `PRODUCT_SPEC` and `REPOSITORY_BASELINE`; product spec defaults to exact JIT.
- `runtime-repair`: requires `DESIRED_STATE` plus exact-JIT `RUNTIME_READBACK`; repair context must know both intended and observed state.
- `independent-qa`: requires exact-JIT `FROZEN_SUBJECT` and `TEST_CONTRACT`.
- `native-domain`: requires exact-JIT `NATIVE_OBJECT`.

Profiles express context requirements only. They do not grant authority or execute source fetches.

## Context Episode

`recordContextOutcome()` accepts one compiler plan plus:

- `resultId`;
- disposition: `ACCEPTED | REJECTED | NEEDS_REVISION | UNKNOWN`;
- optional accepted boolean and verificationRef;
- observable correction/restatement/context-miss counts;
- optional acceptance-contract/baseline/provider/model/tokenizer identity and false-success label;
- observable latency, input/output tokens, input/output/hydrated bytes, tool-call count and cost.

Output schema: `context-episode/v1`.

It links task fingerprint, strategy, selected source identities, omission/miss classes, budget decision and outcome. Raw prompt/source/transcript/message fields are rejected and `rawContentStored` is always false.

## Context Capsule v1

The existing `compile()` request requires:
- owner principal/account/workspace;
- profile `resume | passport | work`;
- positive item budget;
- observed/unobserved coverage;
- evidence items with kind/id/value/privacy/provenance/freshness.

Selection remains deterministic. Explicit omissions remain `PROFILE_EXCLUDED`, `PRIVACY_REDACTED`, `DUPLICATE`, `BUDGET_EXCEEDED`.

## Retrieval Economy

`planRetrieval()` is metadata-only and emits at most an exact JIT ref on a hit.

`resolveExactArtifact()` verifies one stable identity against its expected SHA-256 and byte budget. Oversized exact sources return `CONTEXT_MISS` with `content: null`.

`convergeLifecycleProjection()` rejects stale cached attempt projections using caller-supplied governed attempt metadata.

## Continuity Carrier

`buildContinuityCarrier()` protects objective/next outcome, constraints, accepted decisions, open loops, Program/Campaign/Mission refs, exact evidence refs and terminal Result pointer. Identical exact refs are deduplicated before budget accounting.

Raw history is rejected; protected overflow returns `CONTEXT_MISS`.

## Invariants

- VERIFY != HYDRATE.
- Metadata first; exact JIT only when required.
- Protected semantics are never silently traded for size.
- Missing context expands the exact missing cone.
- Outcome metrics are observed or null, never invented.
- Core performs no network, filesystem, persistence, scheduling or authority action.
- Context reduction and provider caching are distinct; cachePlan is advisory and never proves a cache hit.
