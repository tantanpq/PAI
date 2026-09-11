# PAI W_Flow Core

**Status:** `0.1.0 RELEASE CANDIDATE`

W_Flow Core is a small provider-neutral contract and deterministic Python harness for resumable, evidence-first work loops.

It targets a recurring failure mode in long-running AI work: starting is easy, but replay, resume, stopping, blocker isolation and authority boundaries are often hidden inside prompts or provider-specific automation.

## What it provides

- explicit states and valid transitions;
- deterministic transition/evaluation harness;
- exact event-id replay as a no-op;
- `NO_MATERIAL_DELTA` suppression instead of fabricating successor work;
- local blocker containment semantics;
- explicit authority-gate semantics with no authority granted by the package itself;
- distinct state vs lifecycle: `CANDIDATE`, `DONE`, and `LIVE` are not interchangeable;
- reusable blueprint schema, instance template and provider-neutral semantics.

The core loop pattern is:

`SIGNAL -> SELECT -> MISSION -> PRODUCE/BUILD -> SELF_TEST -> INDEPENDENT_QA -> CANARY/DISTRIBUTE -> METRICS -> LEARN -> NEXT_CYCLE`

## What it does not do

W_Flow Core is **not** an executor, scheduler, queue, database, agent runtime, claim service or authority system. It does not implement PAI's private Program/Claim/Farm machinery, automatically grant public/money/legal/credential effects, or create work merely to keep a machine busy.

## Install from a local checkout

```bash
python -m pip install ./capabilities/wflow
```

The current public distribution is the GitHub source package. No PyPI publication is claimed by this release candidate.

## Use

```python
from loop_harness import evaluate, transition

instance = {"state": "SEED", "lifecycle": "CANDIDATE"}
instance = transition(instance, "foundation_ready", "event-1")
instance = transition(instance, "canary_ready", "event-2")

result = evaluate(
    previous_observation={"signal": 1},
    current_observation={"signal": 1},
    material_delta=False,
)

assert result["decision"] == "NO_MATERIAL_DELTA"
assert result["duplicate_work"] == 0
```

Run:

```bash
python -m unittest -v test_loop_harness.py
python benchmark.py
python public_qa.py
```

## Release evidence boundary

The public candidate reuses these verified source artifacts byte-identically:

- `loop_harness.py`;
- `test_loop_harness.py`;
- `LOOP_BLUEPRINT_SCHEMA.json`;
- `LOOP_INSTANCE_TEMPLATE.json`;
- `LOOP_INSTANCE_SEMANTICS.json`.

The recovered source family previously passed **13/13** tests including the original **8/8** core suite, plus independent frozen-byte QA. Public release still requires exact source-hash checks, the original 8/8 suite, public benchmark/QA, wheel build, clean-consumer installation and post-merge readback on the exact package bytes.

The public benchmark measures determinism, replay/idempotency, blocker containment, authority gating and zero-successor behavior for unchanged observations. It is not a throughput or cost benchmark.

## Ownership boundary

The blueprint contains exactly one logical `ownership.owner` and exact `mutable_scope` declaration. W_Flow can test that contract, but enforcing exclusive writers in a real system remains the responsibility of that system's existing authority/coordination layer. The package does not invent one.

## Protected boundary

Not included: private Program compilation, Governor/RSM/Claim/Farm internals, private autonomous routing, Notebook/portfolio projections, customer/private work data, credentials or private operational state.

License: Apache-2.0. PAI trademarks and Protected Core remain reserved/excluded.
