# Context Kit schema

Context Kit 0.2 keeps the `compile()` v1 contract below and adds retrieval and continuity contracts.

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

## Retrieval Economy

`planRetrieval()` accepts a query plus bounded caller-supplied metadata candidates. Candidate bodies (`body`, `content`, `fullContent`, `raw`, `text`) are rejected with `BROAD_DISCOVERY_BODY_FORBIDDEN`. Output contains metadata pointers and, on a hit, exactly one `EXACT_JIT_FETCH` instruction.

`resolveExactArtifact()` accepts one stable identity, expected SHA-256, primary ref, optional archive ref, and at most two exact candidate values. It never searches history. A matching artifact is returned only after hash verification and byte-budget enforcement; otherwise it returns `CONTEXT_MISS` or throws `EXACT_ARTIFACT_HASH_DRIFT`.

`convergeLifecycleProjection()` selects the newest timestamped governed attempt for the same stable identity. This rejects a stale cached running attempt when a newer terminal attempt exists without allowing an older terminal attempt to mask a legitimate newer retry. Ranking does not create authority; callers supply the governed attempt projection.

## Continuity Carrier

`buildContinuityCarrier()` protects:

- objective and next outcome;
- constraints and accepted decisions;
- open loops and Program/Campaign/Mission refs;
- exact evidence refs and terminal Result pointer.

The protected set is never summarized away. If it cannot fit, the result is `CONTEXT_MISS`. Recent working items are admitted only within the remaining byte/item budget. Passing `rawHistory` is rejected with `RAW_HISTORY_NOT_ACCEPTED`.

`buildSuccessorCheckpoint()` emits the same protected contract with an empty working set. Raw transcript storage, source fetching, truth decisions and effect execution remain external.
