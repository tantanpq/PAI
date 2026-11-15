'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);

test('public package inventories link every executable capability', () => {
  const packages = fs.readdirSync(path.join(root, 'capabilities')).filter(dir =>
    ['package.json', 'pyproject.toml'].some(manifest => fs.existsSync(path.join(root, 'capabilities', dir, manifest))));
  for (const file of ['README.md', 'PORTFOLIO.md', 'FOUNDER.md', 'VISION.md', 'docs/QUICKSTART.md', 'capabilities/README.md']) {
    const links = [...read(file).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map(match => path.resolve(root, path.dirname(file), match[1]));
    for (const pkg of packages) {
      const dir = path.join(root, 'capabilities', pkg);
      assert.ok(links.some(link => link === dir || link.startsWith(dir + path.sep)), `${file}: missing capability link for ${pkg}`);
    }
  }
});

test('current documentation does not present private operation as a verified result', () => {
  const unsupported = /\b(?:live internally|in daily (?:internal |operational )?use|first full (?:live |internal )?(?:cycle|case) (?:passed|completed)|evidence gates passed internally)\b/i;
  for (const file of ['README.md', 'PORTFOLIO.md', 'ROADMAP.md', 'docs/ARCHITECTURE.md']) {
    assert.ok(!unsupported.test(read(file)), `${file}: private operational result without public implementation`);
  }
});

test('external narratives and provenance do not supply unavailable test totals', () => {
  const external = tracked.filter(file => file.endsWith('.md') && (
    file.startsWith('case-studies/') || file.startsWith('demos/') || file.endsWith('/PROVENANCE.md') ||
    file === 'catalog/migrations/test-environment-isolation-r1.md' ||
    file === 'catalog/migrations/security-admission-demo-r1.md' ||
    file === 'docs/receipts/CYCLE1_QUICKSTART_ALIGN.md'));
  for (const file of external) {
    assert.ok(!/\b\d+\/\d+\b/.test(read(file)), `${file}: test total without a local suite`);
  }
});

test('benchmark report contains only locally reproducible measurements', () => {
  const report = JSON.parse(execFileSync(process.execPath, ['capabilities/context/benchmark.js'], { cwd: root, encoding: 'utf8' }));
  assert.equal(report.status, 'CONTEXT_BENCHMARK_PASS');
  assert.equal(report.iterations, 1000);
  assert.equal(report.uniqueSha256, 1);
  assert.ok(!/p95|campaign|\d+(?:\.\d+)?%/i.test(report.provenanceNote || ''), 'benchmark embeds an unavailable private measurement');
});

test('tracked text excludes personal paths, private hosts, addresses and contact emails', () => {
  const patterns = [
    /[A-Z]:[\\/]+Users[\\/]+[^\s<>`"']+/i,
    /\b100(?:\.\d{1,3}){3}\b/,
    /\b(?:[a-z0-9-]+\.)+(?:ts\.net|local|internal|lan)\b/i
  ];
  const candidates = [...new Set([...tracked, '.gitattributes', 'scripts/public-claims.test.js'])];
  for (const file of candidates) {
    const text = read(file);
    assert.ok(!patterns.some(pattern => pattern.test(text)), `${file}: personal or private location`);
    const emails = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
    assert.ok(emails.every(email => email.toLowerCase().includes('noreply')), `${file}: contact email`);
  }
});
