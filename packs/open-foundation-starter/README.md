# Open Foundation Starter Pack

**Maturity:** `PUBLIC_FOUNDATION`

This starter pack is a curated reading/use path through public PAI material. It contains no private PAI runtime, executable agent, credential, authority component, or commercial product entitlement.

## Included public assets

1. [Source-Only Resume](../../runbooks/source-only-resume.md)
2. [Release-Scope Integrity Review](../../skills/release-scope-integrity.md)
3. [Community Assurance Baseline](../../workflows/community-assurance-baseline.md)
4. [Verification Intake Checklist](../../patterns/verification-intake-checklist.md)
5. [Green Tests, Wrong Release](../../case-studies/green-tests-wrong-release.md)
6. [Synthetic assurance intake](../../examples/assurance-intake.yaml)

## Suggested sequence

```text
RESUME FROM SOURCES
→ DEFINE A BOUNDED CLAIM
→ PIN THE BASELINE/CANDIDATE
→ RUN POSITIVE + NEGATIVE CHECKS
→ VERIFY COMPLETE RELEASE SCOPE
→ PRESERVE FAILURES/UNKNOWNS
→ PUBLISH ONLY WHAT THE EVIDENCE SUPPORTS
```

## Why this is a Pack

The Pack groups multiple independently useful assets into one bounded outcome: getting from uncertain context or a candidate change to a more defensible evidence receipt.

It does not create a new runtime, scheduler, planner, queue, database, or authority system.

## Executable source packages

The repository also contains [Context Kit](../../capabilities/context/README.md), [Context Economy](../../capabilities/context-economy/README.md), [W_Flow Core](../../capabilities/wflow/README.md), and the [SimLab Core synthetic pilot](../../capabilities/simlab/README.md). See their documentation for versions, tests and boundaries. The starter pack itself remains a reading path.
