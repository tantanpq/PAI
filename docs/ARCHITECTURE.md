# PAI Public Architecture

PAI uses one product identity with separate public and protected implementation boundaries.

## Topology

```text
ONE PAI
├── Public PAI repository
│   ├── Foundation
│   ├── Context & Continuity
│   ├── W_Flow
│   ├── Assurance & SimLab public surfaces
│   ├── Skills / Tools / Packs / Labs
│   └── Examples / Docs / Case Studies
└── Protected PAI core
    ├── private Mind / Chief implementation
    ├── proprietary continuity and routing intelligence
    ├── authority / execution internals
    ├── protected evaluation and failure intelligence
    ├── customer/private evidence
    └── private or sovereign execution internals
```

The public repository is a distribution and collaboration surface. It is not a mirror of the private implementation.

## Naming model

PAI uses the structural hierarchy:

`PORTFOLIO → PRODUCT → DOMAIN → BRANCH → TEAM → ROLE/JD → SKILL → TOOL → EXECUTOR`

The following are cross-cutting semantics rather than hierarchy levels:

- **CAPABILITY**: a demonstrated ability with evidence.
- **MODULE**: a software implementation component.
- **PACK**: a versioned/testable distribution container.
- **LOOP**: a feedback or outcome loop.

## Product and execution separation

Execution infrastructure is not treated as a product merely because it exists.

Public product value should surface as user-meaningful capabilities such as continuity, reusable workflows, verification, labs, packs, and supported product experiences.

## Source and release identity

Public releases should preserve three identities where applicable:

1. exact Git source identity;
2. component semantic version;
3. aggregate PAI release manifest containing a tested compatible component set.

A component can evolve independently while an aggregate PAI release pins a known-compatible set.

## Design rules

- Preserve useful known-good paths.
- Candidate is not LIVE.
- Repair root seams rather than accumulating retry layers.
- Keep failures local to their dependency cone.
- One writer owns a mutable scope.
- Reuse before building a replacement.
- Public claims never exceed verified evidence.
- Protected implementation stays private unless a bounded disclosure decision explicitly qualifies it.
