# Security Evidence Before Software Admission

This synthetic demo shows why software admission should evaluate evidence before promotion.

It does not deploy software and does not contain production credentials, private source, or private infrastructure details.

## Candidate matrix

| Candidate | Signature / signer | Source provenance | Blocking reachable vulnerability | Decision |
|---|---|---|---|---|
| A | valid and trusted | exact trusted source match | none | `ELIGIBLE_FOR_NEXT_GATE` |
| B | unsigned | otherwise plausible | none | `BLOCK` |
| C | valid but untrusted signer | exact trusted source match | none | `BLOCK` |
| D | valid and trusted | repository or revision mismatch | none | `BLOCK` |
| E | valid and trusted | exact trusted source match | reachable HIGH | `BLOCK` |
| F | valid and trusted | exact trusted source match | HIGH, proven unreachable | `WATCH` for that finding; continue other required gates |

`ELIGIBLE_FOR_NEXT_GATE` is intentionally not named `RELEASED`. Passing admission does not grant deployment authority.

## Minimal decision flow

```text
freeze candidate identity
        |
        v
verify required signature
        |
        v
verify signer is trusted
        |
        v
match provenance to trusted repository + source reference + revision
        |
        v
bind content-hashed software inventory
        |
        v
evaluate HIGH / CRITICAL findings for runtime reachability
        |
        +--> required evidence false or blocking reachable finding --> BLOCK
        |
        +--> evidence materially insufficient ----------------------> UNKNOWN
        |
        +--> non-blocking finding ---------------------------------> WATCH
        |
        +--> all required admission checks pass --------------------> ELIGIBLE_FOR_NEXT_GATE
```

## Pseudocode

```text
function admission(candidate, policy, evidence):
    if not evidence.identity_is_immutable:
        return UNKNOWN

    if policy.signature_required and not evidence.signature_valid:
        return BLOCK

    if not evidence.signer_is_trusted:
        return BLOCK

    if not evidence.provenance_matches_trusted_source:
        return BLOCK

    if not evidence.inventory_is_bound_to_candidate:
        return UNKNOWN

    if evidence.has_policy_blocking_reachable_vulnerability:
        return BLOCK

    if evidence.has_nonblocking_watch_findings:
        record_watch_findings()

    return ELIGIBLE_FOR_NEXT_GATE
```

## Non-mutation rule

The demo deliberately separates **verification** from **remediation**.

The admission step must not quietly:

- install or update dependencies;
- edit source or lockfiles;
- replace provenance;
- change signer policy;
- deploy the candidate;
- obtain new credentials to force a PASS.

A remediation is a new governed change and needs its own evidence.

## Verified behavior represented by this demo

The underlying bounded verification passed **7/7 focused tests** and included negative cases for unsigned candidates, untrusted signers, provenance/source mismatch, missing trusted repository evidence, and reachable high-severity vulnerabilities.

The public demo is an abstraction of that behavior. It is not production code, a universal vulnerability policy, or a security certification.
