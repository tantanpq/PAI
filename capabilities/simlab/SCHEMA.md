# SimLab Core public contracts

SimLab Core 0.1.0 is deliberately small and synthetic-only.

## `pai-simpack/v1`

A SimPack declares a stable `packId`, `version`, `syntheticOnly: true`, a non-empty property set and a non-empty scenario set. Each scenario has a stable ID, optional seed, `synthetic: true`, and an object input.

Public property operators are intentionally limited to `EQUALS`, `TYPE`, and `INCLUDES`. A required property that mismatches yields `FAIL`; a required property whose path is absent yields `UNKNOWN`. Unsupported operators are rejected during pack validation rather than being guessed.

## `pai-simlab-result/v1`

A result contains pack identity, overall `PASS | FAIL | UNKNOWN`, deterministic scenario results and output digests. Overall precedence is `FAIL` over `UNKNOWN` over `PASS` for required checks.

Every result is explicitly `simulationOnly: true`, `syntheticOnly: true`, `productionReady: false`, `liveProven: false`, and `formalProof: false`. Runtime, writer and promotion authority are always `NONE`.

## `pai-simlab-counterexample/v1`

The pilot shrinker supports only a scenario input shaped as `input.sequence`. It greedily removes elements while the same scenario remains `FAIL`, producing a stable minimized synthetic counterexample. Other input shapes return `UNSUPPORTED_SHRINK_SHAPE`; they are not silently treated as minimized.

This contract does not claim exhaustive search, formal verification, real-service simulation, security certification or general production readiness.
