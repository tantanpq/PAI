# Provenance and Claim Discipline

Public PAI material is derived from verified PAI Results/HANDOFF evidence or from public-safe reusable abstractions created from that evidence.

The public repository is not a mirror of the complete private system.

## Verification standard

Only terminal outcomes that were actually observed as completed and passing may be represented as completed evidence.

Planned, queued, materialized, running, candidate, or partially verified work must not be rewritten as terminal `DONE` because it appears in a public document.

Public workflow and Skill documents may describe a general method without claiming that every future implementation of the method has already passed PAI verification.

## Sanitization

Before publication, material is reduced to the reusable lesson and bounded claim. Public versions exclude, unless an explicit bounded disclosure decision says otherwise:

- credentials, secrets and trust-root material;
- private PAI source and internal implementation details;
- private host identities and filesystem paths;
- sensitive or unnecessary raw logs;
- private task IDs, fingerprints or topology that add no public value;
- customer/tenant/company source, traces, incidents, evidence or data;
- protected evaluation corpora and deep proprietary failure intelligence;
- third-party material without clear rights to publish.

Synthetic examples are preferred when they teach the same lesson without exposing private reality.

## Claim discipline

A passing test is reported as a passing test. It is not promoted into a claim of production readiness, security certification, universal correctness, high availability, complete safety or zero defects unless separate evidence explicitly supports that claim.

`UNKNOWN` is preserved when evidence does not establish a fact.

Failure history is preserved. A later PASS supersedes an earlier failure only when the later evidence actually closes the same acceptance boundary.

## Open Foundation versus Protected Core

Public candidates include scrubbed and rights-cleared evidence summaries, checklists, Skill recipes, workflow templates, synthetic demos, schemas, examples, standards mappings and bounded case studies.

Protected material includes private continuity/authority internals, proprietary implementation, deep optimizations, protected evaluation corpora, private/shared failure-intelligence datasets, customer-private evidence and private/sovereign execution internals unless a later bounded decision publishes part of them.

## Licensing boundary

Earlier documentation migrated from `pai-reliability-evidence` retains the provenance and licensing terms of its original public source where applicable.

Publication here does not silently grant a software license to unpublished/private PAI machinery. Public software families require an explicit approved software license before they are represented as openly reusable software packages.

## Commercial/private assurance

The Open Foundation should remain useful without payment.

A full PAI Assurance engagement may use private execution, customer-specific reconstruction, protected evaluation/failure intelligence, repeated verification or private/sovereign environments under separate authorization and commercial terms. Public documentation does not itself create a service contract, certification, warranty, pricing commitment or availability claim.
