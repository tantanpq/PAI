import json
from pathlib import Path
import unittest

from loop_harness import InvalidTransition, STATES, TRANSITIONS, evaluate, transition

ROOT = Path(__file__).parent

class LoopHarnessTests(unittest.TestCase):
    def instance(self, state="SEED"):
        return {"state": state, "lifecycle": "CANDIDATE"}

    def test_required_states_and_valid_transitions(self):
        self.assertEqual(set(STATES), set(TRANSITIONS))
        current = self.instance()
        current = transition(current, "foundation_ready", "1")
        current = transition(current, "canary_ready", "2")
        current = transition(current, "qa_pass", "3")
        current = transition(current, "cycle_accepted", "4")
        self.assertEqual(current["state"], "WAIT_SIGNAL")

    def test_invalid_transition(self):
        with self.assertRaises(InvalidTransition): transition(self.instance(), "qa_pass", "1")

    def test_idempotency_and_replay(self):
        once = transition(self.instance(), "foundation_ready", "event-1")
        replay = transition(once, "foundation_ready", "event-1")
        self.assertEqual(once, replay)
        self.assertEqual(replay["runtime"]["applied_events"], ["event-1"])

    def test_no_material_delta_suppresses_duplicate_work(self):
        result = evaluate({"signal": 1}, {"signal": 1}, False)
        self.assertEqual(result, {"decision": "NO_MATERIAL_DELTA", "next_state": "WAIT_SIGNAL", "duplicate_work": 0})

    def test_local_blocker(self):
        self.assertEqual(evaluate({}, {"new": 1}, True, local_blocker="missing local input")["decision"], "BLOCKED_LOCAL")

    def test_authority_gate_and_explicit_grant(self):
        self.assertEqual(evaluate({}, {"new": 1}, True, authority_effect="PUBLIC")["decision"], "AUTHORITY_GATE")
        with self.assertRaises(PermissionError): transition(self.instance("AUTHORITY_GATE"), "authority_granted", "1")
        self.assertEqual(transition(self.instance("AUTHORITY_GATE"), "authority_granted", "1", True)["state"], "FOUNDATION")

    def test_candidate_done_live_are_distinct(self):
        schema = json.loads((ROOT / "LOOP_BLUEPRINT_SCHEMA.json").read_text())
        self.assertEqual(schema["properties"]["lifecycle"]["enum"], ["CANDIDATE", "DONE", "LIVE"])
        self.assertNotIn("DONE", schema["properties"]["state"]["enum"])

    def test_template_contract_sections(self):
        template = json.loads((ROOT / "LOOP_INSTANCE_TEMPLATE.json").read_text())
        required = json.loads((ROOT / "LOOP_BLUEPRINT_SCHEMA.json").read_text())["required"]
        self.assertTrue(set(required).issubset(template))
        self.assertEqual(template["canary_distribution"]["live_effect"], "NONE")
        self.assertEqual(template["learning"]["promotion"], "CANDIDATE_ONLY")

if __name__ == "__main__": unittest.main()
