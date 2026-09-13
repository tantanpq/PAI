# Synthetic Demo: An Empty READY Set Is Not Done

## Fixture

Create a small deterministic dependency graph with stable Task IDs, separate Attempt IDs, and a declared completion envelope.

- Start with several immediately eligible tasks plus downstream tasks hidden behind dependencies.
- Compile the full eligible frontier while pretending only one worker exists.
- Confirm the supply horizon still contains every eligible task.
- Compile the same frozen frontier again and confirm byte-for-byte equivalent planning output.

## Terminal replay

- Accept one `DONE` result and release only its compatible dependents.
- Replay the same result and confirm no second materialization or wake.
- Submit a stale-fence attempt result and confirm it is rejected.
- Mark another task `NOT_DONE` and confirm unrelated cones remain eligible.

## Quiescence check

Temporarily arrange the executor view so no task is currently `READY`, while a dependency transition can still materialize known work. Confirm the system does **not** report `COMPLETE`.

Only after recomputing the declared envelope and proving no known eligible or materializable work remains should the demo emit exact quiescence.

No credentials, network access, live hosts, private source, production mutation, or autonomous scheduler is required.
