'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { runSimPack, minimizeCounterexample } = require('../simlab-core');

const pack = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'simpacks', 'duplicate-event-v1.json'), 'utf8'));
const subject = ({ sequence }) => {
  const acceptedIds = [...sequence];
  return { acceptedIds, duplicateCount: acceptedIds.length - new Set(acceptedIds).size };
};

console.log(runSimPack(pack, subject).result);
console.log(minimizeCounterexample(pack, subject, 'duplicate-event'));
