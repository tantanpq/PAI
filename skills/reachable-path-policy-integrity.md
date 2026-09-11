# Skill — Reachable-Path Policy Integrity Review

**Use when:** multiple routes can reach the same protected action and you need evidence that every route enforces the same safety/authority invariant.

## Inputs

- one explicit policy invariant;
- protected effect;
- list of documented and discovered reachable routes;
- positive route fixtures;
- stale/degraded/mismatched negative fixtures;
- designated policy/verifier owner.

## Procedure

1. Express the invariant independently from route code.
2. Enumerate every reachable path to the protected effect, including special, recovery, legacy, retry, and marked routes.
3. Trace each route to the actual admission predicate.
4. Verify equivalent freshness, receipt, identity, fence/release, and healthy-state requirements where applicable.
5. Confirm signer/authority construction is bound to one accountable owner rather than duplicated across paths.
6. Run one positive test and at least one negative falsifier per route.
7. Treat common-path success as evidence for that path only.
8. Fail closed on any route that cannot prove equivalent enforcement.

## Output

```text
POLICY_INVARIANT:
PROTECTED_EFFECT:
ROUTES_ENUMERATED:
ROUTE_PARITY_RESULTS:
NEGATIVE_FALSIFIERS:
DUPLICATE_OWNER_LOGIC:
BYPASS_DETECTED:
SMALLEST_BLOCKED_ROUTE:
UNSUPPORTED_CLAIMS:
```

For the longer checklist, see [`../patterns/reachable-path-policy-integrity-checklist.md`](../patterns/reachable-path-policy-integrity-checklist.md).

## Claim boundary

This review supports bounded route-parity evidence. It does not certify universal authorization safety, security, or production readiness.

## Provenance

Curated from the earlier public `pai-reliability-evidence` repository. Original public source: `skills/reachable-path-policy-integrity.md` under CC BY 4.0 source terms.
