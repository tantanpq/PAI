# PAI public benchmark policy and current baselines

PAI benchmarks the claims it actually makes. The first public benchmark is therefore about **determinism, replay, bounded context, failure detection, clean-consumer portability and release integrity**, not decorative throughput numbers.

A fast wrong answer is still wrong. A green test on the wrong release composition is still not a release.

## Current verified source baselines

These are source-recovery baselines, not yet claims about the exact future public package bytes.

| Capability | Verified baseline | What the baseline supports | What it does **not** prove |
| --- | ---: | --- | --- |
| Context Kit / Context Capsule | **6/6 PASS** | deterministic output; precedence/dedup; privacy and item-budget behavior; profile separation; malformed or credential-like input rejection; enrichment-failure isolation; no durable-adapter mutation | public-package clean install; universal token savings; hosted ChatGPT capture completeness |
| W_Flow | **13/13 PASS** plus independent frozen-byte QA | schema/transitions; deterministic replay; one-writer behavior; local-blocker containment; authority separation; protected-surface/no-live-effect boundary | private PAI Program orchestration; every provider/runtime integration |
| SimLab Core | **36/36 compatibility + 73/73 verification checks**, with known-bad policy mutant rejection | deterministic scenario/property/result semantics; bounded verification membrane; explicit failure detection | formal proof; zero defects; universal production readiness; real OS/provider/service claims without canary evidence |

Public evidence for these baselines is tracked in GitHub issues [#1](https://github.com/tantanpq/PAI/issues/1), [#2](https://github.com/tantanpq/PAI/issues/2), and [#3](https://github.com/tantanpq/PAI/issues/3).

## Release benchmark gates

Every executable public package must rerun the benchmark against the **exact frozen public candidate bytes**. Prior internal PASS is evidence and reuse input, not a substitute for public-package verification.

### Context Kit

Required public-package benchmark:

1. same input + same profile + same policy produces byte-stable normalized output;
2. precedence and dedup resolve conflicts deterministically;
3. secret-bearing or malformed exact references fail closed;
4. protected context fields survive budget pressure or return structured `CONTEXT_MISS`;
5. clean-consumer run succeeds outside private PAI paths/runtime;
6. input size, output size and retained protected-field coverage are reported separately;
7. no token-savings percentage is claimed without a representative corpus and reproducible tokenizer/model assumptions.

### W_Flow

Required public-package benchmark:

1. deterministic transition sequence for a fixed loop fixture;
2. replay/idempotency leaves terminal state unchanged;
3. one-writer violation is rejected;
4. a local blocker does not stop unrelated eligible work;
5. authority-gated effects remain external to W_Flow;
6. `NO_MATERIAL_DELTA` terminates without fabricating work;
7. clean-consumer run succeeds without private PAI Program/Claim/Farm dependencies.

### SimLab Core

Required public-package benchmark:

1. deterministic replay of the same SimPack;
2. known-good fixture passes and known-bad mutant fails;
3. result states preserve `PASS / FAIL / UNKNOWN` rather than forcing false certainty;
4. a reproducible counterexample is emitted for a failing property when available;
5. minimized failure output remains sufficient to reproduce the failing condition;
6. clean-consumer run succeeds with synthetic fixtures only;
7. real-world claims remain canary-gated outside the synthetic lab.

## Repository-level benchmark

The public repository itself has an independent integrity gate in `.github/workflows/public-integrity.yml`. Every release PR must pass that exact revision's checks for catalog identity, bounded release classes, credential/private-path patterns and local Markdown-link integrity.

A repository-integrity PASS means the public composition passed those checks. It does not upgrade a package from candidate to supported product by itself.

## Commercial evidence rule

Engineering benchmarks answer "does it behave as claimed?" They do not answer "will someone pay for it?" Commercial maturity requires separate evidence such as external reuse, design-partner outcomes, support burden, conversion, paid pilot value and renewal. Popularity, stars and benchmark speed are not substitutes for willingness to pay.
