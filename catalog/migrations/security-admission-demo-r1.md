# Qualification Receipt — Security Admission Demo R1

Qualification: `AUTO_RELEASE`
Asset: `pai.assurance.security-evidence-before-software-admission`
Target path: `demos/security-evidence-before-software-admission.md`

## Provenance and rights

- Source repository: `tantanpq/pai-reliability-evidence`
- Source repository head inspected: `524ab22b3ef648ddb23912da4c5b78b648d66b51`
- Original publication commit: `862dd924ab868bce963d18d2470b7399df9da46b`
- Source path: `demos/security-evidence-before-software-admission.md`
- Source Git blob: `6d0cc37d6dacda14f3a410a1a891465414c8f55e`
- Candidate Git blob: `6d0cc37d6dacda14f3a410a1a891465414c8f55e`
- Migration fidelity: byte-identical
- License: CC BY 4.0 public non-code source terms

## AUTO_RELEASE basis

This is an already-public synthetic non-code demo migrated into the canonical PAI public repository. The current release policy permits documentation and synthetic examples derived only from public-safe sources after deterministic safety checks. The source itself records 7/7 bounded focused behavior checks, including negative cases, but this release does not upgrade that evidence into a security certification.

## Boundary review

- executable software: none
- new software/content license decision: none
- Protected Core/private source: none
- customer/company/private data: none
- credentials or trust roots: none
- private infrastructure/topology: none
- protected evaluator/failure corpus or repair-selection intelligence: none
- production mutation/deployment authority: none
- claim boundary: `ELIGIBLE_FOR_NEXT_GATE` remains distinct from `RELEASED`; no universal vulnerability policy, certification, or production-readiness claim

## Candidate release contract

The intended candidate delta is exactly three files: this qualification receipt, the byte-identical migrated demo, and `catalog/public-assets.yaml` revision 11. Merge is permitted only if the complete PR delta matches that scope and the exact PR head passes `public-integrity`. Final public release identity is the GitHub merge commit and must be verified by post-merge main readback/CI before continuity reconciliation.
