# Security Policy

PAI treats secrets, trust roots, customer/private evidence, protected evaluation material, and private execution internals as non-public by default.

## Please do not publish sensitive details in an issue

If you believe a public PAI asset exposes a credential, secret, private path/topology, customer/company information, protected source, or a security-sensitive implementation detail, do not paste the sensitive material into a public issue or pull request.

Use the repository owner's private contact channel available through the GitHub profile until a dedicated security-reporting channel is published.

## In-scope public concerns

Examples include:

- accidentally committed credentials or secrets;
- public files that expose material marked as Protected Core;
- unsafe examples that imply authorization to test third-party systems;
- path/scope escape in a published tool;
- release composition that includes files outside its declared public boundary;
- provenance or third-party-rights problems that create a security/trust concern.

## Evidence expectations

A useful report states the smallest reproducible boundary and avoids unnecessary private data.

When a repair is published, PAI aims to preserve:

- affected version/revision;
- bounded failure class;
- repair identity;
- regression/fail-closed checks;
- supersession status;
- remaining unknowns.

A security fix or passing test does not imply general security certification.
