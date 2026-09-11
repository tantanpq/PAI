# PAI Public Portfolio

This page tracks public-facing PAI capability families without treating roadmap presence as product readiness.

| Capability family | Public value | Current public state | Protected value retained |
| --- | --- | --- | --- |
| Context & Continuity | bounded context packaging, source-aware resume, provider-neutral continuity patterns | **Context Kit 0.1.0 PUBLIC** plus public runbooks/patterns; source/provenance and release evidence pinned | deep personal continuity, proprietary retrieval/routing/adaptation |
| W_Flow | reusable resumable work-loop specifications and verification-friendly workflow patterns | **W_Flow Core 0.1.0 PUBLIC**; source/provenance, replay benchmark, public QA and clean-consumer evidence pinned | autonomous internal Program compilation/orchestration |
| Assurance & SimLab | deterministic verification patterns, synthetic labs, failure/recovery reasoning | extensive public reliability evidence exists; SimLab Pilot Core remains `PILOT_ONLY / PACKAGE_QA_PENDING` | protected evaluators, failure intelligence, advanced repair/assurance engine |
| Skills & Patterns | small reusable verification and engineering recipes | active public foundation with source resolution, route-policy integrity, release-scope and verification intake assets | private/customer-specific adaptations |
| Packs & Labs | versioned examples, synthetic fixtures and reusable bounded distributions | Open Foundation Starter Pack available; executable/lab expansion requires exact package qualification | private corpora, customer evidence, sovereign/private execution |
| PAI Personal | user-owned continuity and productive assistance | not publicly released as a supported product | core product experience, private memory/continuity and adaptation |
| PAI Assurance | deeper evidence-backed private verification | public methodology/evidence boundary; commercial maturity still evidence-gated | private reconstruction, customer-specific execution, proprietary assurance intelligence |

## Available now

Start with [`capabilities/context/README.md`](capabilities/context/README.md), [`capabilities/wflow/README.md`](capabilities/wflow/README.md), [`docs/QUICKSTART.md`](docs/QUICKSTART.md), or the [`Open Foundation Starter Pack`](packs/open-foundation-starter/README.md).

The following material is already useful independently:

1. **Context Kit 0.1.0** — dependency-free deterministic bounded-context compiler with explicit profiles, privacy/budget behavior, provenance, benchmark and clean-consumer evidence.
2. **W_Flow Core 0.1.0** — provider-neutral deterministic loop/state semantics with exact replay, `NO_MATERIAL_DELTA`, local-blocker containment and external authority gates.
3. **Community Assurance Baseline** — a tool-agnostic workflow for locking claims, pinning evidence, separating PASS/LIVE/DONE, testing positive and negative cases, and publishing only the reusable lesson.
4. **Source-Only Resume Runbook** — a continuity pattern for reconstructing durable context from verified sources while fetching volatile truth just-in-time.
5. **Release-Scope Integrity Review** — a compact skill for proving that a release contains only the authorized composition delta.
6. **Deterministic Source Resolution** — a skill + contract for resolving durable Program/context sources reproducibly without turning stale chat or cached runtime hints into authority.
7. **Reachable-Path Policy Integrity** — a skill + checklist for proving that ordinary, retry, recovery, legacy and alternate routes enforce the same protected-effect invariant.
8. **Verification Intake Checklist + Green Tests case study** — a bounded pattern and real public lesson showing why passing focused tests do not authorize the wrong release composition.
9. **Open Foundation Starter Pack** — one curated path through the current resume, verification, assurance and synthetic-intake assets.
10. **PAI Reliability Evidence archive** — a larger public collection of evidence summaries, case studies, patterns, demos, runbooks, skills and workflows accumulated before this monorepo became the primary public PAI surface.

Archive: https://github.com/tantanpq/pai-reliability-evidence

## Initial productization frontier

The license strategy is selected. Context Kit and W_Flow Core have crossed bounded exact-package release boundaries; SimLab remains the active executable package frontier.

### Context Capsule / Context Kit

Current disposition: `PUBLIC_0.1.0 / FIRST_RELEASE_CANARY_PASS`.

Release evidence includes byte-identical recovered compiler/test source, 6/6 tests, 1,000 deterministic replay iterations with one unique SHA-256, `npm pack`, clean-consumer install/use, PR qualification and post-merge `main` readback. No npm-registry publication or token-savings percentage is claimed.

### W_Flow Core

Current disposition: `PUBLIC_0.1.0 / PACKAGE_CANARY_PASS`.

Public surface:

- provider-neutral work-loop/state contract;
- deterministic transition/evaluation harness;
- loop blueprint schema and instance template;
- replay/idempotency behavior;
- explicit `NO_MATERIAL_DELTA`;
- local-blocker containment;
- external authority-gate semantics;
- one logical owner + exact mutable-scope declaration.

Release evidence includes five byte-identical recovered source artifacts, original 8/8 core tests, 1,000 deterministic iterations with one output digest, independent public-boundary QA, Python wheel build and clean virtualenv installation/use on PR and public `main`. Runtime-exclusive writer enforcement remains external; W_Flow does not become a scheduler, Claim service or authority system. No PyPI publication is claimed.

### SimLab Core

Current disposition: `LICENSE_SELECTED / PILOT_ONLY / PACKAGE_QA_PENDING`.

Target public surface:

- deterministic local verification runner;
- scenario/property/result contracts;
- synthetic fixtures;
- minimized failure/counterexample examples;
- first public SimPack.

Current source evidence includes 36/36 compatibility checks and 73/73 R7 verification checks with known-bad policy-mutant rejection, cross-host independent QA and 8/8 application fixtures. The qualification remains for a bounded pilot core only. It does not imply a general production platform, formal proof, universal production readiness or zero defects. Exact public-package clean-consumer verification and IQA remain required.

See [`docs/BENCHMARKS.md`](docs/BENCHMARKS.md) for release benchmark gates and [`LICENSE.md`](LICENSE.md) for licensing scopes.

## Evidence archive relationship

`pai-reliability-evidence` remains a public evidence/provenance source during migration. Its strongest reusable assets are progressively curated into this repository while source provenance and historical failure/supersession truth stay preserved.

The archive remains linked rather than silently deleted so existing evidence references continue to resolve.

## What success looks like

PAI public portfolio quality is measured by stronger evidence than repository size:

- a new user can reproduce a useful outcome;
- components work outside the original PAI environment;
- releases have explicit versions, boundaries and provenance;
- public material produces real reuse, corrections or design partners;
- paid/private Assurance evidence eventually demonstrates measured value and renewal;
- public value grows without exposing the proprietary core that makes the private system differentiated.
