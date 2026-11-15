# Case Study: When Task Done Did Not Mean Program Done

## Situation

A deterministic workflow candidate had to answer two questions that are often collapsed into one status: what work is known and eligible now, and whether the whole program is actually complete.

An illustrative frontier can contain many independent eligible items. The pattern treats the complete eligible set as the supply horizon rather than clipping it to a worker or lane count.

## Suggested verification

Tests should compare repeated compilation of the same frozen frontier, stable task identity across attempts, stale-fence rejection, dependency release after accepted results, and duplicate-result handling. They should distinguish a local terminal state from aggregate completion by recomputing the eligible/materializable frontier.

The original compiler, fixtures and tests are not included or reproduced here; this is a design narrative, not an audited result.

## Correct lesson

Capacity is a runtime placement concern, not a definition of the work frontier. Likewise, silence in a queue or one completed task is not evidence of quiescence.

A system should derive `COMPLETE` from the declared completion envelope and a recomputed empty eligible/materializable frontier, not from an incidental executor state.

Boundary: this narrative does not prove live autonomous scheduling, production activation, or multi-host runtime behavior.
