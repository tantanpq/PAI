# Context Kit 0.1.0 release receipt

## Identity

- package: `pai-context-kit`
- version: `0.1.0`
- public repository: `tantanpq/PAI`
- first package merge: PR #15
- merge commit: `829e3740387c7a2911d761d66a72d0e155e53eb3`
- distribution surface: repository source package under `capabilities/context/`
- npm registry publication: **not claimed**
- license: Apache-2.0

## Source lock

- compiler SHA-256: `a5181c6bb42080757caca92a2823e6908028ea477261bd1af5b9cb4e3385c056`
- original test SHA-256: `75f463fbc46ca6661c1fc1a8979e54a3b45b35b228de1e3273e93e87aaf136c4`
- provenance: `PROVENANCE.md`

## Qualification evidence

PR #15 exact merge-ref workflow:

- run: `34616248341`
- job: `103318796133`
- conclusion: `success`
- public integrity: `PUBLIC_INTEGRITY_PASS assets=13 markdown_links=checked`
- source identities: both `OK`
- original suite: `6/6 PASS`
- benchmark: `CONTEXT_BENCHMARK_PASS`, 1,000 iterations, 1 unique SHA-256
- package: `npm pack` PASS, 9 files
- clean consumer: `CONTEXT_CLEAN_CONSUMER_PASS`

Post-merge `main` workflow on `829e374...`:

- run: `34616349140`
- job: `103319139209`
- conclusion: `success`
- the same source-lock, test, benchmark, pack and clean-consumer gates passed on public `main`.

## Claim boundary

This receipt proves the bounded public package behavior above. It does not prove hosted ChatGPT capture completeness, universal token savings, a memory database, a truth authority, production service uptime, formal verification or zero defects.

Private PAI Personal data, Mind/Chief internals, proprietary routing/retrieval/adaptation, protected evaluation/failure intelligence, credentials, host topology and authority internals are not part of this release.

## Release-policy transition

The first executable software release used the founder `HUMAN_GATE`. After this accepted first-release canary, future compatible family changes remain subject to the repository public-release policy; conservative default for software-family updates is independent QA before promotion.
