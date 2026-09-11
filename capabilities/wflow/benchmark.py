#!/usr/bin/env python3
"""Reproducible behavior benchmark for the public W_Flow Core package."""
import json
from pathlib import Path

from loop_harness import canonical_digest, evaluate, transition

ROOT = Path(__file__).parent


def run_once():
    instance = {"state": "SEED", "lifecycle": "CANDIDATE"}
    instance = transition(instance, "foundation_ready", "event-1")
    instance = transition(instance, "canary_ready", "event-2")
    instance = transition(instance, "qa_pass", "event-3")
    instance = transition(instance, "cycle_accepted", "event-4")
    replay = transition(instance, "cycle_accepted", "event-4")
    assert replay == instance

    no_delta = evaluate({"signal": 1}, {"signal": 1}, False)
    assert no_delta == {"decision": "NO_MATERIAL_DELTA", "next_state": "WAIT_SIGNAL", "duplicate_work": 0}

    blocked = evaluate({"signal": 1}, {"signal": 2}, True, local_blocker="missing local input", authority_effect="PUBLIC")
    assert blocked["decision"] == "BLOCKED_LOCAL"

    gated = evaluate({"signal": 1}, {"signal": 2}, True, authority_effect="PUBLIC")
    assert gated["decision"] == "AUTHORITY_GATE"

    try:
        transition({"state": "AUTHORITY_GATE", "lifecycle": "CANDIDATE"}, "authority_granted", "grant-1")
        raise AssertionError("authority grant should fail closed without explicit grant")
    except PermissionError:
        pass

    semantics = json.loads((ROOT / "LOOP_INSTANCE_SEMANTICS.json").read_text())
    template = json.loads((ROOT / "LOOP_INSTANCE_TEMPLATE.json").read_text())
    schema = json.loads((ROOT / "LOOP_BLUEPRINT_SCHEMA.json").read_text())

    assert semantics["provider_neutral"] is True
    assert semantics["no_material_delta"]["successor_work"] == 0
    assert semantics["local_blocker"]["may_block_other_instances"] is False
    assert semantics["authority_gate"]["grant_is_not_implemented_here"] is True
    assert semantics["effect_ceiling"] == "NONE"
    assert template["canary_distribution"]["live_effect"] == "NONE"
    assert set(template["ownership"]) == {"owner", "mutable_scope"}
    assert schema["properties"]["ownership"]["required"] == ["owner", "mutable_scope"]

    return {
        "final_state": instance["state"],
        "instance_digest": canonical_digest(instance),
        "no_material_delta": no_delta,
        "local_blocker": blocked["decision"],
        "authority_gate": gated["decision"],
        "provider_neutral": semantics["provider_neutral"],
        "effect_ceiling": semantics["effect_ceiling"],
        "one_writer_declaration": True,
    }


def main():
    outputs = [run_once() for _ in range(1000)]
    digests = {canonical_digest(value) for value in outputs}
    assert len(digests) == 1
    print(json.dumps({
        "status": "WFLOW_BENCHMARK_PASS",
        "iterations": 1000,
        "unique_output_digests": len(digests),
        "replay_exact_noop": True,
        "no_material_delta_successor_work": 0,
        "local_blocker_contained": True,
        "authority_grant_external": True,
        "one_writer_contract": "single owner + exact mutable_scope declaration; runtime enforcement remains external",
        "effect_ceiling": "NONE",
        "note": "Behavior benchmark only; no throughput, cost, or autonomous-execution claim."
    }, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
