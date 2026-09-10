# Source-Only Resume Runbook

Use this runbook when an AI agent, automation worker, or long-running workflow must resume from a fresh session without treating conversation memory or cached summaries as authority.

The resume layer is read-only. It must not mint tasks, claims, writers, or a second memory/control authority.

## Goal

Reconstruct durable operating context from verified sources, then fetch only the volatile runtime truth needed for the next action.

## Resume sequence

### A. Start from a blank semantic session

Assume prior conversation text may be missing, stale, compressed, or wrong.

- Do not promote chat history to authority.
- Do not infer “current” from the newest filename or cached summary.

### B. Load the stable source route

Read the minimal declared set of durable pointers/sources needed to reconstruct context.

- [ ] source identifiers are stable;
- [ ] precedence/routing rule is known;
- [ ] required sources are explicitly marked.

### C. Verify source identity

Before semantic use:

- [ ] verify fingerprint/hash/size when available;
- [ ] verify schema/version;
- [ ] reject malformed or contradictory mandatory inputs;
- [ ] return `SOURCE_CHECK_REQUIRED` rather than guessing.

### D. Resolve durable context

Resolve only durable semantics such as:

```text
PROGRAM / PROJECT CONTEXT
→ PHASE / STAGE
→ CHECKPOINT / VERSION
→ REQUIRED SOURCE REFERENCES
```

Record provenance with the result.

### E. Mark volatile fields unknown

Do not copy runtime state into durable resume truth.

Examples that should remain `UNKNOWN` until a fresh read:

- worker/host health;
- live capacity;
- active claims;
- current queue state;
- current effect ownership;
- other rapidly changing operational facts.

### F. Fetch minimum runtime truth JIT

Read only the current runtime facts needed for the next bounded action from their owning source.

```text
DURABLE CONTEXT RESOLVED
+ REQUIRED JIT RUNTIME READ
→ NEXT BOUNDED DECISION
```

### G. Fail closed on unresolved mandatory evidence

If a mandatory durable source cannot be verified, stop that dependency cone with a precise source-check requirement. Do not invent fallback authority from memory.

### H. Preserve authority boundaries

- [ ] resume path remains read-only;
- [ ] no new planner/scheduler/queue/database is created;
- [ ] no task or effect is created merely because context was reconstructed;
- [ ] runtime/publication/credential/money/legal gates remain with their existing owners.

## Acceptance checks

A source-only resume path is useful when:

- [ ] a blank session can reconstruct the same durable context without prior chat text;
- [ ] identical verified sources produce identical durable context;
- [ ] a required source mismatch returns a fail-closed status;
- [ ] volatile runtime fields remain unresolved until JIT read;
- [ ] provenance is retained;
- [ ] no new authority is introduced.

## Claim boundary

A successful source-only resume proves only bounded reconstruction of durable context. It does not prove the runtime is healthy, the resume route is active in production, or the reconstructed context grants effect authority.

## Provenance

Curated from the earlier public `pai-reliability-evidence` repository. Original public source: `runbooks/source-only-resume.md`.
