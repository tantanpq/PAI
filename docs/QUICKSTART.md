# PAI Open Foundation Quickstart

You do not need the private PAI system to use the public engineering patterns in this repository.

This quickstart gives three small, practical starting points.

## 1. Resume durable AI work without trusting chat memory

Use [`runbooks/source-only-resume.md`](../runbooks/source-only-resume.md).

Start with a small set of stable sources or pointers, verify their identity/schema, reconstruct only durable context, mark volatile runtime facts as unknown, then fetch the minimum current truth just-in-time.

Use this when:

- a task spans multiple chats or agents;
- cached summaries may be stale;
- the next action depends on authoritative sources rather than conversation history.

A successful resume proves bounded context reconstruction only. It does not prove current runtime health or grant effect authority.

## 2. Check whether a release changed only what it was supposed to change

Use [`skills/release-scope-integrity.md`](../skills/release-scope-integrity.md).

Pin the baseline, recompute the complete candidate delta, and compare every added/changed/removed file with the separately authorized change set.

This catches a useful class of false-green releases where focused tests pass but the package contains unrelated or missing composition changes.

See the bounded case study: [`case-studies/green-tests-wrong-release.md`](../case-studies/green-tests-wrong-release.md).

## 3. Run an evidence-first assurance review

Use [`workflows/community-assurance-baseline.md`](../workflows/community-assurance-baseline.md) with [`examples/assurance-intake.yaml`](../examples/assurance-intake.yaml).

The basic loop is:

```text
LOCK CLAIM
→ PIN INPUT/STATE
→ SEPARATE PASS / LIVE / DONE
→ SELECT DECISIVE POSITIVE + NEGATIVE CHECKS
→ RUN AND PRESERVE TERMINAL EVIDENCE
→ ADD INDEPENDENT REVIEW WHEN MATERIAL
→ PUBLISH ONLY THE BOUNDED LESSON
```

Use only systems you own or are authorized to evaluate.

## What to try next

- Context continuity: [`capabilities/context/`](../capabilities/context/)
- Resumable work loops: [`capabilities/wflow/`](../capabilities/wflow/)
- Deterministic verification: [`capabilities/simlab/`](../capabilities/simlab/)
- Portfolio/maturity map: [`../PORTFOLIO.md`](../PORTFOLIO.md)

The three software capability families are currently `PACKAGE_CANDIDATE`, not generally released software. Their code releases remain gated on packaging, clean-consumer verification, independent QA, and an explicit software-license decision.
