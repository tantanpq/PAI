'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { VERDICTS, runSimPack, replayDigest, minimizeCounterexample } = require('./simlab-core');

const pack = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'simpacks', 'duplicate-event-v1.json'), 'utf8'));
const duplicateCount = (values) => values.length - new Set(values).size;
const good = ({ sequence }) => { const acceptedIds = [...new Set(sequence)]; return { acceptedIds, duplicateCount: duplicateCount(acceptedIds) }; };
const mutant = ({ sequence }) => { const acceptedIds = [...sequence]; return { acceptedIds, duplicateCount: duplicateCount(acceptedIds) }; };
const unknown = () => ({ acceptedIds: [] });

test('known-good subject passes the synthetic SimPack', () => {
  const result = runSimPack(pack(), good);
  assert.equal(result.result.verdict, VERDICTS.PASS);
  assert.equal(result.result.scenarios.every((scenario) => scenario.verdict === VERDICTS.PASS), true);
});

test('known-bad duplicate mutant is rejected and produces a minimized reproducible counterexample', () => {
  const result = runSimPack(pack(), mutant);
  assert.equal(result.result.verdict, VERDICTS.FAIL);
  const counterexample = minimizeCounterexample(pack(), mutant, 'duplicate-event');
  assert.equal(counterexample.status, 'MINIMIZED_REPRODUCIBLE_FAILURE');
  assert.equal(counterexample.originalLength, 3);
  assert.equal(counterexample.minimizedLength, 2);
  assert.equal(new Set(counterexample.input.sequence).size, 1);
});

test('missing evidence stays UNKNOWN instead of becoming PASS', () => {
  const result = runSimPack(pack(), unknown);
  assert.equal(result.result.verdict, VERDICTS.UNKNOWN);
  assert.ok(result.result.scenarios.some((scenario) => scenario.verdict === VERDICTS.UNKNOWN));
});

test('replay is deterministic and scenario ordering does not change the result hash', () => {
  const a = pack();
  const b = pack(); b.scenarios.reverse();
  assert.equal(runSimPack(a, good).sha256, runSimPack(b, good).sha256);
  assert.equal(replayDigest(a, good, 100).uniqueDigests, 1);
});

test('malformed packs and unsupported property operators fail closed', () => {
  assert.throws(() => runSimPack({}, good), { code: 'SIMPACK_INVALID' });
  const bad = pack(); bad.properties[0].op = 'MODEL_JUDGE';
  assert.throws(() => runSimPack(bad, good), { code: 'PROPERTY_INVALID' });
});

test('the runner does not mutate pack input and cannot claim production readiness', () => {
  const input = pack(); const before = JSON.stringify(input); const result = runSimPack(input, good);
  assert.equal(JSON.stringify(input), before);
  assert.equal(result.result.simulationOnly, true);
  assert.equal(result.result.productionReady, false);
  assert.equal(result.result.liveProven, false);
  assert.equal(result.result.formalProof, false);
  assert.deepEqual(result.result.authority, { runtime: 'NONE', writer: 'NONE', promotion: 'NONE' });
});
