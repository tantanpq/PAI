# Bounded Context Economy

Context economy is the practice of carrying the **minimum sufficient, source-backed context** needed for the next decision or action while preserving semantic fidelity and exact recovery paths.

It is not a contest to minimize bytes forever.

## Core invariants

1. **VERIFY != HYDRATE**  
   Verifying an id, hash, provenance record, freshness marker or pointer does not imply loading the referenced body.

2. **Metadata first, exact JIT second**  
   Broad discovery returns metadata/pointers only. Hydrate at most the exact selected source and keep the visible body within its declared budget.

3. **One semantic object, one active representation**  
   Do not carry the same heavy source both inline and by reference. If an integration externalizes a source, the context packet should carry the ref/hash plus only the material delta needed now.

4. **Protected semantics beat byte reduction**  
   Objectives, constraints, accepted decisions, open loops, exact evidence refs, terminal result and next outcome must survive. If they cannot fit, fail closed with a structured context miss instead of silently truncating them.

5. **Receipts and chunks have different budgets**  
   A compact control receipt, a bounded exact-source chunk and a working-context carrier are different surfaces. Do not force all of them through one arbitrary byte ceiling.

## Decision flow

```text
need information
→ verify pointer / identity / provenance
→ broad metadata-only discovery if necessary
→ select one exact source
→ hydrate only if the source can change the decision/action
→ enforce visible byte budget
→ preserve protected semantics
→ deduplicate exact semantic refs
→ return material delta + recovery pointer
```

If a required exact source exceeds its visible budget, prefer:

```text
CONTEXT_MISS
+ exact ref
+ exact hash
+ reason
```

over a partial body that can silently change meaning.

## Quality gates

Measure context quality on at least two axes:

- **economy:** input bytes, visible output bytes, hydrated body count;
- **semantic quality:** protected-field coverage, duplicate semantic object count, exact-ref/hash integrity.

A smaller payload with missing protected semantics is a regression.

## Stop rule

Context optimization is DONE when:

- declared hard budgets pass;
- protected-field coverage is complete for the tested contract;
- duplicate semantic object count is zero;
- exact recovery/JIT paths are intact;
- no representative regression is observed.

At that point, a smaller byte count by itself is:

`NO_MATERIAL_DELTA`

and is not a reason to keep redesigning the context system.

Reopen context work only for a reproducible material regression such as:

- context overflow on a supported path;
- duplicate semantic body/ref injection;
- hard-budget violation;
- protected semantic loss;
- exact-source/hash recovery failure;
- stale state presented as current truth.

## Anti-patterns

Avoid:

- loading full registries or histories merely to verify that they exist;
- replaying the same source body in a carrier and an external artifact;
- testing a helper while production uses a different path;
- using truncation as a substitute for semantic compilation;
- reporting token-savings percentages without a representative corpus and tokenizer/model assumptions;
- creating a new context architecture to shave a few more bytes after all material gates pass.

## Boundary

This pattern does not define a memory database, scheduler, execution authority, hosted-chat capture system, terminal protocol or private runtime topology.

It is a portable context contract that can be applied around those systems.
