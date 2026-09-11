# PAI Vision

**PAI stands for Personal Assistant Intelligence.**

PAI is an attempt to build intelligence that belongs to the user and can stay useful across time, tools, devices and changing AI providers.

The long-term idea is simple to state and difficult to earn: an assistant should not behave like a chat window that starts over. It should be able to preserve the user's trajectory, understand current reality, continue useful work, learn from evidence, and act within explicit authority while leaving important decisions with the user.

## Why PAI exists

Today's AI systems are powerful, but most user experiences are still fragmented.

Useful context disappears between conversations. Work becomes tied to one model, one tool or one session. A model can produce a confident answer without proving that the intended result actually happened. Users repeatedly re-explain goals, reconstruct decisions, coordinate tools and check whether something was truly finished.

PAI is being built around a different premise:

> AI should reduce the user's burden of remembering, reconstructing, coordinating and rechecking work while increasing the user's capability, time, ownership and autonomy.

The goal is not to maximize agent count, model calls, tasks completed or artifacts produced. The goal is to help a person preserve intent, make better decisions, complete meaningful work and keep control of the intelligence working on their behalf.

## What PAI aims to become

A mature PAI should be able to:

- preserve continuity across conversations, providers and devices;
- maintain a grounded picture of goals, decisions, constraints and open loops;
- distinguish durable knowledge from temporary context and unverified model output;
- organize and continue bounded work without requiring the user to push every step;
- verify outcomes against evidence instead of treating generation as completion;
- learn from qualified results and make future work more effective;
- reuse skills, workflows and capabilities rather than rebuilding the same solution repeatedly;
- know when to **act, ask, wait or surface** based on authority, risk and missing truth;
- remain useful even as individual models, executors and infrastructure are replaced.

PAI is not intended to be a single model. Models are replaceable components. The durable value is the continuity, evidence, learning, capability and authority structure around them.

## Principles

### User-owned

The user remains the owner of intent, important decisions and final authority. PAI should make the user more capable, not make the user dependent on a single provider or opaque system.

### Continuity before novelty

An assistant that forgets what matters cannot become a reliable long-term partner. PAI treats continuity as a first-class capability rather than a convenience feature.

### Evidence before claims

Generated output is not the same as a verified result. PAI separates states such as planned, running, passed, released, live and done, and keeps public claims no stronger than the evidence behind them.

### Bounded autonomy

PAI should become increasingly proactive, but autonomy must remain inside explicit authority and effect boundaries. More autonomy without clearer ownership is not progress.

### Provider-neutral where practical

Models, tools and executors should be replaceable. Durable context, work semantics and evidence should not disappear because one provider changes.

### Local and private where it matters

Personal continuity and sensitive user intelligence should support user-controlled and local/private operation where appropriate. Public PAI intentionally excludes protected personal memory, credentials, customer evidence and private execution internals.

### Reuse before rebuild

A verified result should create reusable value when justified: a capability, Skill, W_Flow, Pack, pattern, benchmark, case study or product surface.

## Product direction

PAI is being developed in layers. Presence on this page is not a claim of product readiness.

### Available now — Open Foundation

- **Context Kit 0.1.0** — deterministic bounded context compilation and source-aware resume foundations.
- **W_Flow Core 0.1.0** — provider-neutral, replayable work-loop and state semantics.
- **SimLab Core 0.1.0 public pilot** — deterministic synthetic verification with explicit `PASS / FAIL / UNKNOWN`, replay identity and minimized counterexamples.
- Public Skills, workflows, runbooks, patterns, case studies and release-integrity methods.

These are independently usable public capability surfaces, not a public release of the complete private PAI system.

### Building toward — PAI Personal

**PAI Personal** is the central product direction: a user-owned assistant that can carry continuity across work, help reconstruct current reality, resume long-running objectives and support bounded action without forcing the user to restate everything in every session.

The intended product experience includes continuity, context compaction, portable state, evidence-backed completion, reusable capabilities and increasingly useful personal adaptation. A supported public PAI Personal product is **not released yet**.

### Building toward — PAI Assurance

**PAI Assurance** explores evidence-backed verification for AI-assisted work: proving what was tested, what actually changed, what remains unknown and whether the right thing shipped.

Public PAI already exposes bounded verification methods and SimLab foundations. Broader commercial service maturity, customer-specific execution and paid claims remain separately evidence-gated.

### Longer horizon

Longer-term directions may include:

- **PAI Work / Group** for team and shared-work continuity;
- professional and domain-specific intelligence;
- business and economic capabilities that help create measurable user value;
- richer private/local execution;
- physical-world and robotics capability only when safety, authority and maturity justify it.

These are directions, not promises of current availability.

## Open Foundation and Protected Core

PAI uses an Open Foundation / Protected Core model.

The public repository publishes reusable pieces that are independently understandable, rights-cleared, testable and safe to separate. Protected material remains private when it contains personal continuity intelligence, proprietary routing/adaptation, sensitive authority machinery, credentials, private evaluation corpora, customer evidence or other trust-sensitive implementation details.

The objective is not to publish every internal component. It is to make useful public building blocks available without destroying the privacy, safety or differentiated value of the complete system.

## What success looks like

PAI succeeds when users spend less effort re-explaining, re-coordinating and rechecking the same work, and gain more time, capability, useful assets and autonomy.

For the public project, success means that published capabilities work outside the original environment, carry clear provenance and boundaries, reproduce useful outcomes, attract corrections and reuse, and eventually produce real design-partner or commercial evidence.

Repository size, model count and agent count are not success metrics by themselves.

## Current boundary

PAI is an active engineering and product project. The public repository contains released foundation packages and a public pilot, while the complete Personal Assistant Intelligence experience remains under development.

PAI does not claim formal proof, security certification, zero defects, general production readiness for SimLab, or autonomous authority beyond explicitly bounded scopes.

For current public maturity and evidence, see [`PORTFOLIO.md`](PORTFOLIO.md), [`ROADMAP.md`](ROADMAP.md) and [`docs/BENCHMARKS.md`](docs/BENCHMARKS.md).
