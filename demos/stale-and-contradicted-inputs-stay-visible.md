# Demo Outline: Stale and Contradicted Inputs Stay Visible

1. Create a small synthetic source set for goals, decisions, commitments, evidence, blockers, and next actions.
2. Mark one source VERIFIED, one STALE, and one CONTRADICTED, each with a last-verified timestamp.
3. Build a derived Current Picture and show all three states without silently promoting any of them to canonical truth.
4. Remove required provenance from one item and show validation reject it.
5. Attempt the same read with a mismatched principal, purpose, or data class and show fail-closed denial.
6. Correct one source-backed decision and recompute the view.
7. Show the displayed summary and projection hash change while the source record remains the source of truth.
8. Close and compact the synthetic view, then confirm conflict and reopen pointers remain available.
9. End at the boundary: the reader is read-only and the projection grants no canonical mutation authority.

Public-demo hygiene:
- synthetic fixtures only;
- no credentials, private hosts, internal paths, or production logs;
- no proprietary source code;
- no real customer or personal data;
- no exploit instructions;
- no claim beyond verified local projection behavior.
