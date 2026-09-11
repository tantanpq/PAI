"""Pure deterministic transition/evaluation harness for W_Flow Loop Blueprint R1."""
from copy import deepcopy
import hashlib
import json

STATES = ("SEED", "FOUNDATION", "ACTIVE_CANARY", "ACTIVE", "WAIT_SIGNAL", "BLOCKED_LOCAL", "AUTHORITY_GATE", "PAUSED", "RETIRED")
TRANSITIONS = {
    "SEED": {"foundation_ready": "FOUNDATION", "retire": "RETIRED"},
    "FOUNDATION": {"canary_ready": "ACTIVE_CANARY", "block_local": "BLOCKED_LOCAL", "authority_needed": "AUTHORITY_GATE", "pause": "PAUSED", "retire": "RETIRED"},
    "ACTIVE_CANARY": {"qa_pass": "ACTIVE", "no_material_delta": "WAIT_SIGNAL", "block_local": "BLOCKED_LOCAL", "authority_needed": "AUTHORITY_GATE", "pause": "PAUSED", "retire": "RETIRED"},
    "ACTIVE": {"cycle_accepted": "WAIT_SIGNAL", "no_material_delta": "WAIT_SIGNAL", "block_local": "BLOCKED_LOCAL", "authority_needed": "AUTHORITY_GATE", "pause": "PAUSED", "retire": "RETIRED"},
    "WAIT_SIGNAL": {"new_eligible_signal": "ACTIVE", "pause": "PAUSED", "retire": "RETIRED"},
    "BLOCKED_LOCAL": {"local_blocker_cleared": "FOUNDATION", "retire": "RETIRED"},
    "AUTHORITY_GATE": {"authority_granted": "FOUNDATION", "authority_denied": "PAUSED", "retire": "RETIRED"},
    "PAUSED": {"resume": "FOUNDATION", "retire": "RETIRED"},
    "RETIRED": {},
}

class InvalidTransition(ValueError): pass

def canonical_digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":")).encode()).hexdigest()

def transition(instance, event, event_id, authority_granted=False):
    """Return a new instance. Replayed event IDs are exact no-ops."""
    out = deepcopy(instance)
    applied = out.setdefault("runtime", {}).setdefault("applied_events", [])
    if event_id in applied:
        return out
    state = out["state"]
    if event == "authority_granted" and not authority_granted:
        raise PermissionError("authority gate requires explicit grant")
    try:
        target = TRANSITIONS[state][event]
    except KeyError as exc:
        raise InvalidTransition(f"invalid transition: {state} + {event}") from exc
    out["state"] = target
    applied.append(event_id)
    return out

def evaluate(previous_observation, current_observation, material_delta, local_blocker=None, authority_effect=None):
    """Evaluate eligibility without effects, giving safety gates precedence."""
    if local_blocker:
        return {"decision": "BLOCKED_LOCAL", "reason": local_blocker}
    if authority_effect:
        return {"decision": "AUTHORITY_GATE", "reason": authority_effect}
    same = canonical_digest(previous_observation) == canonical_digest(current_observation)
    if same and not material_delta:
        return {"decision": "NO_MATERIAL_DELTA", "next_state": "WAIT_SIGNAL", "duplicate_work": 0}
    return {"decision": "ELIGIBLE", "next_state": "ACTIVE"}
