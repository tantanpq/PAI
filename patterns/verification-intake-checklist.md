# Verification Intake Checklist

Use this before a candidate is allowed to make a stronger reliability, safety, or readiness claim.

## Ownership and scope

- [ ] Exact change scope is named.
- [ ] Existing owner is identified before any new implementation is admitted.
- [ ] Reuse was checked before `BUILD_GAP`.
- [ ] A passing candidate does not create a duplicate policy, writer, signer, queue, planner, scheduler, database, or control plane.

## Evidence selection

- [ ] Risk class is bounded and justified.
- [ ] Minimum sufficient verification modes are selected.
- [ ] Source and evidence identities are frozen or otherwise integrity-bound.
- [ ] Known-good fixtures pass.
- [ ] Known-bad mutants fail.
- [ ] Missing, stale, contradictory, or unsupported evidence remains `UNKNOWN` or `INCOMPLETE`.

## Independence

- [ ] Material claims receive independent QA separate from the builder.
- [ ] Real OS/service/network/provider claims require an appropriate bounded real canary.
- [ ] Verification output cannot itself promote, deploy, publish, create claims, or write production state.

## Architecture integrity

- [ ] Ownership/provenance invariants are tested alongside behavior.
- [ ] Duplicate owner or policy implementations are rejected even if functional tests pass.
- [ ] Rollback or discard path is explicit.
- [ ] Canonical owner readback is captured after rejection or rollback.

## Acceptance sentence

> The candidate passed the checks required for its bounded claim, did not create a second owner, and gained no promotion authority from verification alone.

## Provenance

Curated from the earlier public `pai-reliability-evidence` repository. Original public source: `patterns/verification-intake-checklist.md`.
