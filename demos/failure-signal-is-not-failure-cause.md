# Synthetic Demo: Failure Signal Is Not Failure Cause

## Fixture A — invocation failure

- Create a tiny deterministic validator that passes on a valid fixture.
- Route verification through a deliberately invalid invocation so the validator never runs.
- Record that event as `QA_INVOCATION_FAILURE`, not `CANDIDATE_FAIL`.
- Rerun the same frozen validator and fixture through a valid invocation.
- Confirm PASS and `candidate_mutation = false`.

## Fixture B — transport failure

- Freeze a valid package with a deterministic self-test.
- Simulate an acknowledged submission followed by a transport-level error.
- Preserve the attempt as not-done/transport-failed.
- Run the frozen package independently and verify its self-test.
- Keep transport failure and candidate PASS as separate facts.

## Expected teaching point

A status value is evidence about the boundary that produced it. Verification quality improves when execution transport, harness behavior, candidate behavior, and lifecycle projection are represented separately.

No network, credentials, live hosts, private source, or production mutation are required for this demo.
