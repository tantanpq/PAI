# Migration Receipt — Test-Environment Isolation R1

Status: `CANDIDATE / AUTO_RELEASE_AFTER_IQA`

Source repository: `tantanpq/pai-reliability-evidence`
Source commit: `74aaed779ddee33ef6da4968a9fb9ebd8153b3a6`
Source license record: `LICENSE.md` blob `2322dd8bedd275c515b9ad63b547a18f4db2a4d2`
Source terms: CC BY 4.0 public non-code content
Independent QA evidence: `evidence/2026-09-02-test-environment-isolation.md` blob `b065f84e9c27ad954cc236bb59b4130f2c33e7e6`

## Asset identity

| Asset | Source blob | Target blob |
| --- | --- | --- |
| `case-studies/why-live-policy-does-not-belong-in-tests.md` | `6c52b1d527f3ed1c75613c0ed2946435676dc8a8` | `7a420f2072d4b2e93fdf713e00b7811b7de5b045` |
| `patterns/test-environment-isolation-checklist.md` | `da91583506e8afa63ff217aa9c3e81db0a0b3d22` | `af6cdaec5ed0cf34d657ec6f23bafb6d1b7da211` |

## Qualification evidence

The source evidence reports independent verification of the bounded candidate:

- focused suite: 31/31 PASS;
- full suite: 167/167 PASS, 0 failures, 0 skips;
- deterministic tree-manifest replay: expected 219-entry identity matched;
- protected production, launcher and history bytes: unchanged;
- the test consumed a candidate-owned fixture rather than mutable live policy;
- activation remained disabled and independent QA observed no live mutation.

The migration changes no executable or protected production code. The case-study status line is normalized from `private-staged portfolio draft` to `public foundation case study` because the exact source is already publicly published under CC BY 4.0; both migrated files add explicit provenance footers. The technical claims and their limitations are otherwise preserved.

## Public boundary

- no credentials, secrets, customer/company/private data or trust roots;
- no internal host/path/topology disclosure;
- no Protected Core source;
- no protected evaluator, failure corpus or repair-selection intelligence;
- no production-readiness, fleet-wide reliability, ROI, certification or universal-test-design claim;
- no executable software publication or license change;
- the archive remains the provenance source rather than being silently rewritten.

## Candidate delta contract

Expected PR delta is exactly five files:

1. the case study;
2. the checklist;
3. this migration receipt;
4. `catalog/public-assets.yaml` revision 10;
5. `PORTFOLIO.md` synchronization.

Merge requires exact-delta readback and successful `public-integrity` CI on the PR head. Post-merge `main` readback is required before the migration is recorded as released.
