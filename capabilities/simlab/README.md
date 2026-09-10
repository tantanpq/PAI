# SimLab Core

**Status:** `PACKAGE_CANDIDATE`

SimLab Core is the public-facing direction for deterministic verification, synthetic scenarios, property checks, counterexamples and reproducible evidence.

## Problem

AI systems can generate plausible explanations of why a change should work. That is not the same thing as proving what the candidate actually does.

SimLab separates hypothesis generation from deterministic judgment and preserves `PASS`, `FAIL` and `UNKNOWN` as distinct evidence states.

## Intended public surface

- local deterministic runner;
- scenario/property/result contracts;
- synthetic fixtures;
- positive and known-bad cases;
- reproducible/minimized failure examples;
- public SimPacks;
- claim-boundary and unsupported-claim reporting;
- CLI/SDK packaging after license and clean-consumer gates.

## Available now

- [`Release-Scope Integrity Review`](../../skills/release-scope-integrity.md)
- [`Verification Intake Checklist`](../../patterns/verification-intake-checklist.md)
- [`Green Tests, Wrong Release`](../../case-studies/green-tests-wrong-release.md)

These demonstrate the evidence discipline around the future runner without publishing protected evaluator internals.

## What remains protected

Advanced evaluators, protected evaluation corpora, deep accumulated failure intelligence, proprietary repair selection, customer-specific evidence and private/sovereign runner internals remain outside the public package.

## Claim boundary

A future SimLab Core release will not imply formal proof, universal production readiness, security certification or zero defects. Claims about real services, operating systems or providers require bounded real canary evidence.

Track packaging in [issue #3](https://github.com/tantanpq/PAI/issues/3).
