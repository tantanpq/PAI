# Case Study: Isolating Tests from Mutable Runtime Policy

Status: public foundation case study; historical source narrative; executable evidence is not included.

## Situation
A test suite depended on mutable runtime policy. That made ambient configuration drift capable of producing failures that looked like production regressions even when production bytes had not changed.

## Intervention
The proposed pattern moves the test dependency to an explicit candidate-owned fixture. A bounded repair should change test evidence and metadata only; unchanged production and launcher bytes and disabled activation require separate verification.

## Evidence boundary

The source describes fixture isolation. Its original suites, tree manifests, production hashes and independent QA logs are not included or reproduced here, so this repository claims no audited outcome for that repair.

## Reusable lesson
If a test is meant to verify code behavior, mutable live policy should not silently become part of its input. Give the test an explicit fixture, include that fixture in candidate identity, and verify unchanged production surfaces separately.

## Claim boundary
This illustrates a fixture-isolation pattern. It does not prove production readiness, fleet-wide reliability, customer ROI, or that every configuration-dependent test should be fixture-driven.

## Provenance
Curated from `tantanpq/pai-reliability-evidence` under CC BY 4.0. Original source: `case-studies/why-live-policy-does-not-belong-in-tests.md`; source evidence: `evidence/2026-09-02-test-environment-isolation.md`.
