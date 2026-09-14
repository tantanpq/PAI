# Verified, but Not Activated

## Situation

A bounded release candidate had a verified source manifest, a reproducible candidate tree, broad passing tests, focused passing checks, and independent read-only QA. That was enough to call the package verified. It was deliberately not treated as evidence that the live runtime had changed.

## Approach

The release process kept two decisions separate.

First, package verification established that the candidate was the intended bounded artifact and that its tests and tree could be independently reproduced. Second, runtime activation remained behind a separate gate requiring a fresh health check, zero protected active work, drain-before-cutover, and active-pointer update last.

## Evidence

- Complete suite: **166/166 passed**.
- Focused suites: **24/24 passed**.
- Candidate tree: **171 entries** with matching independent fingerprint verification.
- Six bounded delta hashes were independently checked.
- Candidate and independent QA both reached terminal `DONE`.
- Final candidate state remained frozen and not installed.

## Value

The result demonstrates a useful reliability distinction: successful build and verification evidence can establish package integrity without silently granting permission to mutate a live system.

That makes three states independently auditable: package verified, runtime safe to activate, and activation actually performed.

## Boundary

This case study does not claim deployment success, production readiness, formal verification, or universal safety. Public material uses only sanitized result-level evidence and omits private implementation details.
