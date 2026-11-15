# Context Economy 0.1.0

Context Economy is a dependency-free JavaScript toolkit for assembling bounded source excerpts, compact health views, tool-result envelopes, capability sets and repository-map selections. Callers supply policy and authority metadata; these helpers do not enforce access permissions or provide complete privacy filtering.

It provides five composable primitives:

- `buildContextCapsule`: preserves protected fields, applies explicit source caps, and returns `CONTEXT_MISS` instead of silently dropping required evidence.
- `compactHealth`: projects shared health fields and a limited check list; it carries the caller-supplied full-source reference when present.
- `reduceToolResult`: redacts matched credential forms, emits a bounded UTF-8 excerpt and content hash, and flags likely prompt-injection text. A caller-supplied storage callback can retain the redacted result; the default only returns a hash reference.
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

The public evidence consists of the included synthetic tests and deterministic benchmark. Private source-campaign workloads and measurements are not included or verified here. Capsule budgets count Unicode code points for protected fields and source excerpts, not model tokens or the complete serialized envelope; repository-map token costs are estimates.

This public package proves deterministic behavior for the included synthetic tests and benchmark. It does not provide a scheduler, memory authority, credential store, deployment system, security certification, or production performance guarantee.

Run:

```bash
npm test
npm run benchmark
npm run qa
```

License: Apache-2.0 for the software. PAI names and branding remain reserved as described by the repository license.
