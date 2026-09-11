# PAI public licensing

This repository uses a scoped licensing model so the Open Foundation can be genuinely reusable without licensing the protected PAI core by accident.

## Selected license scopes

| Material | License | Scope |
| --- | --- | --- |
| Original PAI software intentionally published in this repository | **Apache License 2.0** (`Apache-2.0`) | Public software source, package code, scripts, schemas or executable examples that are published as reusable software and do not declare a different license. |
| Original PAI public non-code material | **Creative Commons Attribution 4.0 International** (`CC-BY-4.0`) | Documentation, workflows, W_Flows/specifications, runbooks, Skills, patterns, case-study abstractions, synthetic educational material and other reusable authored content, unless a file or provenance record declares different terms. |
| Trademarks, names and branding | **Reserved** | No software/content license grants trademark, product-name, logo or endorsement rights except nominative use allowed by law and the underlying license. |
| Third-party or migrated material | **Upstream terms control** | The exact source/provenance record and per-file notice control. PAI cannot grant rights it does not own. |

## Apache-2.0 software rule

Published software that uses this scope should carry `SPDX-License-Identifier: Apache-2.0` where practical and must preserve required notices. Apache-2.0 was selected because it permits commercial and proprietary downstream use while also providing explicit patent-license and patent-termination language. It does **not** require disclosure of the separate private PAI core.

Official license text: <https://www.apache.org/licenses/LICENSE-2.0>

## CC-BY-4.0 content rule

Original public non-code material under this scope may be copied and adapted with attribution under CC BY 4.0. Attribution should identify PAI / the repository and retain any source or provenance notice supplied with the asset.

Official license text: <https://creativecommons.org/licenses/by/4.0/legalcode>

## Explicitly excluded

These public license scopes do not include, unless separately and explicitly released:

- `pai-core-private` or any unpublished PAI source;
- private PAI Mind/Chief implementation, proprietary continuity/routing/adaptation intelligence or authority machinery;
- customer, company, personal or otherwise private data/evidence;
- protected evaluation/failure corpora, proprietary repair intelligence or private benchmark material;
- credentials, trust roots or security-sensitive internals;
- third-party material beyond rights actually held;
- trademarks, logos or branding rights.

## Precedence

1. A specific per-file or per-package license/notice wins.
2. A catalog/provenance record that preserves an upstream license wins for migrated material.
3. Otherwise, the scoped defaults above apply only to material intentionally published in this public repository.

Changing the software or public-content license strategy is a founder/legal `HUMAN_GATE`, not an automated PATCH release.
