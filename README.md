# PAI

**PAI is a user-owned intelligence and evidence-first engineering project focused on continuity, reusable work, and verifiable outcomes.**

This repository is the public PAI distribution surface. It is intentionally smaller than the complete private PAI system.

## What PAI is building

PAI is converging around three public capability families:

- **Context & Continuity**: deterministic, bounded context packaging and source-aware resume patterns.
- **W_Flow**: reusable, resumable work-loop specifications and verification-friendly workflows.
- **Assurance & SimLab**: evidence-first verification patterns, deterministic test surfaces, synthetic labs, and reproducible failure analysis.

The public repository also hosts reusable **Skills, Tools, Packs, Labs, examples, and documentation** when they pass the public release boundary.

## Start here

- [`docs/QUICKSTART.md`](docs/QUICKSTART.md) — use the current Open Foundation in a few bounded steps.
- [`PORTFOLIO.md`](PORTFOLIO.md) — current public capability and portfolio map.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how public PAI relates to the protected private core.
- [`docs/PUBLIC_RELEASE_POLICY.md`](docs/PUBLIC_RELEASE_POLICY.md) — what is allowed to become public and how releases are qualified.
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

## Reliability evidence archive

Earlier public reliability work remains available at [`tantanpq/pai-reliability-evidence`](https://github.com/tantanpq/pai-reliability-evidence).

That repository is treated as a linked evidence/provenance archive while reusable material is progressively curated into this repository. Existing evidence and failure history are preserved rather than silently rewritten.

## Current maturity

This repository is in **public foundation bootstrap**. The goal is not to publish everything PAI has ever built. The goal is to publish a small set of complete, useful, independently understandable capability surfaces and then expand only from verified results.

Context Kit, W_Flow, and the bounded SimLab Pilot Core have reached the internal technical disposition `READY_FOR_LICENSE`; that is not a public software release. Their executable package publication remains gated on an explicit software/content license decision and release qualification against the exact public package bytes.

## Claim boundary

PAI is not a certification authority, security warranty, uptime guarantee, or claim of zero defects.

Its public engineering goal is more concrete: **make useful AI work resumable, reusable, and easier to verify against actual evidence.**
