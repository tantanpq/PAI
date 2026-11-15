# A Canary Pass Is Not a Stable Owner

## Situation

A cutover can look healthy at the instant a canary succeeds while still leaving an ownership race behind. The dangerous shortcut is to treat the first green effect as proof that the old owner is gone and the new owner is durable.

## Verification pattern

A bounded verification sequence should:

1. promote the intended owner through the existing governed path;
2. verify the previous competing owner remains disabled;
3. repeatedly observe health and ownership after promotion;
4. keep the soak bounded and count every required observation;
5. check that active work is not masking a concurrent writer/owner;
6. rerun targeted regressions after the effect;
7. independently re-read the exact runtime evidence;
8. compare the expected bytes through the relevant candidate, winner, and consumer access paths.

## Evidence boundary

This is an engineering narrative. The original runtime, soak observations, regression suite and independent QA logs are not included or reproduced here. No audited ownership-continuity result is claimed by this repository.

## Synthetic walkthrough

A reusable demo can model two owners, `owner_old` and `owner_new`:

- Step 1: run a canary under `owner_new`; it passes.
- Step 2: deliberately leave `owner_old` eligible; the soak gate must reject the cutover even though the canary was green.
- Step 3: disable `owner_old`, repeat bounded observations, and require every observation to resolve to `owner_new`.
- Step 4: introduce a read-path mismatch; the byte-consistency check must fail.
- Step 5: restore consistency and rerun targeted regressions.

The lesson is simple: **a green canary proves an event; a soak can provide evidence about continuity.**

## Limits

This case does not claim long-term availability, HA certification, correctness for every scheduler/host/release, or production certification. It illustrates checks to request for ownership continuity; it supplies no executable proof.

The public version contains no private source, credential, host identity, internal path, raw operational log, or private provenance fingerprint.
