# SimLab Core 0.1.0 public pilot release receipt

## Identity

- package: `pai-simlab-core`
- version: `0.1.0`
- maturity: `PUBLIC PILOT / PILOT_ONLY`
- public repository: `tantanpq/PAI`
- first pilot package PR: `#19`
- first pilot package merge: `3ef9d54866b75380fed970cb1aef4cce064c7316`
- distribution surface: repository source package under `capabilities/simlab/`
- npm registry publication: **not claimed**
- license: Apache-2.0

## Protected-source basis

Before the public reduction, an independent P341 R7 QA copy was re-read and matched the current protected capability identities:

- R7 runner SHA-256: `262D5F8FBB22B20C701D59BC6A094E78B4DDD6CEB8BC258601A424A5CF4F0C6E`
- verification membrane SHA-256: `505D1127E36077D5C60683569C4C227C95860F095B36236CDC5CC94AEA3A0BEF`
- policy SHA-256: `375426B12C1FF20D374851DC88B2F003BF0B6D15D94B319A6D7CB67492F46017`
- property registry SHA-256: `76154F24FF4C6D8546F9264759BE2F705B08530946230B7C68DF6068C112C3D3`
- usage contract SHA-256: `DEAE91A1C12B516044FE9CBD403489E85A8E556AEF4816D4F793CDC7196084A2`
- cognitive kernel SHA-256: `99339FEB9EC611A1875E6824ACCFCA0B81E913C6E32F0925E919DF5C03910BE6`

These hashes establish provenance of the design/evidence basis only. Protected R7 code and private evidence are not part of the public package.

## Exact PR qualification

PR #19 workflow:

- run: `34621390994`
- job: `103335966644`
- conclusion: `success`
- public integrity: `PUBLIC_INTEGRITY_PASS assets=15 markdown_links=checked`
- public suite: `6/6 PASS`
- benchmark: `SIMLAB_BENCHMARK_PASS`, 1,000 iterations, 1 unique digest
- known-good verdict: `PASS`
- known-bad mutant verdict: `FAIL`
- missing-evidence verdict: `UNKNOWN`
- minimized counterexample: length `3 -> 2`
- public boundary QA: `SIMLAB_PUBLIC_QA_PASS`
- tarball protected-name inspection: PASS
- `npm pack`: PASS, 11 files, PR tarball shasum `dd68253dd96707139e8dae1a895e8bc3c3538e72`
- clean consumer: `SIMLAB_CLEAN_CONSUMER_PASS sha256=1a00d188ee48d1047943df98cf047a07007f88fcac777898c732b0e23c93b1a8`

First post-merge public `main` qualification:

- main SHA: `3ef9d54866b75380fed970cb1aef4cce064c7316`
- run: `34621554899`
- job: `103336510088`
- conclusion: `success`
- the same Context/W_Flow regression gates and all SimLab test/benchmark/QA/pack/clean-consumer gates passed on public `main`.

A final read-model PR reruns these gates because this README is included in the package tarball. Its final package evidence is additive to this receipt; changing this receipt alone does not change packed bytes.

## Claim boundary

This release proves a bounded, dependency-free, synthetic-only public verification pilot with explicit `PASS | FAIL | UNKNOWN`, deterministic replay and one narrow counterexample-minimization shape.

It does **not** prove formal correctness, zero defects, security certification, universal production readiness, production service behavior, or general SimLab platform maturity. Real OS/service/network/provider claims remain bounded-real-canary gated outside this package.

Runtime, writer and promotion authority remain `NONE`. Protected R7 runner/evaluator/property intelligence, private failure corpora, customer evidence and repair selection remain excluded.

## Release-policy transition

The first public SimLab software pilot used the founder/public human gate. After accepted canary evidence, future compatible pilot changes may use `AUTO_RELEASE_AFTER_IQA`, while maturity remains `PILOT_ONLY` until a separate evidence-backed promotion decision exists.
