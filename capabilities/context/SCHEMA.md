# Context Kit schema

## Request

Required top-level fields:

- `owner`: object with non-empty `principalId`, `accountId`, `workspaceId`.
- `profile`: `resume`, `passport`, or `work`.
- `budget`: positive integer measured in selected items.
- `coverage`: non-negative integer counts `observedUserSignals` and `unobservedHostedChatTurns`.
- `items`: array of evidence items.

Each item requires:

- `kind`: one of `programResult`, `currentPicture`, `outcome`, `intent`, `experience`, `memory`, `constraint`, `unknown`, `artifact`;
- `id`, `value`, `freshness`: non-empty strings;
- `privacyClass`: `PUBLIC`, `PERSONAL`, or `SECRET`;
- `provenance.source`: non-empty string.

`programResult`, `experience`, and `artifact` additionally require a non-empty `locator` and 64-character lowercase hexadecimal `hash`.

## Selection

Precedence is deterministic: `programResult` → `currentPicture` → `outcome` → `intent` → `experience` → `memory` → `constraint` → `unknown` → `artifact`, then item id and canonical digest.

Omissions are explicit: `PROFILE_EXCLUDED`, `PRIVACY_REDACTED`, `DUPLICATE`, `BUDGET_EXCEEDED`.

## Output

`compile()` returns:

- `capsule`: selected items, omissions, coverage, declared policy, ownership marker and optional `CONTEXT_MISS`;
- `canonical`: deterministic canonical string;
- `sha256`: SHA-256 of the canonical capsule.

A selected `unknown` item produces `contextMiss = { code: 'CONTEXT_MISS', unknownIds: [...] }`.

## Failure mode

Malformed or credential-like inputs fail closed with `ContextCapsuleError` code `MALFORMED_INPUT`.
