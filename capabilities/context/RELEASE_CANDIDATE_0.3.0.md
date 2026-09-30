# Context Compiler 0.3.0-rc.1 release candidate

## Scope

This candidate keeps the Context Kit 0.1/0.2 APIs and adds a commercial orchestration contract rather than another context subsystem.

New public API:
- `compileContextPlan()`: versioned task/profile/source-map compilation with deterministic identity, explicit omissions, exact missing-cone semantics and JIT expansion requests.
- `recordContextOutcome()`: bounded Context Episode linking one strategy/plan to a verified Result and observable metrics without retaining raw prompts/source bodies.
- five built-in portable profiles plus custom versioned strategies.

## Required qualification

- all prior Context Capsule / Context Kit 0.2 tests remain green;
- Context Compiler commercial suite passes;
- source bodies are rejected from discovery metadata;
- exported built-in profile contracts are deeply immutable;
- explicit invalid context ceilings fail closed rather than widening, including custom-strategy `maxSelectedSources`;
- malformed explicit authority/effect/privacy/scope/truth/source classifications fail closed instead of becoming permissive defaults;
- each exported package subpath has declarations scoped to its actual runtime exports;
- exact-JIT sources without a verifiable expected hash return a structured miss and no fetch request;
- required roles select a minimum sufficient representative source instead of forcing every same-role candidate into context, preferring a source that covers more still-required roles, while exact `required: true` refs remain fail-closed dependencies;
- caller source-count budgets can tighten but cannot widen the profile/strategy ceiling;
- exact strategy role contracts are digest-bound into task, plan and cache identity, including custom strategies that reuse a built-in id;
- malformed explicit source metadata and protected task/episode identity fields fail closed rather than silently defaulting;
- Context Episodes retain bounded omitted-source, missing-cone and expansion-request provenance without raw bodies;
- required source roles fail closed as `CONTEXT_MISS`;
- equivalent source ordering yields identical plan identity;
- compiled plans are deeply immutable and Context Episode creation rejects post-compile plan tampering;
- out-of-profile optional roles are excluded and required source-count overflow fails closed;
- conflicting same-ref authority/truth/hash metadata fails closed;
- truth/source status, negation/contradiction and supersession remain protected task semantics;
- runtime profile requires desired state plus exact JIT runtime readback; product/QA/native profiles request their exact JIT refs without hydrating them;
- Context Episode rejects raw prompt/transcript/message bodies and may bind acceptance/baseline/provider/model/tokenizer plus observed byte/token/cost metrics;
- benchmark reports compiler-plan identity and outcome-link fields separately from byte reduction;
- `npm pack` and clean-consumer use exercise the new API;
- public-boundary QA scans compiler/tests/contracts;
- exact PR workflow passes before promotion.

## Compatibility
- Existing Context Kit 0.1/0.2 public APIs remain exported.
- Context Compiler 0.3 RC raises the supported Node runtime floor to Node.js 22+. Node 18/20 are not supported by this RC; consumers that cannot upgrade their runtime should remain on the earlier supported package line.
- Exact CI qualifies Node 22 LTS and Node 24 LTS. Newer/current Node versions may work but are not implied by this release evidence.
- No npm-registry publication is claimed.


No existing 0.1/0.2 export is removed. The new compiler API is additive. The prior `compile()`, Retrieval Economy and Continuity Carrier contracts remain available.

## Claim boundary

This release candidate does not claim automatic source discovery, agent authority, memory ownership, universal token savings, hosted service availability, billing, enterprise security certification, or learned/adaptive routing. Adapters and source authorization remain caller-owned.

## Rollback

Revert the candidate commits or continue using the previous tagged Context Kit release. No external state migration is required because the package is a pure projection library.
