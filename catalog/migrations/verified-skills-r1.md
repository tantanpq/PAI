# Migration Receipt — Verified Skills R1

Status: `CANDIDATE / AUTO_RELEASE_AFTER_IQA`

Source repository: `tantanpq/pai-reliability-evidence`
Target repository: `tantanpq/PAI`
Source terms: CC BY 4.0 public source terms
Effect boundary: public non-code migration only; no executable software, credentials, private source, trust roots, customer data, release authority, or Protected Core material.

| Asset | Source path | Source Git blob | Target path | Candidate Git blob |
| --- | --- | --- | --- | --- |
| Deterministic Source Resolution | `skills/deterministic-source-resolution.md` | `51ad561fbb504279525845a6afeed49ad1248748` | `skills/deterministic-source-resolution.md` | `c84c22f49565c665ed74a08f8f973f9f9fac6c24` |
| Deterministic Source Resolution Contract | `patterns/deterministic-source-resolution-contract.md` | `e87ff1a246ef53207c90d546f507f6f65e99acf4` | `patterns/deterministic-source-resolution-contract.md` | `2604ff4601efe3b5fbeea0d5753bfb7a8244ee16` |
| Reachable-Path Policy Integrity Review | `skills/reachable-path-policy-integrity.md` | `34a9c40e1ea092814241e199885039df631ba260` | `skills/reachable-path-policy-integrity.md` | `1c568a9c853944714cddf43c29af736d671fdfec` |
| Reachable-Path Policy Integrity Checklist | `patterns/reachable-path-policy-integrity-checklist.md` | `611f6b49b9a48aab8c9fdd79882252b85df561af` | `patterns/reachable-path-policy-integrity-checklist.md` | `66b6055d9466e4a860b11dc8ba4e5da36862a8b5` |

## Qualification checks

- Source paths were fetched directly from the public legacy repository.
- Candidate paths are new files and preserve the source claim boundary; the only intentional addition is the PAI provenance footer.
- Catalog entries pin source repository/path and CC BY 4.0 terms.
- Cross-links between each skill and its longer pattern resolve inside the candidate tree.
- Public integrity CI must pass on the exact PR revision before merge.
- Complete PR delta must contain only the four migrated assets, this receipt, catalog/portfolio/README synchronization, and no unrelated file changes.

## Claim boundary

This receipt proves the bounded migration identity and source/license lineage of this wave. It does not upgrade the underlying patterns into software, certification, security guarantees, or production readiness.
