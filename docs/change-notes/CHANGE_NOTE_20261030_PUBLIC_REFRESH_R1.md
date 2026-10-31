# CHANGE NOTE - 2026-10-30 - PUBLIC REFRESH R1

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
  maturity section updated (SimLab internal R7 in daily use; public pilot
  boundary unchanged).
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

## Evidence
- Current-state sources are internal records of the operating system: the
  2026-10-30 tools audit and inventory draft, the handoff-system research and
  its repo-gap follow-up (naming lock, W_Flow, brief-to-result loop), the
  SimLab R7 / Sim Studio reviews, the Mission Framework cycle-1 live proof
  (2026-10-30) and the moat standard v0.3 lock record.
- Independent review and the house release gate are pending. The local
  repository check returned PUBLIC_INTEGRITY_PASS; CI is configured to run
  the check on pull requests and pushes to main.

## Rollback
- Before commit, rollback means restoring the five edited tracked files to
  the baseline and removing this new change note. After commit, the refresh
  can be reverted with git revert. No existing files are deleted; superseded
  tracked text remains in git history.
