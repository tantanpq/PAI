# Runbook Checklist: Test Isolation from Mutable Policy

Use this when a test failure may be caused by ambient runtime configuration rather than the candidate itself.

## Before changing the test
- Identify the exact mutable policy or environment value the test currently reads.
- Confirm whether that input is part of the behavior under test or merely ambient setup.
- Record hashes for production, launcher, and other protected surfaces.
- Preserve the failing evidence before making the isolation change.

## Build the isolated test
- Create an explicit candidate-owned fixture containing only values required by the scenario.
- Make fixture selection deterministic and visible in the test setup.
- Keep production code unchanged unless the product behavior itself is the defect.
- Include fixture and test bytes in the candidate manifest or equivalent identity.

## Verify
- Run the focused suite first, then the full relevant suite.
- Replay the candidate/tree manifest and compare the expected content identity.
- Re-hash protected production surfaces and require exact equality when no production change was intended.
- Confirm the test does not read current live policy during execution.
- Confirm no activation, pointer, credential, or live runtime mutation occurred.

## Report
State what passed, what remained byte-identical, and what was intentionally changed. Report only candidate-scope evidence; do not promote test isolation into a production or reliability certification.

## Provenance
Curated from `tantanpq/pai-reliability-evidence` under CC BY 4.0. Original source: `patterns/test-environment-isolation-checklist.md`; independent QA evidence: `evidence/2026-09-02-test-environment-isolation.md`.
