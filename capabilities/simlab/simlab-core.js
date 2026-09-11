'use strict';

const crypto = require('node:crypto');

const VERDICTS = Object.freeze({ PASS: 'PASS', FAIL: 'FAIL', UNKNOWN: 'UNKNOWN' });
const OPS = new Set(['EQUALS', 'TYPE', 'INCLUDES']);

function object(value) { return value && typeof value === 'object' && !Array.isArray(value); }
function fail(code) { const error = new Error(code); error.code = code; throw error; }
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (object(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
function digest(value) { return crypto.createHash('sha256').update(canonical(value)).digest('hex'); }
function clone(value) { return structuredClone(value); }
function get(value, path) {
  let current = value;
  for (const key of String(path).split('.')) {
    if (current === null || current === undefined || !Object.prototype.hasOwnProperty.call(current, key)) return undefined;
    current = current[key];
  }
  return current;
}
function equal(a, b) { return canonical(a) === canonical(b); }

function validatePack(pack) {
  if (!object(pack) || pack.schema !== 'pai-simpack/v1' || pack.syntheticOnly !== true) fail('SIMPACK_INVALID');
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(pack.packId || '') || typeof pack.version !== 'string') fail('SIMPACK_IDENTITY_INVALID');
  if (!Array.isArray(pack.properties) || !pack.properties.length || !Array.isArray(pack.scenarios) || !pack.scenarios.length) fail('SIMPACK_CONTENT_REQUIRED');
  const propertyIds = new Set();
  for (const property of pack.properties) {
    if (!object(property) || !/^[A-Za-z0-9._:-]+$/.test(property.id || '') || propertyIds.has(property.id)) fail('PROPERTY_INVALID');
    propertyIds.add(property.id);
    if (typeof property.path !== 'string' || !property.path || !OPS.has(property.op) || !Object.prototype.hasOwnProperty.call(property, 'expected')) fail('PROPERTY_INVALID');
    if (property.required !== undefined && typeof property.required !== 'boolean') fail('PROPERTY_INVALID');
  }
  const scenarioIds = new Set();
  for (const scenario of pack.scenarios) {
    if (!object(scenario) || !/^[A-Za-z0-9._:-]+$/.test(scenario.id || '') || scenarioIds.has(scenario.id) || scenario.synthetic !== true || !object(scenario.input)) fail('SCENARIO_INVALID');
    scenarioIds.add(scenario.id);
  }
  return clone(pack);
}

function checkProperty(output, property) {
  const value = get(output, property.path);
  const base = { propertyId: property.id, required: property.required !== false, op: property.op, path: property.path };
  if (value === undefined) return { ...base, verdict: VERDICTS.UNKNOWN, code: 'PATH_MISSING' };
  if (property.op === 'EQUALS') {
    const pass = equal(value, property.expected);
    return { ...base, verdict: pass ? VERDICTS.PASS : VERDICTS.FAIL, code: pass ? 'MATCH' : 'VALUE_MISMATCH' };
  }
  if (property.op === 'TYPE') {
    const actual = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
    const pass = actual === property.expected;
    return { ...base, verdict: pass ? VERDICTS.PASS : VERDICTS.FAIL, code: pass ? 'TYPE_MATCH' : 'TYPE_MISMATCH' };
  }
  if (property.op === 'INCLUDES') {
    const pass = Array.isArray(value) ? value.some((item) => equal(item, property.expected)) : typeof value === 'string' && value.includes(String(property.expected));
    return { ...base, verdict: pass ? VERDICTS.PASS : VERDICTS.FAIL, code: pass ? 'INCLUDES_MATCH' : 'INCLUDES_MISSING' };
  }
  return { ...base, verdict: VERDICTS.UNKNOWN, code: 'OP_UNSUPPORTED' };
}

function runScenario(pack, subject, scenario) {
  let output;
  try {
    output = subject(clone(scenario.input));
    if (output && typeof output.then === 'function') return { id: scenario.id, seed: scenario.seed || null, verdict: VERDICTS.UNKNOWN, code: 'ASYNC_SUBJECT_UNSUPPORTED', checks: [] };
  } catch (error) {
    return { id: scenario.id, seed: scenario.seed || null, verdict: VERDICTS.UNKNOWN, code: 'SUBJECT_ERROR', checks: [] };
  }
  const checks = [...pack.properties].sort((a, b) => a.id.localeCompare(b.id)).map((property) => checkProperty(output, property));
  const required = checks.filter((check) => check.required);
  const verdict = required.some((check) => check.verdict === VERDICTS.FAIL) ? VERDICTS.FAIL : required.some((check) => check.verdict === VERDICTS.UNKNOWN) ? VERDICTS.UNKNOWN : VERDICTS.PASS;
  return { id: scenario.id, seed: scenario.seed || null, verdict, checks, outputDigest: digest(output) };
}

function runSimPack(inputPack, subject) {
  const pack = validatePack(inputPack);
  if (typeof subject !== 'function') fail('SUBJECT_REQUIRED');
  const scenarios = [...pack.scenarios].sort((a, b) => a.id.localeCompare(b.id)).map((scenario) => runScenario(pack, subject, scenario));
  const verdict = scenarios.some((scenario) => scenario.verdict === VERDICTS.FAIL) ? VERDICTS.FAIL : scenarios.some((scenario) => scenario.verdict === VERDICTS.UNKNOWN) ? VERDICTS.UNKNOWN : VERDICTS.PASS;
  const result = {
    schema: 'pai-simlab-result/v1',
    packId: pack.packId,
    packVersion: pack.version,
    verdict,
    simulationOnly: true,
    syntheticOnly: true,
    productionReady: false,
    liveProven: false,
    formalProof: false,
    authority: { runtime: 'NONE', writer: 'NONE', promotion: 'NONE' },
    scenarios
  };
  return Object.freeze({ result: clone(result), canonical: canonical(result), sha256: digest(result) });
}

function replayDigest(pack, subject, iterations = 1000) {
  if (!Number.isSafeInteger(iterations) || iterations < 1 || iterations > 10000) fail('ITERATIONS_INVALID');
  const digests = new Set();
  for (let i = 0; i < iterations; i += 1) digests.add(runSimPack(pack, subject).sha256);
  return { iterations, uniqueDigests: digests.size, digests: [...digests].sort() };
}

function minimizeCounterexample(inputPack, subject, scenarioId) {
  const pack = validatePack(inputPack);
  const scenario = pack.scenarios.find((item) => item.id === scenarioId);
  if (!scenario) fail('SCENARIO_NOT_FOUND');
  const original = runScenario(pack, subject, scenario);
  if (original.verdict !== VERDICTS.FAIL) return { schema: 'pai-simlab-counterexample/v1', status: 'NOT_APPLICABLE', scenarioId, originalVerdict: original.verdict };
  if (!Array.isArray(scenario.input.sequence)) return { schema: 'pai-simlab-counterexample/v1', status: 'UNSUPPORTED_SHRINK_SHAPE', scenarioId, originalVerdict: original.verdict };
  let sequence = clone(scenario.input.sequence);
  let changed = true;
  while (changed && sequence.length > 1) {
    changed = false;
    for (let index = 0; index < sequence.length; index += 1) {
      const trial = sequence.slice(0, index).concat(sequence.slice(index + 1));
      if (!trial.length) continue;
      const trialScenario = clone(scenario);
      trialScenario.input.sequence = trial;
      if (runScenario(pack, subject, trialScenario).verdict === VERDICTS.FAIL) {
        sequence = trial;
        changed = true;
        break;
      }
    }
  }
  const minimizedInput = clone(scenario.input);
  minimizedInput.sequence = sequence;
  const counterexample = {
    schema: 'pai-simlab-counterexample/v1',
    status: 'MINIMIZED_REPRODUCIBLE_FAILURE',
    packId: pack.packId,
    packVersion: pack.version,
    scenarioId,
    originalLength: scenario.input.sequence.length,
    minimizedLength: sequence.length,
    input: minimizedInput,
    verdict: VERDICTS.FAIL,
    simulationOnly: true,
    productionReady: false
  };
  return Object.freeze({ ...counterexample, counterexampleId: digest(counterexample).slice(0, 24), sha256: digest(counterexample) });
}

module.exports = { VERDICTS, runSimPack, replayDigest, minimizeCounterexample };
