# Demo Outline: Incident Recurrence Without Retry Theater

1. Load a small synthetic incident corpus with one repeated high-severity failure.
2. Normalize the incident identity and show deterministic recurrence classification.
3. Generate four bounded candidates: regression, failure-injection, runbook and negative knowledge.
4. Attempt closure with no recurrence action and show the closure gate reject it.
5. Add a complete recurrence action and show the case become closure-eligible.
6. Demonstrate the alternate path with an explicit bounded, current, authorized residual-risk acceptance.
7. Show an expired or authority-less acceptance being rejected.
8. Keep an unrelated work item progressing to demonstrate cone-local blocking.
9. End at the certification gate: generated runbook candidate is not operational truth until independent solution certification.

Public-demo hygiene:
- no production logs;
- no credentials, host identities, private paths or internal release identifiers;
- no exploit instructions;
- no real customer or personal data;
- no claim beyond the verified component scope.
