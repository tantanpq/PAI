# Qualification Receipt — Failure Signal Demo R1

Qualification: `AUTO_RELEASE`
Asset: `pai.assurance.failure-signal-is-not-failure-cause`
Target path: `demos/failure-signal-is-not-failure-cause.md`

## Provenance and rights

- Source repository: `tantanpq/pai-reliability-evidence`
- Source repository head inspected: `524ab22b3ef648ddb23912da4c5b78b648d66b51`
- Original publication commit: `71128019c96969b6565b543ad4b2f7e75dbca8d3`
- Source path: `demos/failure-signal-is-not-failure-cause.md`
- Source Git blob: `246171a3cb66ea6b8f761245a9a6a358b0796928`
- Candidate Git blob: `246171a3cb66ea6b8f761245a9a6a358b0796928`
- Migration fidelity: byte-identical
- License: CC BY 4.0 public non-code source terms

## AUTO_RELEASE basis

This is an already-public synthetic non-code demo migrated byte-identically into the canonical PAI public repository. The current release policy permits already-public documentation and synthetic examples after deterministic safety checks, and the public demo family already has bounded AUTO_RELEASE canaries. This migration adds no executable code, product-defining contract, live effect, new license decision, or broader claim.

## Boundary review

- executable software: none
- new software/content license decision: none
- Protected Core/private source: none
- customer/company/private data: none
- credentials or trust roots: none
- private infrastructure/topology: none
- protected evaluator/failure corpus or repair-selection intelligence: none
- production mutation/deployment authority: none
- claim boundary: demonstrates that invocation/transport failure and candidate behavior are separate evidence facts; it does not certify a runtime, transport, validator, or production system

## D0 change contract

- Intent: curate one useful public-safe evidence demo into the primary PAI repository.
- Target: one byte-identical demo plus catalog registration and this receipt.
- Test: complete PR delta must be exactly these three files; `public-integrity` must pass on the exact PR head and again after merge.
- Rollback: revert the single merge commit; the legacy public source remains unchanged and authoritative for provenance history.

## Candidate release contract

The intended candidate delta is exactly three files: this qualification receipt, the byte-identical migrated demo, and `catalog/public-assets.yaml` revision 13. Merge is permitted only if the complete PR delta matches that scope and the exact PR head passes `public-integrity`. Final public release identity is the GitHub merge commit and must be verified by post-merge main readback/CI before continuity reconciliation.
