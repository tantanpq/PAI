# Context Kit 0.2.0 release candidate

## Scope

This compatible candidate keeps the Context Capsule 0.1 API and adds Retrieval Economy plus Continuity Carrier contracts. It does not import PAI Chief, TaskBox, Claim, Farm, Prompt Ledger, personal memory, private routing, credentials, topology or protected evaluation data.

## Required qualification

- original Context Capsule suite remains 6/6 PASS;
- new 0.2 suite passes eight tests covering metadata-only discovery, exact archive/hash lookup, over-budget no-hydration behavior, stable-ID convergence, protected continuity, duplicate exact-ref elimination, successor checkpoints, and bounded overflow failure;
- benchmark v2 reports economy and continuity quality separately;
- benchmark v2 reports protected-field coverage and duplicate semantic object count separately from byte reduction;
- exact sources over budget return `CONTEXT_MISS` with no body hydration;
- context-only optimization stops at `NO_MATERIAL_DELTA` after hard budgets and semantic-quality gates pass;
- 1,000 deterministic capsule replays produce one SHA-256;
- `npm pack` and a clean temporary consumer succeed;
- repository public-integrity workflow passes on the exact PR merge ref;
- independent QA confirms the public boundary before promotion.

## Claim boundary

The 78.39% p95 reduction belongs to the broader frozen PAI workload. It is provenance, not a universal saving guarantee. The public package claims deterministic bounded behavior only for its exact tests and fixtures.

## Rollback

Revert the candidate commit or continue using tag `context-economy-v0.1.0`. Version 0.1 entrypoints remain available in 0.2.
