# Context Kit provenance

Tagged public package version: `0.1.0`. Current compatible release candidate: `0.2.0`.

Recovered source family: Google Drive folder `1F9AmMNY2wGRLwEj3iMXO_DK0joHq7AeQ`.

| Source | Drive ID | SHA-256 | Public treatment |
| --- | --- | --- | --- |
| `context-capsule.js` | `1j3VzCsINaYF9YKe7sFK7OTLh4tGuwI7g` | `a5181c6bb42080757caca92a2823e6908028ea477261bd1af5b9cb4e3385c056` | byte-identical reuse |
| `context-capsule.test.js` | `1DWHAcLEYoyqsiEM8JYAdTvc-uPRK6duG` | `75f463fbc46ca6661c1fc1a8979e54a3b45b35b228de1e3273e93e87aaf136c4` | byte-identical reuse |
| source-family `README.md` | `1i99wsbkrehMC8VpXabuXPeWYI4Nt0o85` | source reference retained | replaced by standalone public package documentation |

The compiler and original test file are reused rather than rewritten. Public-only additions are package metadata, schema documentation, benchmark harness, example and Apache-2.0 license text.

## 0.2 candidate lineage

The 0.2 candidate adopts public-safe patterns from the completed PAI Context Economy and Hosted E2E Closure work:

- metadata-only broad discovery followed by one exact JIT fetch;
- bounded tool/source payloads and explicit `CONTEXT_MISS`;
- stable identity fallback when a cached execution attempt becomes stale;
- exact primary/archive artifact lookup with SHA-256 verification;
- protected continuity fields plus bounded working context and cold raw history;
- two-axis benchmarking: economy and continuity quality.

The broader campaign measured p95 visible context from 17,700 to 3,825 tokens (78.39%) on its frozen workload with zero acceptance regression and no false-success increase. This is lineage evidence, not a universal Context Kit performance claim.

A later protected qualification cycle strengthened the public-safe lessons without publishing private runtime details:

- `VERIFY != HYDRATE`: identity/provenance verification stays metadata-only until one exact source is explicitly selected;
- exact sources that exceed the visible budget fail closed without returning their body;
- identical exact evidence refs are deduplicated before protected-budget accounting;
- protected semantic coverage is measured separately from byte reduction;
- optimization stops at `NO_MATERIAL_DELTA` once hard budgets, semantic coverage and duplicate-count gates pass.

The protected qualification also reinforced an assurance lesson: helper-level tests are not substitutes for reachable-path tests. Public Context Kit keeps this lesson at the contract/benchmark layer and does not publish private executor, host-control, routing or failure-corpus internals.

Protected Personal continuity data, private Mind/Chief implementation, proprietary retrieval/ranking/routing/adaptation logic, private evaluation corpora, credentials, host topology and authority internals are not part of this package.
