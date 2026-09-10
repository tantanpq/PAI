# Contributing to PAI

PAI welcomes corrections, reproducible examples, bounded verification patterns, synthetic fixtures, documentation improvements, and public-safe capability contributions.

## Good contributions

Useful contributions usually have a small, testable boundary:

- fix a documentation error with a source/reference;
- add a synthetic fixture that demonstrates one property;
- improve a reusable Skill or workflow;
- add a failing case plus a bounded repair;
- tighten a claim so it matches the available evidence;
- improve portability, deterministic replay, compatibility, or clean-consumer behavior.

## Before opening a PR

Please include:

- what problem the change solves;
- exact files/scope changed;
- what was tested;
- negative/fail-closed checks where relevant;
- unsupported claims or known limitations;
- provenance/rights for new material;
- whether the change affects API, state, lifecycle, permissions, dependencies, licensing or public claims.

## Protected/private material

Do not submit credentials, secrets, internal host paths, customer/company data, private PAI source, protected evaluation corpora, private failure intelligence, trust-root material, or other non-public PAI internals.

If you discover private or security-sensitive material in a public surface, do not reproduce it in a public issue. Follow `SECURITY.md`.

## Review philosophy

A large change is not automatically a better change. PAI prefers:

- root-seam fixes over retry layers;
- small decisive tests over decorative test volume;
- explicit `UNKNOWN` over invented evidence;
- reuse before a new framework;
- one clear mutable owner;
- public claims narrower than or equal to evidence.

Passing focused tests does not authorize unrelated composition changes. See [`skills/release-scope-integrity.md`](skills/release-scope-integrity.md).

## Licensing

Do not assume that public visibility alone grants a software license. Contributions that introduce reusable software must wait for the repository/component's explicit software licensing policy. Third-party material must carry clear rights and attribution.
