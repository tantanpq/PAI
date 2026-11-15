# CHANGE NOTE - 2026-10-30 - PUBLIC REFRESH R1

> Historical change description only. Private operating-system sources, independent review and house-gate logs are not included or reproduced here. This note does not establish private operational or audit results. Current public claims are bounded to the included code and tests.

## Decision (founder-directed 2026-10-30)
- `tantanpq/PAI` is again the maintained public face of the Open Foundation. The
  2026-10-28 "historical snapshot" README notice is superseded; product and
  commercial surfaces remain at zlinegroup.us.
- Public documents are refreshed in place to match how the system actually runs
  today. No protected-core material is published by this change.

## Scope
- `README.md` - status notice replaced; product map updated (Zline Assurance
  naming; Mission Framework, CP family and verifiable outcome projection rows);
  canonical vocabulary and "What changed recently" sections added; repository
  layout block corrected to the actual tree; related public repositories listed;
  maturity section updated with a private SimLab description; public pilot
  boundary unchanged.
- `docs/ARCHITECTURE.md` - topology updated to the living systems; naming model
  replaced: the draft PORTFOLIO-to-EXECUTOR ladder was never adopted and is
  removed; the locked vocabulary (ONE PAI = MIND + BODY, program-scoped lock)
  now stands in its place.
- `PORTFOLIO.md` - "PAI Assurance" row renamed to Zline Assurance with current
  state; Mission Framework, CP family and verifiable-outcomes rows added;
  sibling public repositories linked.
- `skills/release-scope-integrity.md` - repaired a pre-existing dangling link: the receipt it pointed to lives in the evidence archive, so the link now targets that public archive copy. This restores the repository's own public-integrity check to PASS.
- `ROADMAP.md` - maintained-in-repo note replaces the 2026-09-18 Drive
  projection note; R5 carries the Zline Assurance public name; new R6 milestone
  records the living-systems state and this refresh.

## Evidence scope
- The original note referred to internal tools audits, handoff research, private
  verification studies, mission-cycle records and an outcome-standard record.
  These sources, private review logs and house-gate logs are not included here.
  No private operational or independent-audit result is established by this note.
- Historical public workflow reference: run `41164579342`, release commit
  `4ba4d3723d77cffba8e95a6110f3afaed4b354b7`. This is a recorded historical
  reference, not a substitute for running the current public workflow locally.

## Rollback
- Before commit, rollback means restoring the five edited tracked files to
  the baseline and removing this new change note. After commit, the refresh
  can be reverted with git revert. No existing files are deleted; superseded
  tracked text remains in git history.
