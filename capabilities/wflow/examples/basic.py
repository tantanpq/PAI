from loop_harness import evaluate, transition

instance = {"state": "SEED", "lifecycle": "CANDIDATE"}
instance = transition(instance, "foundation_ready", "event-1")
instance = transition(instance, "canary_ready", "event-2")
print("candidate", instance)

print("no delta", evaluate({"signal": 1}, {"signal": 1}, False))
print("local blocker", evaluate({"signal": 1}, {"signal": 2}, True, local_blocker="missing local input"))
print("authority gate", evaluate({"signal": 1}, {"signal": 2}, True, authority_effect="PUBLIC"))
