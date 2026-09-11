# W_Flow Core 0.1.0 release receipt

## Identity

- package: `pai-wflow-core`
- version: `0.1.0`
- public repository: `tantanpq/PAI`
- first package merge: PR #17
- first package merge commit: `95e169c5be95b61d683e9f28b4e2fa361f995ac6`
- distribution surface: repository source package under `capabilities/wflow/`
- PyPI publication: **not claimed**
- license: Apache-2.0

## Source lock

- `loop_harness.py`: `0222569d09287ef4673378307e54c7c2c270adad614b14909a7c8d083ce87704`
- `test_loop_harness.py`: `4658cb0610b9d32127e82ad4f0cd0e91e902ca79f667902ad3fc14a0c9ba3867`
- `LOOP_BLUEPRINT_SCHEMA.json`: `bfa6106e835fca9753c3f9c981f540b14e6c4780abd9e4912d34c7564e4aa362`
- `LOOP_INSTANCE_TEMPLATE.json`: `643babc3b48fd9b5bf09081244e186930662d4c119787d8f8ae164c4a8d80263`
- `LOOP_INSTANCE_SEMANTICS.json`: `32533794c59242cba5cc09d6976f650f7573b585d2c99b27ffc01a74795ac058`
- provenance: `PROVENANCE.md`

## Qualification evidence

PR #17 exact merge-ref workflow:

- run: `34618040928`
- job: `103324759118`
- conclusion: `success`
- public integrity: `PUBLIC_INTEGRITY_PASS assets=14 markdown_links=checked`
- exact source identities: 5/5 `OK`
- original recovered core suite: `8/8 PASS`
- benchmark: `WFLOW_BENCHMARK_PASS`, 1,000 iterations, 1 unique output digest
- public QA: `WFLOW_PUBLIC_QA_PASS`
- wheel build: PASS
- PR wheel SHA-256: `b223013e9dfd8a327927868e3bfabc2272ce0a8bbb9a03956d82d04549162834`
- clean consumer: `WFLOW_CLEAN_CONSUMER_PASS files=13`

First post-merge `main` workflow on `95e169c...`:

- run: `34618124907`
- job: `103325036638`
- conclusion: `success`
- same five source hashes, 8/8 suite, benchmark, public QA and clean-consumer gates passed
- wheel SHA-256: `a109ca20b7b3816bd584a4a2dd6c096b7684eaeae82fdc8e94e59e68dd622c40`

The wheel hash can differ between reproducible source-equivalent builds because wheel ZIP metadata is not claimed byte-reproducible here. The acceptance boundary is source-locked behavior + exact-revision package/consumer verification, not equality of wheel archives across independent builds.

## Claim boundary

This release proves a bounded provider-neutral work-loop contract and deterministic harness. It does not prove or provide an autonomous executor, scheduler, queue, database, Claim service, runtime-exclusive writer enforcement, throughput/cost advantage, production effects or authority grants.

The one-writer claim is intentionally limited to a declared logical owner + exact mutable scope. A real host system must enforce exclusivity through its existing authority/coordination layer.

Private Program compilation, Governor/RSM/Claim/Farm internals, Notebook/portfolio projections, private routing, customer data and credentials are excluded.

## Release-policy transition

This first bounded W_Flow software canary passed the current `AUTO_RELEASE_AFTER_IQA` path with exact source locks, independent public QA, clean-consumer verification and main readback. Future compatible changes remain subject to that same or stricter evidence boundary.
