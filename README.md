# PAI

**PAI is a user-owned intelligence and evidence-first engineering project focused on continuity, reusable work, and verifiable outcomes.**

This repository is the public PAI distribution surface. It is intentionally smaller than the complete private PAI system.

## Problems this repository is trying to solve

| Problem | Public PAI response | Boundary |
| --- | --- | --- |
| AI work loses context between chats, tools and providers | deterministic source resolution, bounded context packaging and source-aware resume patterns | public patterns do not include private Personal memory, proprietary retrieval/ranking or hosted-chat capture claims |
| Long-running AI work becomes fragile, non-replayable or dependent on one provider | provider-neutral W_Flow contracts, resumable state, replay/idempotency and explicit local-blocker/authority semantics | W_Flow is not PAI's private Program/Claim/Farm control plane |
| Green tests are mistaken for proof that the right thing shipped | evidence-first assurance, PASS/LIVE/DONE separation, release-scope integrity and reachable-path policy checks | no certification, warranty, formal proof or zero-defect claim |
| AI-generated tests miss failure modes or produce unreproducible failures | deterministic SimLab scenarios, properties, synthetic fixtures, known-bad mutants and reproducible counterexamples | real OS/service/provider claims still require real canary evidence |
| Public releases drift beyond their authorized scope | provenance, release contracts, bounded publication classes and independent integrity checks | private/core/customer/security-sensitive material remains excluded |
| Teams want reusable AI engineering patterns without surrendering their private implementation | small Skills, workflows, Packs and package surfaces with explicit licenses and protected boundaries | the public foundation is not a source dump of `pai-core-private` |

## What PAI is building

PAI is converging around three public capability families:

- **Context & Continuity**: deterministic, bounded context packaging and source-aware resume patterns.
- **W_Flow**: reusable, resumable work-loop specifications and verification-friendly workflows.
- **Assurance & SimLab**: evidence-first verification patterns, deterministic test surfaces, synthetic labs, and reproducible failure analysis.

The public repository also hosts reusable **Skills, Tools, Packs, Labs, examples, and documentation** when they pass the public release boundary.

## Start here

- [`capabilities/context/README.md`](capabilities/context/README.md) — Context Kit 0.1.0, the first executable Open Foundation package.
- [`docs/QUICKSTART.md`](docs/QUICKSTART.md) — use the current Open Foundation in a few bounded steps.
- [`PORTFOLIO.md`](PORTFOLIO.md) — current public capability and portfolio map.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how public PAI relates to the protected private core.
- [`docs/PUBLIC_RELEASE_POLICY.md`](docs/PUBLIC_RELEASE_POLICY.md) — what is allowed to become public and how releases are qualified.
- [`docs/BENCHMARKS.md`](docs/BENCHMARKS.md) — current verification baselines and the benchmark gates required for exact public package bytes.
- [`LICENSE.md`](LICENSE.md) — Apache-2.0 software scope, CC-BY-4.0 public-content scope, trademark and protected-core boundaries.
- [`workflows/community-assurance-baseline.md`](workflows/community-assurance-baseline.md) — a reusable evidence-first assurance workflow.
- [`runbooks/source-only-resume.md`](runbooks/source-only-resume.md) — resume durable work without treating chat memory as authority.
- [`skills/deterministic-source-resolution.md`](skills/deterministic-source-resolution.md) — resolve durable sources without promoting stale hints into truth.
- [`skills/reachable-path-policy-integrity.md`](skills/reachable-path-policy-integrity.md) — verify that every route to a protected effect enforces the same invariant.
- [`skills/release-scope-integrity.md`](skills/release-scope-integrity.md) — verify that a release contains only the change it was supposed to contain.

## Public repository layout

```text
PAI/
├── foundation/      # public contracts, standards and conformance guidance
├── capabilities/    # qualified capability families
├── skills/          # reusable bounded skill recipes
├── wflows/          # reusable work-loop specifications
├── tools/           # public tools when separately licensed and release-qualified
├── packs/           # versioned distributions and examples
├── labs/            # synthetic fixtures and experiments with explicit maturity
├── products/        # public product-facing surfaces
├── workflows/       # generic operational workflows
├── runbooks/        # bounded operational guides
├── examples/        # independently usable examples
└── docs/            # architecture, release and trust documentation
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

The public licensing strategy is now selected:

- **Apache-2.0** for original PAI software intentionally published as reusable software;
- **CC BY 4.0** for original public non-code material such as documentation, Skills, workflows/W_Flows, patterns and synthetic educational content;
- **trademarks reserved**;
- third-party/migrated assets keep their exact upstream terms.

See [`LICENSE.md`](LICENSE.md) for scope and exclusions. A future change to this licensing strategy remains a founder/legal gate.

## Reliability evidence archive

Earlier public reliability work remains available at [`tantanpq/pai-reliability-evidence`](https://github.com/tantanpq/pai-reliability-evidence).

That repository is treated as a linked evidence/provenance archive while reusable material is progressively curated into this repository. Existing evidence and failure history are preserved rather than silently rewritten.

## Current maturity

This repository is in **public foundation bootstrap with its first executable package released**. The goal is not to publish everything PAI has ever built. The goal is to publish a small set of complete, useful, independently understandable capability surfaces and then expand only from verified results.

**Context Kit 0.1.0** is the first public executable Open Foundation package. Its recovered compiler/test source hashes are pinned; PR and post-merge `main` both passed 6/6 tests, a 1,000-replay deterministic benchmark, `npm pack`, clean-consumer installation/use, and public-integrity checks. The current distribution is the source package in this repository; no npm-registry publication is claimed.

W_Flow and the bounded SimLab Pilot Core remain at exact-package qualification gates. Their verified internal/source baselines are 13/13 plus independent frozen-byte QA for W_Flow and 36/36 compatibility + 73/73 verification checks with known-bad mutant rejection for SimLab Core. Those baselines remain evidence inputs, not substitutes for exact public-package verification.

## Claim boundary

PAI is not a certification authority, security warranty, uptime guarantee, or claim of zero defects.

Its public engineering goal is more concrete: **make useful AI work resumable, reusable, and easier to verify against actual evidence.**
