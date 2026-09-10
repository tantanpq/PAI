# Context Kit

**Status:** `PACKAGE_CANDIDATE`

Context Kit is the public-facing direction for PAI's bounded context and continuity primitives.

## Problem

Long-running AI work often fails in two opposite ways: too much stale context is carried forever, or a fresh session loses the few facts and source references actually needed to continue safely.

Context Kit aims to make the handoff explicit and deterministic.

## Intended public surface

- deterministic Context Capsule compiler;
- provider-neutral context profiles/schema;
- precedence and deduplication rules;
- privacy/redaction and context-budget boundaries;
- stable source/pointer references;
- sample inputs/outputs;
- benchmark methodology;
- CLI/SDK packaging after license and clean-consumer gates.

## Available now

Use the [`Source-Only Resume Runbook`](../../runbooks/source-only-resume.md) for the durable-source/JIT-runtime pattern that underpins this capability family.

## What remains protected

The public package will not export private Personal continuity data, deep PAI Mind/Chief implementation, proprietary retrieval/ranking/routing/adaptation intelligence, private failure/evaluation corpora, credentials, or authority internals.

## Release gate

The internal deterministic Context Capsule implementation has verification evidence, but a reusable public software release still requires:

- sanitized package boundary;
- explicit software license;
- public manifest/version;
- clean-consumer verification;
- independent QA;
- benchmark results that do not overclaim token savings.

Track packaging in [issue #1](https://github.com/tantanpq/PAI/issues/1).
