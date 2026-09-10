# Community Assurance Baseline

A public, tool-agnostic workflow for checking whether a reliability or automation claim is actually supported by evidence.

Use this only on systems you own or are authorized to evaluate.

## 1. Lock the claim

Write one sentence that states exactly what you intend to prove.

Good:

> After promotion, one intended owner remains active through a bounded observation window and the previous owner stays disabled.

Too broad:

> The platform is highly available.

Also record what is explicitly **not** being claimed.

## 2. Pin the thing being tested

Record the smallest identity set needed to know what you tested:

- source/revision or artifact identity;
- configuration identity where relevant;
- declared output or state boundary;
- environment class;
- test/fixture version.

Do not rely on a mutable label such as `latest` when the claim depends on exact bytes or exact state.

## 3. Separate states

Track these states independently where they matter:

- planned;
- materialized;
- running;
- test PASS/FAIL;
- promoted/live;
- terminal DONE/NOT_DONE;
- independently verified/not independently verified.

Never use one state as evidence for another without an explicit transition and readback.

## 4. Choose the smallest decisive checks

Select checks that directly attack the claim. Examples:

- exact byte/readback comparison;
- recovery/restore test;
- stale-owner or duplicate-writer rejection;
- restart/reconnect;
- negative fixture;
- malformed/corrupt input;
- path/scope containment;
- bounded soak;
- independent manifest or provenance reconstruction.

Prefer a small decisive suite over a large decorative test count.

## 5. Run positive and negative evidence

A useful assurance check usually needs both:

- a case that should succeed;
- a case that should fail closed.

If everything passes regardless of the input, the test may be measuring optimism rather than behavior.

## 6. Preserve terminal truth

Keep failed attempts and supersession visible. If a later run passes, record why it supersedes the earlier failure instead of erasing history.

A valid result should state:

- terminal status;
- exact checks run;
- pass/fail counts when meaningful;
- relevant readback;
- provenance;
- remaining unknowns;
- unsupported claims.

## 7. Add independent review when it changes confidence materially

Independent review is most useful for:

- risky promotion/cutover claims;
- security or source-safety boundaries;
- evidence freeze/provenance;
- recovery claims;
- mutable-scope or ownership conflicts;
- public claims that could otherwise exceed the evidence.

The reviewer should verify the declared acceptance boundary rather than rewrite the entire system.

## 8. Publish only the reusable lesson

Before sharing publicly:

- remove credentials, private source, internal paths, host identities, customer data, and sensitive logs;
- remove private hashes/fingerprints when they add no public value;
- check third-party rights and attribution;
- state the tested boundary and unsupported claims;
- keep protected implementation or evaluation intelligence private when publication is unnecessary.

## Minimal receipt template

```text
CLAIM:
PINNED_INPUT:
DECLARED_OUTPUT_OR_STATE:
CHECKS:
NEGATIVE_CHECKS:
TERMINAL_STATUS:
INDEPENDENT_REVIEW:
READBACK:
PROVENANCE:
UNSUPPORTED_CLAIMS:
PUBLICATION_BOUNDARY:
```

## Next step

If this baseline exposes a reproducible defect, repair the **owning seam**, rerun the bounded evidence, and preserve the before/after result. If the claim requires private source, deep reconstruction, repeated verification, or customer-controlled execution, use the fuller PAI Assurance boundary rather than widening the public claim.

## Provenance

Curated from the earlier public `pai-reliability-evidence` repository. Original public source: `workflows/community-assurance-baseline.md`.
