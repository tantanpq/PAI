# Green Tests, Wrong Release

## Situation

A release candidate contained the intended narrow change and passed its focused behavioral tests. If the release decision had stopped there, the candidate could have been treated as ready for the next governed stage.

Independent QA asked a different question:

> Does the complete candidate tree differ from the selected baseline **only** where change was actually authorized?

## Approach

QA independently reconstructed the exact baseline and candidate trees, computed the complete added/changed/removed sets, and compared those sets with the separately qualified change boundary.

It also checked current source-selection pins so a stale or mismatched baseline could not casually explain away the discrepancy.

The focused test result and the release-scope result were kept separate.

## Result

The focused tests passed. Source-selection pins were consistent with the recorded selection. Complete-tree comparison nevertheless found material omissions outside the authorized delta.

The candidate was rejected for governed activation. QA made no live mutation.

## Why this matters

A green suite can answer:

> “Did the behaviors we tested pass?”

It cannot, by itself, answer:

> “Are these exactly the bytes and file-level changes we were authorized to release?”

Conflating those two questions allows accidental packaging drift, missing files, or unrelated changes to borrow credibility from unrelated test success.

## Reusable lesson

A safer release decision separates at least three evidence classes:

```text
BEHAVIOR EVIDENCE
+ COMPLETE COMPOSITION EVIDENCE
+ AUTHORIZED CHANGE-SCOPE EVIDENCE
→ NEXT GOVERNED RELEASE GATE
```

If the complete candidate delta exceeds the authorized scope, fail closed even when focused tests are green.

## Claim boundary

This case study demonstrates bounded release-scope rejection from one verified QA result. It does not prove universal supply-chain security, formal verification, production readiness, or the significance of every omitted file.

The public version intentionally excludes private fingerprints, paths, file counts, source code, runtime details, and internal identifiers.

## Provenance

Curated from the earlier public `pai-reliability-evidence` repository. Original public source: `case-studies/green-tests-wrong-release.md`.
