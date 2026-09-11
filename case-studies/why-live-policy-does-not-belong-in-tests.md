# Case Study: Isolating Tests from Mutable Runtime Policy

Status: public foundation case study; claims are bounded to verified candidate evidence.

## Situation
A test suite depended on mutable runtime policy. That made ambient configuration drift capable of producing failures that looked like production regressions even when production bytes had not changed.

## Intervention
The candidate moved the test dependency to an explicit candidate-owned fixture. The repair was limited to test evidence and metadata; production and launcher bytes remained unchanged, and activation remained disabled.

## Verified outcome
- Focused remote-executor suite: 31/31 PASS.
- Full suite: 167/167 PASS, with no failures or skips.
- Deterministic tree-manifest replay matched the expected 219-entry tree identity.
- Before/after production, launcher, and history hashes were unchanged.
- Independent verification confirmed the test consumed the candidate-owned fixture rather than current live policy.

## Reusable lesson
If a test is meant to verify code behavior, mutable live policy should not silently become part of its input. Give the test an explicit fixture, include that fixture in candidate identity, and verify unchanged production surfaces separately.

## Claim boundary
This proves deterministic isolation for the verified candidate. It does not prove production readiness, fleet-wide reliability, customer ROI, or that every configuration-dependent test should be fixture-driven.

## Provenance
Curated from `tantanpq/pai-reliability-evidence` under CC BY 4.0. Original source: `case-studies/why-live-policy-does-not-belong-in-tests.md`; source evidence: `evidence/2026-09-02-test-environment-isolation.md`.
