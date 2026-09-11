'use strict';

const { compile } = require('../context-capsule');

const result = compile({
  owner: { principalId: 'person-a', accountId: 'account-a', workspaceId: 'workspace-a' },
  profile: 'resume',
  budget: 2,
  coverage: { observedUserSignals: 1, unobservedHostedChatTurns: 1 },
  items: [
    { kind: 'intent', id: 'i1', value: 'continue verified work', privacyClass: 'PUBLIC', provenance: { source: 'accepted-evidence' }, freshness: '2026-09-11T00:00:00Z' },
    { kind: 'constraint', id: 'c1', value: 'do not invent missing runtime state', privacyClass: 'PUBLIC', provenance: { source: 'accepted-evidence' }, freshness: '2026-09-11T00:00:00Z' },
    { kind: 'unknown', id: 'u1', value: 'current runtime state not observed', privacyClass: 'PUBLIC', provenance: { source: 'accepted-evidence' }, freshness: '2026-09-11T00:00:00Z' }
  ]
});

console.log(JSON.stringify(result.capsule, null, 2));
