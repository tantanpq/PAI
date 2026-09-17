# Context Economy 0.1.0

Context Economy is a dependency-free JavaScript toolkit for sending a model the smallest sufficient context without weakening authority, provenance, privacy, acceptance, or rollback boundaries.

It provides five composable primitives:

- `buildContextCapsule`: preserves protected fields, applies explicit source caps, and returns `CONTEXT_MISS` instead of silently dropping required evidence.
- `compactHealth`: creates a bounded read model with an explicit pointer to the full source.
- `reduceToolResult`: retains a content-addressed sanitized result, emits a bounded excerpt, and labels likely prompt-injection text as untrusted data.
- `capabilityProjection`: selects a stable, caller-owned capability set and cache identity.
- `selectRepositoryContext`: ranks a supplied repository map deterministically and fails explicit when nothing matches.

## Install from the repository

```bash
npm install ./capabilities/context-economy
```

No npm-registry publication is claimed.

## Minimal example

```js
const { buildContextCapsule } = require('pai-context-economy');

const capsule = buildContextCapsule({
  objective: 'Summarize one bounded task',
  exactRefs: ['task.md'],
  mutableScope: 'none',
  invariants: ['preserve authority and acceptance'],
  acceptance: ['source-linked answer'],
  resourceBoundary: { network: false },
  stopGates: ['CONTEXT_MISS'],
  authority: 'READ_ONLY',
  privacyClass: 'PUBLIC',
  contextBudget: { total: 2000, outputReserve: 400, sourceCaps: { task: 1000 } },
  sources: [{ id: 'task', required: true, priority: 1, content: '...' }]
});
```

## Evidence and claim boundary

The source campaign measured a workload-specific p95 visible-context reduction from 17,700 to 3,825 tokens (78.39%), with zero percentage-point acceptance regression and no false-success increase across its frozen fixture set. That result is evidence for the design, not a universal savings guarantee. Different models, tools, tokenizers, repositories, prompts, and workloads can behave differently.

This public package proves deterministic behavior for the included synthetic tests and benchmark. It does not provide a scheduler, memory authority, credential store, deployment system, security certification, or production performance guarantee.

Run:

```bash
npm test
npm run benchmark
npm run qa
```

License: Apache-2.0 for the software. PAI names and branding remain reserved as described by the repository license.
