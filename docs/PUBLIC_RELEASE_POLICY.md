# PAI Public Release Policy

PAI publishes on **qualification**, not on a daily content quota.

## Release loop

```text
VERIFIED RESULT / QUALIFIED ASSET
→ value + duplicate check
→ product/capability mapping
→ public disclosure classification
→ sanitize privacy / secrets / rights / proprietary detail
→ package + version + provenance
→ focused tests + clean-consumer checks
→ independent QA when required
→ release authority classification
→ GitHub release/write
→ release receipt + public readback
→ optional portfolio/media derivatives
→ feedback as non-authoritative learning signal
```

If no material asset qualifies, the correct outcome is `NO_MATERIAL_DELTA` and nothing is published.

## Publication classes

### AUTO_RELEASE

Eligible only after the asset family has a proven release canary and bounded policy authorization.

Typical examples:

- documentation/catalog/index changes from already-public material;
- examples and synthetic fixtures derived only from public-safe sources;
- PATCH changes to an already approved component when API/state/lifecycle, permissions, dependency class, license and claim boundary do not materially change.

### AUTO_RELEASE_AFTER_IQA

Requires independent QA and clean-consumer evidence before release.

Typical examples:

- Skills;
- W_Flows/workflows;
- Patterns;
- SimPacks or synthetic Labs;
- bounded case studies;
- MINOR releases of an already approved public capability family.

### HUMAN_GATE

Requires an explicit human/founder decision for the exact scope.

Examples:

- MAJOR/breaking releases;
- a new Product or product-defining contract;
- software/content license strategy changes;
- pricing, payment, commercial or legal commitments;
- credentials, trust roots or security-sensitive disclosure;
- customer/company/private/proprietary data;
- public statements represented as a personal position;
- destructive or irreversible actions.

### REJECT_AUTO

Must not be automatically published.

Examples:

- raw AI output;
- raw operational logs or private HANDOFF/Result payloads;
- credentials, secrets or internal paths/host identities;
- Protected Core source or proprietary evaluation/failure intelligence;
- third-party material without clear publication rights;
- unfinished products presented as supported releases.

## Minimum public asset contract

A release candidate should declare, where applicable:

- `asset_id`;
- asset class and product/capability family;
- semantic version or explicit document revision;
- source/provenance reference;
- tested claim boundary;
- unsupported claims;
- privacy/secrets/rights status;
- dependency and compatibility information;
- tests and independent review status;
- rollback/supersession path;
- public release identity/readback.

## GitHub ownership

`PAI_RELEASE_OWNER` is the single logical writer role for accepted public GitHub promotion. Builders create candidates; assurance verifies them; release ownership performs the bounded public write. The role is not a new scheduler, queue, database, authority service or control plane.

## Website and media synchronization

GitHub is the canonical public technical/package/evidence source. Website and media surfaces are derivatives of an accepted release identity.

A website, article, image or video failure does not invalidate a correct GitHub release unless it falsifies the release claim itself.

## Software licensing boundary

Public documentation or evidence licensing does not silently license future software. Each software family must carry an explicit approved software license before it is represented as an openly reusable software package.
