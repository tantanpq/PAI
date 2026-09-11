# PAI SimLab Core

**Status:** `PUBLIC PILOT 0.1.0`

SimLab Core is a small, dependency-free deterministic verification runner for **synthetic** scenarios. It exists because an AI saying “the fix looks right” is not evidence that the candidate actually satisfies a property.

## Problems it addresses

- a generated repair sounds plausible but has no reproducible test evidence;
- a missing observation is accidentally treated as success instead of `UNKNOWN`;
- a known-bad mutant survives because the evaluator is too weak;
- a failing scenario produces a large log instead of a small reproducible counterexample;
- repeated verification cannot prove it is replaying the same semantics.

## What the pilot provides

- explicit `PASS`, `FAIL`, and `UNKNOWN` evidence states;
- deterministic replay identity for frozen synthetic inputs;
- bounded `EQUALS`, `TYPE`, and `INCLUDES` property checks;
- known-good and known-bad synthetic fixtures;
- a simple deterministic sequence counterexample shrinker;
- one bundled public SimPack;
- no runtime, writer, or promotion authority.

## Install from a local checkout

```bash
npm install ./capabilities/simlab
```

The current public distribution is the GitHub source package in this repository. No npm-registry publication is claimed.

## Use

```js
const { runSimPack } = require('pai-simlab-core');

const pack = {
  schema: 'pai-simpack/v1', packId: 'example', version: '0.1.0', syntheticOnly: true,
  properties: [{ id: 'ok', path: 'ok', op: 'EQUALS', expected: true, required: true }],
  scenarios: [{ id: 's1', synthetic: true, input: { value: 1 } }]
};

const result = runSimPack(pack, ({ value }) => ({ ok: value === 1 }));
console.log(result.result.verdict); // PASS
```

Run `npm test`, `npm run benchmark`, `npm run qa`, or `npm run example` from this directory. See `SCHEMA.md` for the public contract, `PROVENANCE.md` for the protected-source boundary, and `RELEASE_RECEIPT.md` for accepted release evidence.

## Release evidence

The exact PR #19 package and the first post-merge public `main` revision both passed the public integrity workflow. The package evidence includes:

- public suite: **6/6 PASS**;
- deterministic benchmark: **1,000 replay iterations / 1 unique digest**;
- known-good fixture: `PASS`;
- known-bad duplicate mutant: `FAIL`;
- missing required evidence: `UNKNOWN`;
- failing duplicate sequence minimized from **3 events to 2** while preserving failure;
- `SIMLAB_PUBLIC_QA_PASS` with protected R7 filenames excluded;
- `npm pack` and clean temporary consumer install/use PASS;
- package result explicitly remains `productionReady=false`, `liveProven=false`, `formalProof=false`, authority `NONE`.

The protected R7 implementation was used only as a hash-verified design/evidence basis. Its runner, private property registry, advanced evaluators, application fixtures and failure intelligence are not distributed here.

## What it does not do

This pilot is not the protected PAI SimLab R7 runner, an autonomous repair engine, a production scheduler, a formal prover, a security certification system, or evidence that real services behave like synthetic fixtures. Advanced evaluators, private failure corpora, property intelligence and repair selection remain protected.

Real operating-system, service, network, provider or production claims still require bounded real canary evidence outside this package. `PUBLIC PILOT` means the bounded package is openly usable and reproducible; it does **not** mean SimLab is a generally live-proven production platform.

License: Apache-2.0. PAI trademarks and Protected Core remain reserved/excluded.
