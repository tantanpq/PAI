# CHANGE NOTE — 2026-10-09 — PUBLIC CONVERGENCE R1

## Decision (founder-approved 2026-10-09)
- `tantanpq/PAI` = canonical maintained public copy for all 10 overlapping assets.
- `tantanpq/pai-reliability-evidence` = historical archive. The 10 overlapping files keep
  their content and carry an archive header pointing at the PAI canonical copy. Nothing deleted.
- Google Drive = authoritative source for doctrine (PAI Mind, Continuity V1/V2, VISION,
  FOUNDER, ROADMAP, PRODUCT_READINESS). Repo copies are projections with pointers to Drive.
- PAI Continuity V1 is superseded by V2 (`SUPERSEDED_BY`); V1 archived, no duplicate content.

## Scope
- 10 overlapping paths merged: 8 provenance-footer-only, 2 byte-identical (kept as snapshots).
- 2 link restorations in PAI per founder decision:
  1. `skills/release-scope-integrity.md` — restored link to
     `../patterns/release-scope-integrity-receipt.md`.
  2. `workflows/community-assurance-baseline.md` — restored direct link to `ASSURANCE.md`.
- Line endings normalized to LF (content verified identical after CRLF strip).
- Doctrine sync: `PAI_CONTINUITY_V1.md`, `PAI_CONTINUITY_V2.md`,
  `RETRIEVAL_DOCTRINE_ADDENDUM.md` (applies to V2) uploaded to Drive as authoritative;
  `VISION.md` / `FOUNDER.md` / `ROADMAP.md` (2026-09-18) confirmed authoritative on Drive;
  `PRODUCT_READINESS_REOPEN_R1.md` — Drive version 2026-09-29 marked authoritative,
  4 older Drive versions moved to `archive/`.

## Evidence
- Audit: `workspace/pai-repo-hygiene/codex-analysis-2026-10-08.md`
- Plan: `workspace/pai-repo-hygiene/merge-sync-plan-20261009.md`
- Manifest: `catalog/overlap-manifest.yaml`

## Rollback
- All repo changes are regular commits (revertible via git).
- Evidence files preserved with archive headers — no deletions.
- Older Drive versions moved to `archive/` subfolder — movable back.
