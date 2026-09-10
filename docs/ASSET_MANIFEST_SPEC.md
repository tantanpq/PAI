# Public Asset Manifest Contract

Every material public PAI asset should have enough identity and evidence metadata to support update, compatibility, provenance and rollback without turning GitHub into an operational control plane.

## Recommended fields

```yaml
schema: pai-public-asset/v1
asset_id: pai.<family>.<name>
asset_class: skill | workflow | wflow | pattern | runbook | lab | pack | capability | case-study | release
product_family: foundation | context | workflow | assurance | personal | other
version: 0.0.0
maturity: EXPERIMENTAL | PUBLIC_FOUNDATION | PACKAGE_CANDIDATE | RELEASED | SUPPORTED_PRODUCT
source_provenance:
  source_class: verified-result | public-archive | public-source | synthetic
  refs: []
claim_boundary: ""
unsupported_claims: []
compatibility:
  requires: []
  breaks: []
tests:
  positive: []
  negative: []
  clean_consumer: null
independent_qa:
  required: false
  status: NOT_REQUIRED | PENDING | PASS | FAIL
public_checks:
  privacy: PASS | BLOCKED | UNKNOWN
  secrets: PASS | BLOCKED | UNKNOWN
  rights: PASS | BLOCKED | UNKNOWN
  moat: PASS | BLOCKED | UNKNOWN
release_class: AUTO_RELEASE | AUTO_RELEASE_AFTER_IQA | HUMAN_GATE | REJECT_AUTO
supersedes: null
rollback_or_revoke: ""
```

## Identity rules

- `asset_id` is stable across compatible versions.
- `version` changes when the public contract changes, not when an internal private implementation changes.
- exact Git commit/tree identity remains the source provenance for a released revision.
- an aggregate PAI release may pin multiple component versions without forcing every component to share one version number.

## Version intent

- `PATCH`: backward-compatible repair/documentation/fixture update with no material API/state/lifecycle/permission/dependency/license change.
- `MINOR`: backward-compatible new public capability or materially expanded supported behavior.
- `MAJOR`: breaking contract, migration-requiring state change, incompatible behavior, or product-defining boundary change.

Version classification never overrides the publication authority class.

## Evidence rule

The manifest records evidence; it does not create truth or authority. A `PASS` field is valid only when a corresponding result/readback exists. Unknown or unavailable evidence remains `UNKNOWN`/`PENDING`.

## Protected boundary

The manifest must not include secret/private fingerprints, credentials, customer identifiers, protected internal source references, or unnecessary runtime topology merely for traceability. Internal provenance may be represented by a sanitized public reference when the private reference itself would leak protected information.
