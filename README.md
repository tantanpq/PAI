> **STATUS - 2026-10-30: This repository is the maintained public face of PAI's Open Foundation, refreshed on 2026-10-30.**
> The 2026-10-28 "historical snapshot" notice is superseded. The positioning below has been updated to match how the system actually runs today; product and commercial surfaces live at [zlinegroup.us](https://zlinegroup.us). Statements here stay inside the evidence discipline described in this README: a capability is called live only where a verified result backs it.

---
# PAI

## Personal Assistant Intelligence

**PAI is a user-owned intelligence project for continuity, useful autonomy, reusable capability, and verifiable outcomes.**

The long-term goal is not another chatbot that starts over every time a conversation changes. PAI is being built toward an assistant that can preserve a user's trajectory, understand current reality, continue meaningful work across time, learn from evidence, and act within explicit authority while keeping important decisions with the user.

> Help people spend less effort remembering, reconstructing, coordinating and rechecking work, and gain more time, capability, useful assets and autonomy.

This repository is the **public Open Foundation** of PAI. It is intentionally smaller than the complete private PAI system.

- [`VISION.md`](VISION.md) — why PAI exists, its principles and long-term product direction.
- [`FOUNDER.md`](FOUNDER.md) — founder perspective and project intent.
- [`PORTFOLIO.md`](PORTFOLIO.md) — what is public and usable now.
- [`ROADMAP.md`](ROADMAP.md) — release-oriented public milestones and evidence gates.

## What PAI is

PAI stands for **Personal Assistant Intelligence**.

A mature PAI should be able to preserve continuity across conversations, tools, devices and changing model providers; keep a grounded picture of goals and decisions; resume long-running objectives; verify results against evidence; learn from qualified outcomes; reuse capabilities; and know when to **act, ask, wait or surface** based on authority and uncertainty.

PAI is not intended to be one permanent model. Models, tools and executors are replaceable components. The durable value is the continuity, evidence, learning, capability and authority structure around them.

## Canonical vocabulary

PAI's architecture vocabulary is locked (program-scoped lock). The root identity is **ONE PAI = MIND + BODY**: one personal intelligence (the Mind) acting through replaceable execution surfaces (the Body). Locked names in public use include **PAI Personal**, **One PAI**, **Mind**, **Body**, **Chief-in-Mind** (the coordinating role inside the Mind), **Host**, **Farm**, **Program**, **Campaign**, **Work Seed**, **Result Event** and **Operator Intent**. **Farm** means a multi-host capacity topology for the one Body - never another scheduler, graph or authority.

## What changed recently

The public face was refreshed on 2026-10-30 because the system behind it had changed more than the documents had:

- **SimLab grew up.** The internal deterministic verification line advanced from the public pilot to revision R7 with an attached study layer (Sim Studio) and is in daily operational use. This repository still publishes only the bounded synthetic pilot; no internal evaluator or property intelligence is distributed.
- **Mission Framework went live.** An autonomous mission cycle now plans, executes and verifies recurring work end-to-end; its first full live cycle passed on 2026-10-30 with independent verification, and its public outputs are published content on zlinegroup.us.
- **Outcomes became verifiable.** A locked internal standard (v0.3) governs how a result is projected as signed evidence, checked by independent verifiers, and only then counted as done.
- **Work runs on briefs and proof.** Delegated work is dispatched as written briefs and closed only with a result file carrying proof - never with a chat claim.
- **Control planes run daily operations.** The CP family operates the house's external surfaces under bounded authority; its free subset is public at [pai-cp-free](https://github.com/tantanpq/pai-cp-free).
- **A long-horizon learning track** distills verified work into a persistent knowledge corpus, so lessons compound instead of being rediscovered.
- **The vocabulary was locked and applied.** Public documents now use the canonical names above; an earlier draft naming ladder that was never adopted has been removed.

## Why PAI exists

Modern AI can generate impressive work, but the surrounding user experience is still fragmented:

- useful context disappears between chats and tools;
- users repeatedly restate goals and reconstruct old decisions;
- long-running work becomes tied to one session or provider;
- generated output is often confused with a verified result;
- automation can become hard to resume, replay or trust;
- greater autonomy can arrive without equally clear ownership and effect boundaries.

PAI is exploring a different path: **user-owned continuity + evidence-backed work + bounded autonomy**.

## Product map

| Horizon | Surface | Purpose | Current public state |
| --- | --- | --- | --- |
| **Available now** | Context Kit | bounded context capsules, metadata-first exact-JIT retrieval and protected continuity carriers | **0.2.0 RELEASE CANDIDATE / 0.1.0 TAGGED** |
| **Available now** | W_Flow Core | provider-neutral replayable work-loop and state semantics | **0.1.0 PUBLIC_FOUNDATION** |
| **Available now** | SimLab Core | deterministic synthetic verification and minimized counterexamples | **0.1.0 PUBLIC PILOT / PILOT_ONLY** (bounded public extract; the internal line has advanced to R7 in daily use - see *What changed recently*) |
| **Building toward** | PAI Personal | user-owned continuity and productive assistance across long-running work | **not publicly released as a supported product** |
| **Building toward** | Zline Assurance | evidence-backed verification for AI-assisted engineering and operations (the public assurance line) | **standard locked; first full internal case completed; commercial pilot remains founder-gated** |
| **Live internally** | Mission Framework | autonomous mission cycles that plan, execute and verify recurring work end-to-end | **first full live cycle passed 2026-10-30 with independent verification; public outputs appear on zlinegroup.us** |
| **Live internally** | Control planes (CP family) | bounded, auditable control surfaces for external tools and platforms | **in daily use; a free public subset is published as [pai-cp-free](https://github.com/tantanpq/pai-cp-free)** |
| **Live internally** | Verifiable outcome projection | outcomes carry signed evidence that independent verifiers check before anything counts as done | **evidence gates passed internally under a locked standard (v0.3); production enrollment in progress** |
| **Longer horizon** | PAI Work / Group, domain intelligence, business capabilities, richer local execution | extend continuity and useful capability into shared and specialized work | **future / dependency-gated** |

Roadmap presence is not a readiness claim. Future directions remain bounded by evidence, safety, authority and product value.

## Problems this repository is trying to solve

| Problem | Public PAI response | Boundary |
| --- | --- | --- |
| AI work loses context between chats, tools and providers | deterministic source resolution, bounded context packaging and source-aware resume patterns | public patterns do not include private Personal memory, proprietary retrieval/ranking or hosted-chat capture claims |
| Long-running AI work becomes fragile, non-replayable or dependent on one provider | provider-neutral W_Flow contracts, resumable state, replay/idempotency and explicit local-blocker/authority semantics | W_Flow is not PAI's private Program/Claim/Farm control plane |
| Green tests are mistaken for proof that the right thing shipped | evidence-first assurance, PASS/LIVE/DONE separation, release-scope integrity and reachable-path policy checks | no certification, warranty, formal proof or zero-defect claim |
| AI-generated tests miss failure modes or produce unreproducible failures | deterministic SimLab scenarios, explicit PASS/FAIL/UNKNOWN, known-bad mutants and minimized reproducible counterexamples | public SimLab is synthetic-only; real OS/service/provider claims still require real canary evidence |
| Public releases drift beyond their authorized scope | provenance, release contracts, bounded publication classes and independent integrity checks | private/core/customer/security-sensitive material remains excluded |
| Teams want reusable AI engineering patterns without surrendering their private implementation | small Skills, workflows, Packs and package surfaces with explicit licenses and protected boundaries | the public foundation is not a source dump of `pai-core-private` |

## Public capability families

PAI is currently converging around three public capability families:

- **Context & Continuity** — deterministic, bounded context packaging and source-aware resume patterns.
- **W_Flow** — reusable, resumable work-loop specifications and verification-friendly workflows.
- **Assurance & SimLab** — evidence-first verification patterns, deterministic synthetic test surfaces, minimized counterexamples, and reproducible failure analysis.

The public repository also hosts reusable **Skills, Tools, Packs, Labs, examples, and documentation** when they pass the public release boundary.

## Start here

- [`VISION.md`](VISION.md) — understand the project thesis before the internals.
- [`capabilities/context/README.md`](capabilities/context/README.md) — Context Kit 0.2.0 candidate, deterministic capsules, Retrieval Economy and Continuity Carrier.
- [`capabilities/wflow/README.md`](capabilities/wflow/README.md) — W_Flow Core 0.1.0, provider-neutral replayable work-loop semantics.
- [`capabilities/simlab/README.md`](capabilities/simlab/README.md) — SimLab Core 0.1.0 public pilot for deterministic synthetic verification.
- [`docs/QUICKSTART.md`](docs/QUICKSTART.md) — use the current Open Foundation in a few bounded steps.
- [`PORTFOLIO.md`](PORTFOLIO.md) — current public capability and portfolio map.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how public PAI relates to the protected private core.
- [`docs/PUBLIC_RELEASE_POLICY.md`](docs/PUBLIC_RELEASE_POLICY.md) — what is allowed to become public and how releases are qualified.
- [`docs/BENCHMARKS.md`](docs/BENCHMARKS.md) — current verification baselines and benchmark gates.
- [`LICENSE.md`](LICENSE.md) — Apache-2.0 software scope, CC-BY-4.0 public-content scope, trademark and protected-core boundaries.
- [`workflows/community-assurance-baseline.md`](workflows/community-assurance-baseline.md) — a reusable evidence-first assurance workflow.
- [`runbooks/source-only-resume.md`](runbooks/source-only-resume.md) — resume durable work without treating chat memory as authority.
- [`skills/deterministic-source-resolution.md`](skills/deterministic-source-resolution.md) — resolve durable sources without promoting stale hints into truth.
- [`skills/reachable-path-policy-integrity.md`](skills/reachable-path-policy-integrity.md) — verify that every route to a protected effect enforces the same invariant.
- [`skills/release-scope-integrity.md`](skills/release-scope-integrity.md) — verify that a release contains only the change it was supposed to contain.

## Public repository layout

```text
PAI/
  foundation/      public contracts, standards and conformance guidance
  capabilities/    qualified capability families (Context, W_Flow, SimLab)
  catalog/         public asset catalog and migration records
  skills/          reusable bounded skill recipes
  patterns/        reusable engineering patterns and checklists
  workflows/       generic operational workflows
  runbooks/        bounded operational guides
  case-studies/    public lessons from real runs
  demos/           bounded evidence demos
  examples/        independently usable examples
  packs/           versioned distributions and examples
  docs/            architecture, release and trust documentation
```

## Open Foundation, not a source dump

Public PAI is curated. A useful internal result does **not** automatically become public code.

Public candidates must be useful on their own, bounded by evidence, sanitized, rights-cleared, versionable, testable, and safe to separate from the protected implementation.

Protected material stays private, including deep PAI Mind/Chief internals, proprietary continuity/routing intelligence, private evaluation and failure corpora, sensitive authority/execution machinery, customer/private evidence, credentials, trust roots, and private/sovereign execution details.

## Evidence-first release discipline

PAI keeps these states distinct:

`planned → materialized → running → PASS/FAIL → released/live → terminal outcome`

A passing test is not automatically a production claim. A public claim must remain narrower than or equal to the evidence behind it.

## Licensing

The public licensing strategy is:

- **Apache-2.0** for original PAI software intentionally published as reusable software;
- **CC BY 4.0** for original public non-code material such as documentation, Skills, workflows/W_Flows, patterns and synthetic educational content;
- **trademarks reserved**;
- third-party/migrated assets keep their exact upstream terms.

See [`LICENSE.md`](LICENSE.md) for scope and exclusions. A future change to this licensing strategy remains a founder/legal gate.

## Reliability evidence archive

Earlier public reliability work remains available at [`tantanpq/pai-reliability-evidence`](https://github.com/tantanpq/pai-reliability-evidence).

That repository is treated as a linked evidence/provenance archive while reusable material is progressively curated into this repository. Existing evidence and failure history are preserved rather than silently rewritten.

## Related public repositories

- [`tantanpq/pai-cp-free`](https://github.com/tantanpq/pai-cp-free) - the free public subset of the control-plane family.
- [`tantanpq/leona-scoring-standards`](https://github.com/tantanpq/leona-scoring-standards) - published scoring standards (an earlier published set; the live internal standard has since advanced).
- [`tantanpq/business-idea-scorer`](https://github.com/tantanpq/business-idea-scorer) - the public business-idea scoring specification (V3; the internal skill has since advanced to V4).
- [`tantanpq/pai-reliability-evidence`](https://github.com/tantanpq/pai-reliability-evidence) - the reliability evidence archive (also linked above).

## Current maturity

This repository is the maintained public foundation of PAI: two public foundation packages and one executable public pilot are released here; internal SimLab and control planes operate daily, Mission Framework has completed its first independently verified full live cycle, and outcome projection is governed by a locked internal standard with production enrollment in progress. The goal is not to publish everything PAI has ever built. The goal is to publish a small set of complete, useful, independently understandable capability surfaces and expand only from verified results.

**Context Kit 0.1.0** remains the tagged public executable Open Foundation release. The compatible **0.2.0 release candidate** keeps its source-locked compiler API and adds metadata-first exact-JIT retrieval, exact archive/hash recovery, stable-ID lifecycle convergence, protected continuity carriers, and a two-axis economy/continuity benchmark. The distribution is the source package in this repository; no npm-registry publication is claimed.

**W_Flow Core 0.1.0** is the second public executable package. Five recovered core artifacts are source-hash pinned; exact PR and public-main revisions passed the original 8/8 core suite, a 1,000-iteration deterministic replay benchmark, independent public-boundary QA, wheel build and clean virtualenv installation/use. W_Flow declares work-loop semantics only: it is not an executor, scheduler, Claim service or authority system. No PyPI publication is claimed.

**SimLab Core 0.1.0** is a `PUBLIC PILOT / PILOT_ONLY` executable surface. Exact PR and public-main revisions passed 6/6 public tests, a 1,000-replay deterministic benchmark with one digest, known-good `PASS`, known-bad mutant `FAIL`, missing-evidence `UNKNOWN`, counterexample minimization from 3 events to 2, independent public-boundary QA, `npm pack`, protected-R7 exclusion checks, and clean-consumer use. The public package is synthetic-only and intentionally does not contain protected R7 evaluator/property intelligence. No npm-registry publication is claimed, and no general production-platform maturity is claimed. Since the pilot, the internal SimLab line has advanced to revision R7 with an attached study layer (Sim Studio) and is in daily operational use; this public package intentionally remains the bounded synthetic pilot and does not distribute the internal system's evaluator or property intelligence.

## Claim boundary

PAI is not a certification authority, security warranty, uptime guarantee, or claim of zero defects.

Its public engineering goal is more concrete: **make useful AI work resumable, reusable, and easier to verify against actual evidence while keeping the user in control.**
