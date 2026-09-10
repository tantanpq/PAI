# W_Flow

**Status:** `PACKAGE_CANDIDATE`

W_Flow is PAI's public direction for reusable, resumable work loops whose state transitions and evidence can be inspected instead of hidden inside a long prompt or provider-specific automation.

## Problem

Many AI workflows are easy to start and hard to resume, replay, verify, or terminate cleanly. A retry can duplicate work, a local blocker can stall unrelated work, and an empty queue can be mistaken for completion.

W_Flow aims to make those semantics explicit.

## Intended public surface

- provider-neutral loop/state contract;
- deterministic transition harness;
- reusable loop instance template;
- seed and growth semantics;
- explicit `NO_MATERIAL_DELTA` termination;
- replay/idempotency checks;
- local-blocker containment;
- authority-gate examples;
- versioned package after license and clean-consumer gates.

## Available now

The [`Community Assurance Baseline`](../../workflows/community-assurance-baseline.md) is an example of a reusable bounded workflow already available in the Open Foundation.

## What remains protected

The public W_Flow package will not include private PAI Program compilation, Governor/RSM/Claim/Farm internals, private autonomous routing, proprietary customer workflows, credentials, or private operational state.

## Release gate

The internal W_Flow Loop Builder has verified replay/state-machine/portfolio evidence, but the public package still needs generic naming, standalone packaging, explicit software licensing, clean-consumer verification and independent QA.

Track packaging in [issue #2](https://github.com/tantanpq/PAI/issues/2).
