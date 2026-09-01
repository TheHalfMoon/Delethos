import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { assessGold, BASELINE_GOLD_CASES, makeConformanceRecord } from '../src/index.ts';

const sha = 'a'.repeat(40);

function record(source: 'DETERMINISTIC_FIXTURE' | 'REAL_CLI', platform: 'linux' | 'macos' | 'windows', caseId: (typeof BASELINE_GOLD_CASES)[number], outcome: 'PASS' | 'FAIL' | 'UNAVAILABLE' | 'UNVERIFIED' = 'PASS') {
  return makeConformanceRecord({
    source,
    adapterId: 'openai-codex-cli',
    delethosRevision: sha,
    executablePath: '/fixture/codex',
    cliVersion: '0.test',
    platform,
    arch: 'x64',
    caseId,
    outcome,
    detail: 'bounded\nfixture detail',
    facts: {
      adapterStatus: 'COMPLETED', processCause: 'EXITED', exitCode: 0,
      terminationStrategy: 'NONE', terminationAttempted: false, cleanupStatus: 'NOT_NEEDED',
      elapsedMs: 12, stdoutBytes: 7, stderrBytes: 0, retainedBytes: 7, outputTruncated: false,
      headUnchanged: true, worktreeDirty: false, markerObserved: null, finalMessagePresent: true,
    },
  });
}

test('baseline Gold gate includes required negative and dirty-precondition cases', () => {
  assert.ok(BASELINE_GOLD_CASES.includes('missing-binary'));
  assert.ok(BASELINE_GOLD_CASES.includes('dirty-precondition'));
});

test('fixture-only evidence cannot qualify Gold', () => {
  const records = ['linux', 'macos', 'windows'].flatMap((platform) => BASELINE_GOLD_CASES.map((caseId) => record('DETERMINISTIC_FIXTURE', platform as 'linux' | 'macos' | 'windows', caseId)));
  const assessment = assessGold('openai-codex-cli', records);
  assert.equal(assessment.eligible, false);
  assert.equal(assessment.missing.length, BASELINE_GOLD_CASES.length * 3);
});

test('complete real CLI evidence qualifies only the represented candidate surface', () => {
  const records = ['linux', 'macos', 'windows'].flatMap((platform) => BASELINE_GOLD_CASES.map((caseId) => record('REAL_CLI', platform as 'linux' | 'macos' | 'windows', caseId)));
  assert.deepEqual(assessGold('openai-codex-cli', records), { eligible: true, missing: [] });
  assert.equal(assessGold('anthropic-claude-code', records).eligible, false);
});

test('one unavailable real case blocks Gold', () => {
  const records = ['linux', 'macos', 'windows'].flatMap((platform) => BASELINE_GOLD_CASES.map((caseId) => record('REAL_CLI', platform as 'linux' | 'macos' | 'windows', caseId, platform === 'windows' && caseId === 'write-success' ? 'UNAVAILABLE' : 'PASS')));
  const assessment = assessGold('openai-codex-cli', records);
  assert.equal(assessment.eligible, false);
  assert.ok(assessment.missing.includes('windows:write-success'));
});

test('conformance record is exact-revision, machine-fact carrying, and detail bounded', () => {
  assert.throws(() => makeConformanceRecord({ source: 'REAL_CLI', adapterId: 'openai-codex-cli', delethosRevision: 'main', executablePath: null, cliVersion: null, platform: 'linux', arch: 'x64', caseId: 'discovery-version', outcome: 'UNAVAILABLE' }), /40-hex/);
  const value = record('REAL_CLI', 'linux', 'discovery-version');
  assert.equal(value.schema, 'delethos.adapter-conformance.candidate.2');
  assert.equal(value.detail?.includes('\n'), false);
  assert.equal(value.facts?.headUnchanged, true);
  assert.equal(value.facts?.retainedBytes, 7);
});

test('real conformance runner is executable without vendor credentials for missing-binary negative path', () => {
  const result = spawnSync(process.execPath, [resolve('scripts/adapter-conformance.mjs'), '--adapter', 'codex', '--case', 'missing-binary'], {
    cwd: resolve('.'), encoding: 'utf8', timeout: 30_000,
  });
  assert.equal(result.status, 0, result.stderr);
  const recordValue = JSON.parse(result.stdout.trim()) as { schema: string; caseId: string; source: string; outcome: string; executablePath: string | null; facts: { headUnchanged: boolean } };
  assert.equal(recordValue.schema, 'delethos.adapter-conformance.candidate.2');
  assert.equal(recordValue.caseId, 'missing-binary');
  assert.equal(recordValue.source, 'REAL_CLI');
  assert.equal(recordValue.outcome, 'PASS');
  assert.equal(recordValue.executablePath, null);
  assert.equal(recordValue.facts.headUnchanged, true);
});
