# PAI Public Portfolio

This page tracks public-facing PAI capability families without treating roadmap presence as product readiness.

| Capability family | Public value | Current public state | Protected value retained |
| --- | --- | --- | --- |
| Context & Continuity | bounded context packaging, source-aware resume, provider-neutral continuity patterns | public runbooks/patterns available; Context Kit internally `READY_FOR_LICENSE`, software release still gated | deep personal continuity, proprietary retrieval/routing/adaptation |
| W_Flow | reusable resumable work-loop specifications and verification-friendly workflow patterns | public workflow/pattern foundation available; W_Flow internally `READY_FOR_LICENSE`, software release still gated | autonomous internal Program compilation/orchestration |
| Assurance & SimLab | deterministic verification patterns, synthetic labs, failure/recovery reasoning | extensive public reliability evidence exists; bounded SimLab Pilot Core internally `READY_FOR_LICENSE / PILOT_ONLY` | protected evaluators, failure intelligence, advanced repair/assurance engine |
| Skills & Patterns | small reusable verification and engineering recipes | active public foundation with source resolution, route-policy integrity, release-scope and verification intake assets | private/customer-specific adaptations |
| Packs & Labs | versioned examples, synthetic fixtures and reusable bounded distributions | Open Foundation Starter Pack available; executable/lab expansion remains license-gated | private corpora, customer evidence, sovereign/private execution |
| PAI Personal | user-owned continuity and productive assistance | not publicly released as a supported product | core product experience, private memory/continuity and adaptation |
| PAI Assurance | deeper evidence-backed private verification | public methodology/evidence boundary; commercial maturity still evidence-gated | private reconstruction, customer-specific execution, proprietary assurance intelligence |

## Available now

Start with [`docs/QUICKSTART.md`](docs/QUICKSTART.md) or the [`Open Foundation Starter Pack`](packs/open-foundation-starter/README.md).

The following material is already useful independently:

1. **Community Assurance Baseline** — a tool-agnostic workflow for locking claims, pinning evidence, separating PASS/LIVE/DONE, testing positive and negative cases, and publishing only the reusable lesson.
2. **Source-Only Resume Runbook** — a continuity pattern for reconstructing durable context from verified sources while fetching volatile truth just-in-time.
3. **Release-Scope Integrity Review** — a compact skill for proving that a release contains only the authorized composition delta.
4. **Deterministic Source Resolution** — a skill + contract for resolving durable Program/context sources reproducibly without turning stale chat or cached runtime hints into authority.
5. **Reachable-Path Policy Integrity** — a skill + checklist for proving that ordinary, retry, recovery, legacy and alternate routes enforce the same protected-effect invariant.
6. **Verification Intake Checklist + Green Tests case study** — a bounded pattern and real public lesson showing why passing focused tests do not authorize the wrong release composition.
7. **Open Foundation Starter Pack** — one curated path through the current resume, verification, assurance and synthetic-intake assets.
8. **PAI Reliability Evidence archive** — a larger public collection of evidence summaries, case studies, patterns, demos, runbooks, skills and workflows accumulated before this monorepo became the primary public PAI surface.

Archive: https://github.com/tantanpq/pai-reliability-evidence

## Initial productization frontier

These are active packaging targets, not blanket claims of public product completion:

### Context Capsule / Context Kit

Current internal technical disposition: `READY_FOR_LICENSE`.

Target public surface:

- deterministic context compiler;
- public schema and profiles;
- privacy/budget boundaries;
- sample inputs/outputs;
- provider-neutral examples;
- benchmark methodology.

Public software release remains gated on an explicit software/content license decision and release qualification against the exact public package bytes.

### W_Flow

Current internal technical disposition: `READY_FOR_LICENSE`.

Target public surface:

- provider-neutral work-loop/state contract;
- deterministic runner/harness;
- loop template;
- replay/idempotency examples;
- local-blocker and authority-gate examples.

The candidate keeps execution/authority ownership outside W_Flow itself; public executable release still requires an explicit license decision.

### SimLab Core

Current internal technical disposition: `READY_FOR_LICENSE / PILOT_ONLY`.

Target public surface:

- deterministic local verification runner;
- scenario/property/result contracts;
- synthetic fixtures;
- minimized failure/counterexample examples;
- first public SimPack.

The current qualification is for a bounded pilot core only. It does not imply a general production platform, formal proof, universal production readiness or zero defects. Public executable release still requires an explicit license decision.

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
