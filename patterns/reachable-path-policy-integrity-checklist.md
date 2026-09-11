# Reachable-Path Policy Integrity Checklist

Use this checklist when multiple execution routes can reach the same protected effect and the policy must be enforced consistently across all of them.

This is a verification pattern. It does not grant signing, repair, deployment, activation, or publication authority.

## 1. Name the invariant once

Write the protected-effect rule independently from any route implementation.

Example shape:

```text
CURRENT AUTHORITY REQUIRED
→ REFRESH WHEN NEEDED
→ VERIFY RECEIPT / IDENTITY / FENCE / RELEASE
→ RE-READ SIGNED HEALTHY STATE
→ ONLY THEN PERMIT THE EFFECT
```

- [ ] The invariant is explicit.
- [ ] One accountable policy/verifier owner is identified.
- [ ] Route-specific code is not allowed to silently weaken the invariant.

## 2. Enumerate every reachable path

- [ ] Ordinary/default route.
- [ ] Special/marked workload route.
- [ ] Recovery or fallback route.
- [ ] Compatibility/legacy route.
- [ ] Retry/resume route.
- [ ] Any alternate entrypoint that can reach the protected effect.

Do not stop at documented paths. Verify actual reachability where possible.

## 3. Check equivalent enforcement

For each route:

- [ ] freshness requirement is equivalent;
- [ ] receipt verification is equivalent;
- [ ] identity/holder/fence/release checks are equivalent where applicable;
- [ ] signed healthy-state readback occurs before the effect;
- [ ] degraded or stale state cannot contribute usable eligibility;
- [ ] the path delegates to the same governed owner instead of duplicating signer-capable logic.

## 4. Use both positive tests and falsifiers

For every reachable route:

- [ ] one valid state can pass;
- [ ] stale state is rejected;
- [ ] degraded state is rejected;
- [ ] malformed or mismatched receipt/state is rejected where applicable;
- [ ] a negative falsifier proves the weaker state cannot reach the effect.

A green common-path suite is not whole-surface evidence.

## 5. Fail locally and closed

- [ ] A route that cannot prove equivalent enforcement is blocked locally.
- [ ] Independent unrelated routes/work are not globally stopped without a dependency.
- [ ] Verification does not mutate production or create a new authority service.

## Minimal receipt

```text
ROUTE_CLASS:
PROTECTED_EFFECT:
POLICY_OWNER:
PRE_STATE:
REFRESH_REQUIRED:
REFRESH_ATTEMPTED:
RECEIPT_VERIFIED:
POST_STATE_SIGNED_AND_HEALTHY:
SUBMIT_OR_EFFECT_ALLOWED:
BYPASS_DETECTED:
DUPLICATE_SIGNER_LOGIC_DETECTED:
NEGATIVE_FALSIFIER_RESULT:
UNSUPPORTED_CLAIMS:
```

## Claim boundary

Passing this checklist supports bounded route-parity evidence only. It does not establish universal authorization security, exploit resistance, or production readiness.

## Provenance

Curated from the earlier public `pai-reliability-evidence` repository. Original public source: `patterns/reachable-path-policy-integrity-checklist.md` under CC BY 4.0 source terms.
