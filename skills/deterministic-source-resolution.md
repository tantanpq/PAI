# Skill — Deterministic Source Resolution

**Use when:** an automation must decide which durable Program/phase/checkpoint/context is authoritative without trusting stale chat history, filename recency, or cached runtime hints.

## Inputs

- stable required source identifiers;
- expected source fingerprints or schema/version checks;
- declared precedence/routing rule;
- required output fields;
- list of volatile facts that must be fetched JIT.

## Procedure

1. Pin the required durable sources.
2. Validate source identity before semantic use.
3. Apply the declared precedence/routing rule deterministically.
4. Emit the resolved context with source provenance.
5. Return `SOURCE_CHECK_REQUIRED` on missing, malformed, mismatched, or contradictory required evidence instead of guessing.
6. Mark volatile runtime facts as JIT-required and fetch them from their current owner at effect time.
7. Keep the resolver read-only; do not create a second state store, queue, scheduler, planner, or authority path.

## Output

```text
RESOLVED_CONTEXT:
SOURCE_REFS:
SOURCE_FINGERPRINTS:
OBSERVED_AT:
RUNTIME_TRUTH_REQUIRED:
STATUS: RESOLVED | SOURCE_CHECK_REQUIRED
UNSUPPORTED_CLAIMS:
```

For the longer contract, see [`../patterns/deterministic-source-resolution-contract.md`](../patterns/deterministic-source-resolution-contract.md).

## Claim boundary

This skill supports reproducible source interpretation. It does not prove live runtime health or grant authority to mutate the resolved state.

## Provenance

Curated from the earlier public `pai-reliability-evidence` repository. Original public source: `skills/deterministic-source-resolution.md` under CC BY 4.0 source terms.
