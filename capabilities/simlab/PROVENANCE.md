# SimLab Core 0.1.0 provenance

## Design basis

The public pilot is a new sanitized implementation of the reusable SimLab contract surface. It is **not** a source dump of the protected PAI SimLab R7 runner, policy registry, private failure corpus or repair intelligence.

Before packaging, an independent R7 QA copy on an admitted QA host was re-read and its published identities matched the current SimLab capability contract, including:

- runner SHA-256 `262D5F8FBB22B20C701D59BC6A094E78B4DDD6CEB8BC258601A424A5CF4F0C6E`;
- verification membrane SHA-256 `505D1127E36077D5C60683569C4C227C95860F095B36236CDC5CC94AEA3A0BEF`;
- policy SHA-256 `375426B12C1FF20D374851DC88B2F003BF0B6D15D94B319A6D7CB67492F46017`;
- property-registry SHA-256 `76154F24FF4C6D8546F9264759BE2F705B08530946230B7C68DF6068C112C3D3`;
- usage-contract SHA-256 `DEAE91A1C12B516044FE9CBD403489E85A8E556AEF4816D4F793CDC7196084A2`;
- cognitive-kernel SHA-256 `99339FEB9EC611A1875E6824ACCFCA0B81E913C6E32F0925E919DF5C03910BE6`.

The internal/source evidence basis remains 36/36 compatibility checks plus 73/73 verification-membrane checks, known-bad policy mutant rejection, and independent cross-host QA. Those results justify the contract direction only; they do not substitute for verification of this public package.

## Public reduction

The public 0.1.0 pilot keeps only generic, dependency-free deterministic behavior: synthetic scenarios, bounded property checks, explicit `PASS | FAIL | UNKNOWN`, replay identity, and a simple sequence counterexample shrinker.

Protected R7 runner code, private property registry, advanced evaluators, private application fixtures, customer evidence, repair selection and production authority are excluded.

License: Apache-2.0 for this intentionally open software package. PAI trademarks and Protected Core remain reserved.
