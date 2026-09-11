'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { runSimPack, replayDigest, minimizeCounterexample } = require('./simlab-core');

const pack = JSON.parse(fs.readFileSync(path.join(__dirname, 'simpacks', 'duplicate-event-v1.json'), 'utf8'));
const duplicateCount = (values) => values.length - new Set(values).size;
const good = ({ sequence }) => { const acceptedIds = [...new Set(sequence)]; return { acceptedIds, duplicateCount: duplicateCount(acceptedIds) }; };
const mutant = ({ sequence }) => { const acceptedIds = [...sequence]; return { acceptedIds, duplicateCount: duplicateCount(acceptedIds) }; };
const unknown = () => ({ acceptedIds: [] });

const replay = replayDigest(pack, good, 1000);
const goodResult = runSimPack(pack, good);
const mutantResult = runSimPack(pack, mutant);
const unknownResult = runSimPack(pack, unknown);
const counterexample = minimizeCounterexample(pack, mutant, 'duplicate-event');

if (replay.uniqueDigests !== 1 || goodResult.result.verdict !== 'PASS' || mutantResult.result.verdict !== 'FAIL' || unknownResult.result.verdict !== 'UNKNOWN' || counterexample.minimizedLength !== 2) process.exit(1);

console.log(JSON.stringify({
  status: 'SIMLAB_BENCHMARK_PASS',
  iterations: replay.iterations,
  uniqueDigests: replay.uniqueDigests,
  knownGoodVerdict: goodResult.result.verdict,
  knownBadMutantVerdict: mutantResult.result.verdict,
  missingEvidenceVerdict: unknownResult.result.verdict,
  counterexampleOriginalLength: counterexample.originalLength,
  counterexampleMinimizedLength: counterexample.minimizedLength,
  syntheticOnly: true,
  note: 'Behavior benchmark only; no throughput, formal-proof, zero-defect, or production-readiness claim.'
}, null, 2));
