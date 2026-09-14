# Case Study: When Task Done Did Not Mean Program Done

## Situation

A deterministic workflow candidate had to answer two questions that are often collapsed into one status: what work is known and eligible now, and whether the whole program is actually complete.

The candidate was tested with a frontier containing many independent eligible items. The complete eligible set was treated as the supply horizon rather than being clipped to a worker or lane count.

## Verification

Repeated compilation of the same frozen frontier produced deterministic plans. Stable Task identity was preserved across new attempts, stale fences failed closed, accepted `DONE` results released compatible dependencies, and duplicate results produced no second materialization or wake.

The tests also distinguished local terminal state from aggregate completion: one Task reaching `DONE` did not imply Program `COMPLETE`. Exact completion required recomputing the frontier and proving that no known eligible or materializable work remained.

## Correct lesson

Capacity is a runtime placement concern, not a definition of the work frontier. Likewise, silence in a queue or one completed task is not evidence of quiescence.

A system should derive `COMPLETE` from the declared completion envelope and a recomputed empty eligible/materializable frontier, not from an incidental executor state.

Boundary: this candidate-only result does not prove live autonomous scheduling, production activation, or multi-host runtime behavior.
