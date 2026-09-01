import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessGold, BASELINE_GOLD_CASES, makeConformanceRecord } from '../src/index.ts';

const sha = 'a'.repeat(40);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

function record(
  source: 'DETERMINISTIC_FIXTURE' | 'REAL_CLI',
  platform: 'linux' | 'macos' | 'windows',
  caseId: (typeof BASELINE_GOLD_CASES)[number],
  outcome: 'PASS' | 'FAIL' | 'UNAVAILABLE' | 'UNVERIFIED' = 'PASS',
  overrides: Partial<{ delethosRevision: string; cliVersion: string | null; executablePath: string | null; refsUnchanged: boolean }> = {},
) {
  const missingBinary = caseId === 'missing-binary';
  return makeConformanceRecord({
    source,
    adapterId: 'openai-codex-cli',
    delethosRevision: overrides.delethosRevision ?? sha,
    executablePath: overrides.executablePath ?? (missingBinary ? null : '/fixture/codex'),
    cliVersion: overrides.cliVersion ?? (missingBinary ? null : '0.test'),
    platform,
    arch: 'x64',
    caseId,
    outcome,
    detail: 'bounded\nfixture detail',
    facts: {
      adapterStatus: 'COMPLETED', processCause: 'EXITED', exitCode: 0,
      terminationStrategy: 'NONE', terminationAttempted: false, cleanupStatus: 'NOT_NEEDED',
      elapsedMs: 12, stdoutBytes: 7, stderrBytes: 0, retainedBytes: 7, outputTruncated: false,
      headUnchanged: true, refsUnchanged: overrides.refsUnchanged ?? true, worktreeDirty: false,
      markerObserved: null, finalMessagePresent: true,
    },
  });
}

test('baseline Gold gate includes required negative, stall, and dirty-precondition cases', () => {
  assert.ok(BASELINE_GOLD_CASES.includes('missing-binary'));
  assert.ok(BASELINE_GOLD_CASES.includes('stall'));
  assert.ok(BASELINE_GOLD_CASES.includes('dirty-precondition'));
});

test('fixture-only evidence cannot qualify Gold', () => {
  const records = ['linux', 'macos', 'windows'].flatMap((platform) => BASELINE_GOLD_CASES.map((caseId) => record('DETERMINISTIC_FIXTURE', platform as 'linux' | 'macos' | 'windows', caseId)));
  const assessment = assessGold('openai-codex-cli', sha, records);
  assert.equal(assessment.eligible, false);
  assert.ok(assessment.missing.includes('linux:cli-version'));
  assert.ok(assessment.missing.includes('windows:write-success'));
});

test('complete exact-revision real CLI evidence qualifies only the represented candidate surface', () => {
  const records = ['linux', 'macos', 'windows'].flatMap((platform) => BASELINE_GOLD_CASES.map((caseId) => record('REAL_CLI', platform as 'linux' | 'macos' | 'windows', caseId)));
  assert.deepEqual(assessGold('openai-codex-cli', sha, records), { eligible: true, missing: [] });
  assert.equal(assessGold('anthropic-claude-code', sha, records).eligible, false);
});

test('stale adapter revision cannot qualify Gold', () => {
  const records = ['linux', 'macos', 'windows'].flatMap((platform) => BASELINE_GOLD_CASES.map((caseId) => record('REAL_CLI', platform as 'linux' | 'macos' | 'windows', caseId)));
  const assessment = assessGold('openai-codex-cli', 'b'.repeat(40), records);
  assert.equal(assessment.eligible, false);
  assert.ok(assessment.missing.includes('linux:discovery-version'));
});

test('mixed CLI versions on one platform block Gold', () => {
  const records = ['linux', 'macos', 'windows'].flatMap((platform) => BASELINE_GOLD_CASES.map((caseId) => record('REAL_CLI', platform as 'linux' | 'macos' | 'windows', caseId)));
  const mixed = records.map((value) => value.platform === 'linux' && value.caseId === 'write-success' ? { ...value, cliVersion: '0.other' } : value);
  const assessment = assessGold('openai-codex-cli', sha, mixed);
  assert.equal(assessment.eligible, false);
  assert.ok(assessment.missing.includes('linux:cli-version-consistency'));
});

test('mutated Git refs block Gold even when cases claim PASS', () => {
  const records = ['linux', 'macos', 'windows'].flatMap((platform) => BASELINE_GOLD_CASES.map((caseId) => record('REAL_CLI', platform as 'linux' | 'macos' | 'windows', caseId, 'PASS', { refsUnchanged: !(platform === 'linux' && caseId === 'no-hidden-git-write') })));
  const assessment = assessGold('openai-codex-cli', sha, records);
  assert.equal(assessment.eligible, false);
  assert.ok(assessment.missing.includes('linux:no-hidden-git-write'));
});

test('one unavailable real case blocks Gold', () => {
  const records = ['linux', 'macos', 'windows'].flatMap((platform) => BASELINE_GOLD_CASES.map((caseId) => record('REAL_CLI', platform as 'linux' | 'macos' | 'windows', caseId, platform === 'windows' && caseId === 'write-success' ? 'UNAVAILABLE' : 'PASS')));
  const assessment = assessGold('openai-codex-cli', sha, records);
  assert.equal(assessment.eligible, false);
  assert.ok(assessment.missing.includes('windows:write-success'));
});

test('Gold assessment requires an exact expected revision', () => {
  assert.throws(() => assessGold('openai-codex-cli', 'main', []), /40-hex/);
});

test('conformance record is exact-revision, machine-fact carrying, and detail bounded', () => {
  assert.throws(() => makeConformanceRecord({ source: 'REAL_CLI', adapterId: 'openai-codex-cli', delethosRevision: 'main', executablePath: null, cliVersion: null, platform: 'linux', arch: 'x64', caseId: 'discovery-version', outcome: 'UNAVAILABLE' }), /40-hex/);
  const value = record('REAL_CLI', 'linux', 'discovery-version');
  assert.equal(value.schema, 'delethos.adapter-conformance.candidate.2');
  assert.equal(value.detail?.includes('\n'), false);
  assert.equal(value.facts?.headUnchanged, true);
  assert.equal(value.facts?.refsUnchanged, true);
  assert.equal(value.facts?.retainedBytes, 7);
});

test('real conformance runner is executable without vendor credentials for missing-binary negative path', () => {
  const result = spawnSync(process.execPath, [resolve(repoRoot, 'scripts/adapter-conformance.mjs'), '--adapter', 'codex', '--case', 'missing-binary'], {
    cwd: repoRoot, encoding: 'utf8', timeout: 30_000,
  });
  assert.equal(result.status, 0, result.stderr);
  const recordValue = JSON.parse(result.stdout.trim()) as { schema: string; caseId: string; source: string; outcome: string; executablePath: string | null; facts: { headUnchanged: boolean; refsUnchanged: boolean } };
  assert.equal(recordValue.schema, 'delethos.adapter-conformance.candidate.2');
  assert.equal(recordValue.caseId, 'missing-binary');
  assert.equal(recordValue.source, 'REAL_CLI');
  assert.equal(recordValue.outcome, 'PASS');
  assert.equal(recordValue.executablePath, null);
  assert.equal(recordValue.facts.headUnchanged, true);
  assert.equal(recordValue.facts.refsUnchanged, true);
});
