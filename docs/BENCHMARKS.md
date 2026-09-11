# PAI public benchmark policy and current release evidence

PAI benchmarks the claims it actually makes. The public benchmark surface is therefore about **determinism, replay, bounded context, failure detection, clean-consumer portability and release integrity**, not decorative throughput numbers.

A fast wrong answer is still wrong. A green test on the wrong release composition is still not a release.

## Current public release evidence

These results were rerun against exact public package/release revisions. They are narrower than product or commercial claims.

| Capability | Current public state | Exact public-package evidence | What it does **not** prove |
| --- | --- | --- | --- |
| Context Kit 0.1.0 | `PUBLIC_FOUNDATION` | **6/6 PASS**; 1,000 deterministic replays / 1 SHA; `npm pack`; clean-consumer install/use; source identities pinned | universal token savings; hosted-chat capture completeness; memory/truth authority |
| W_Flow Core 0.1.0 | `PUBLIC_FOUNDATION` | original public core **8/8 PASS**; 1,000 deterministic iterations / 1 digest; public QA PASS; wheel build; clean virtualenv install/use; five recovered source identities pinned | autonomous execution; scheduler/Claim authority; runtime-exclusive writer enforcement; every provider integration |
| SimLab Core 0.1.0 | `PUBLIC PILOT / PILOT_ONLY` | **6/6 PASS**; 1,000 deterministic replays / 1 digest; known-good `PASS`; known-bad mutant `FAIL`; missing evidence `UNKNOWN`; counterexample `3 -> 2`; public QA; `npm pack`; clean consumer; protected-R7 exclusion check | formal proof; zero defects; security certification; real OS/service/provider behavior; general production-platform readiness |

Release receipts are stored with each executable surface under `capabilities/*/RELEASE_RECEIPT.md`. The public distribution currently lives in this GitHub repository; npm/PyPI registry publication is not claimed.

## Verified source/internal baselines

These baselines explain the lineage behind the public reductions. They remain evidence inputs, not substitutes for exact public-package verification.

| Capability | Source/internal baseline | What it supports |
| --- | ---: | --- |
| Context Kit / Context Capsule | **6/6 PASS** | deterministic output; precedence/dedup; privacy and item-budget behavior; profile separation; malformed/credential-like input rejection; enrichment-failure isolation; no durable-adapter mutation |
| W_Flow | **13/13 PASS** plus independent frozen-byte QA | schema/transitions; deterministic replay; one-writer declaration; local-blocker containment; authority separation; protected-surface/no-live-effect boundary |
| SimLab protected basis | **36/36 compatibility + 73/73 verification checks**, known-bad policy-mutant rejection and independent QA | bounded verification-membrane design/evidence basis; deterministic scenario/property/result semantics; explicit failure detection |

The protected SimLab R7 baseline is provenance for the public reduction. Protected runner/evaluator/property intelligence is not distributed by the public pilot.

## Release benchmark gates

Every executable public package must rerun the benchmark against the **exact frozen public candidate bytes**. A prior release or internal PASS is reusable evidence, not permission to skip qualification of changed bytes.

### Context Kit

Required package benchmark:

1. same input + same profile + same policy produces byte-stable normalized output;
2. precedence and dedup resolve conflicts deterministically;
3. secret-bearing or malformed exact references fail closed;
4. protected context fields survive budget pressure or return structured `CONTEXT_MISS`;
5. clean-consumer run succeeds outside private PAI paths/runtime;
6. input size, output size and retained protected-field coverage are reported separately;
7. no token-savings percentage is claimed without a representative corpus and reproducible tokenizer/model assumptions.

### W_Flow Core

Required package benchmark:

1. deterministic transition sequence for a fixed loop fixture;
2. replay/idempotency leaves the accepted state unchanged;
3. one logical owner + exact mutable scope remains explicit, while real exclusivity enforcement stays external;
4. a local blocker does not block unrelated instances by contract;
5. authority-gated effects remain external to W_Flow;
6. `NO_MATERIAL_DELTA` terminates without fabricating successor work;
7. clean-consumer run succeeds without private PAI Program/Claim/Farm dependencies.

### SimLab Core public pilot

Required package benchmark:

1. deterministic replay of the same synthetic SimPack;
2. known-good fixture passes and known-bad mutant fails;
3. required missing evidence remains `UNKNOWN` rather than becoming false PASS;
4. a reproducible counterexample is emitted for a supported failing property shape;
5. minimized failure output remains sufficient to reproduce the failing condition;
6. protected R7 filenames/intelligence remain outside the public tarball;
7. clean-consumer run succeeds with synthetic fixtures only;
8. real-world claims remain canary-gated outside the synthetic lab.

## Repository-level benchmark

The public repository has an independent integrity gate in `.github/workflows/public-integrity.yml`. Every release PR and push to `main` reruns catalog/link integrity plus the exact package gates currently bound into that workflow.

A repository-integrity PASS means that revision passed those checks. It does not upgrade a package beyond its declared maturity. In particular, SimLab remains `PILOT_ONLY` after a successful public-pilot release.

## Commercial evidence rule

Engineering benchmarks answer **“does it behave as claimed?”** They do not answer **“will someone pay for it?”** Commercial maturity requires separate evidence such as external reuse, design-partner outcomes, support burden, conversion, paid pilot value and renewal. Popularity, stars and benchmark speed are not substitutes for willingness to pay.
