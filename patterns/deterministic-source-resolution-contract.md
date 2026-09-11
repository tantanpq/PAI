# Deterministic Source Resolution Contract

Use this contract when an automation must resolve durable “what should I read/use?” context without turning stale hints or chat history into authority.

The resolver is a read-only interpretation layer. It must not become a second planner, scheduler, queue, database, writer, or control plane.

## Minimal input contract

```text
SOURCE_ID:
EXPECTED_SHA256:
EXPECTED_BYTES:
SCHEMA_OR_VERSION:
REQUIRED_FIELDS:
PRECEDENCE_OR_ROUTING_RULE:
```

## Minimal output contract

```text
RESOLVED_PROGRAM_OR_CONTEXT:
RESOLVED_PHASE_OR_STAGE:
RESOLVED_CHECKPOINT_OR_VERSION:
SOURCE_REFS:
SOURCE_FINGERPRINTS:
OBSERVED_AT:
RUNTIME_TRUTH_REQUIRED: true | false
STATUS: RESOLVED | SOURCE_CHECK_REQUIRED
```

The field names may vary by system. The important property is that output carries the evidence needed to reproduce the resolution.

## Acceptance checklist

- [ ] Required durable sources are pinned by stable identifier.
- [ ] Hash/byte/schema validation occurs before semantic use when those checks are available.
- [ ] Missing required source fails closed.
- [ ] Malformed required source fails closed.
- [ ] Hash or byte mismatch fails closed.
- [ ] Contradictory required sources do not silently pick a winner.
- [ ] Identical valid inputs produce identical durable projection.
- [ ] Output carries source provenance and observation time.
- [ ] Volatile runtime truth is explicitly excluded or marked as JIT-required.
- [ ] Filename recency, chat history, or cached snapshots are not promoted above the declared source-precedence rule.
- [ ] No write or effect authority is embedded in the resolver.
- [ ] Fixtures cover valid, missing, malformed, mismatch, and contradiction cases.

## Separation rule

```text
DURABLE SOURCE PROJECTION
≠
VOLATILE RUNTIME TRUTH
```

For example, a durable projection may resolve which Program/Phase/checkpoint is authoritative, while current worker health, capacity, active claims, or live state must still be read from the current runtime owner at effect time.

## Claim boundary

Passing this contract supports deterministic source-resolution evidence only. It does not establish live health, activation, or authority to change the resolved state.

## Provenance

Curated from the earlier public `pai-reliability-evidence` repository. Original public source: `patterns/deterministic-source-resolution-contract.md` under CC BY 4.0 source terms.
