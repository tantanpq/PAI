# Skill: Release-Scope Integrity Review

**Use when:** a release candidate passes focused tests but you need to verify that the complete candidate contains only the file-level changes that were actually authorized.

## Inputs

- exact baseline tree identity;
- exact candidate tree identity;
- independently represented authorized delta;
- current source/pointer pin status where relevant;
- required focused test results.

## Procedure

1. Pin and fingerprint the exact baseline.
2. Recompute the candidate tree from actual entries/bytes.
3. Compute complete `ADDED`, `CHANGED`, and `REMOVED` sets.
4. Compare every delta entry against the separately authorized change set.
5. Check source/pointer freshness so baseline drift is not confused with candidate-scope failure.
6. Record focused tests as a separate evidence class.
7. Fail closed on any unauthorized addition, change, or removal.
8. Emit a scope receipt; do not activate or deploy from the review itself.

## Output

A bounded release-scope verdict containing:

```text
SOURCE_PIN_STATUS
AUTHORIZED_DELTA
UNAUTHORIZED_ADDED
UNAUTHORIZED_CHANGED
UNAUTHORIZED_REMOVED
FOCUSED_TEST_STATUS
ACTIVATION_ALLOWED
UNSUPPORTED_CLAIMS
```

## Core rule

> Passing tests do not authorize unreviewed composition changes.

## Claim boundary

This skill checks release composition against a declared authorization boundary. It does not certify security, correctness, or production readiness.

## Provenance

Curated from the earlier public `pai-reliability-evidence` repository. Original public source: `skills/release-scope-integrity.md`.
