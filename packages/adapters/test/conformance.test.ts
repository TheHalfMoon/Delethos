import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessGold, BASELINE_GOLD_CASES, makeConformanceRecord } from '../src/index.ts';

const sha = 'a'.repeat(40);
const emptyDiffDigest = '0'.repeat(64);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const runner = resolve(repoRoot, 'scripts/adapter-conformance.mjs');

function record(
  source: 'DETERMINISTIC_FIXTURE' | 'REAL_CLI',
  platform: 'linux' | 'macos' | 'windows',
  caseId: (typeof BASELINE_GOLD_CASES)[number],
  outcome: 'PASS' | 'FAIL' | 'UNAVAILABLE' | 'UNVERIFIED' = 'PASS',
  overrides: Partial<{
    delethosRevision: string;
    cliVersion: string | null;
    executablePath: string | null;
    refsUnchanged: boolean;
    adapterImplementationVersion: string;
  }> = {},
) {
  const missingBinary = caseId === 'missing-binary';
  const requestedPosture = caseId === 'missing-binary' || caseId === 'discovery-version' || caseId === 'platform-launch'
    ? null
    : 'WRITE' as const;
  return makeConformanceRecord({
    source,
    adapterImplementationVersion: overrides.adapterImplementationVersion ?? '0.0.0-candidate.1',
    adapterId: 'openai-codex-cli',
    delethosRevision: overrides.delethosRevision ?? sha,
    executablePath: overrides.executablePath ?? (missingBinary ? null : '/fixture/codex'),
    cliVersion: overrides.cliVersion ?? (missingBinary ? null : '0.test'),
    platform,
    arch: 'x64',
    caseId,
    requestedPosture,
    requestedModel: null,
    requestedProvider: null,
    outcome,
    detail: 'bounded\nfixture detail',
    facts: {
      adapterStatus: 'COMPLETED', processCause: 'EXITED', exitCode: 0,
      terminationStrategy: 'NONE', terminationAttempted: false, cleanupStatus: 'NOT_NEEDED',
      elapsedMs: 12, stdoutBytes: 7, stderrBytes: 0, retainedBytes: 7, outputTruncated: false,
      headUnchanged: true, refsUnchanged: overrides.refsUnchanged ?? true, worktreeDirty: false,
      markerObserved: null, finalMessagePresent: true, sessionId: null, observedModel: null,
      gitBaseBefore: sha, gitStatusAfter: '', gitDiffBytes: 0, gitDiffSha256: emptyDiffDigest,
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

test('mixed adapter implementation versions on one platform block Gold', () => {
  const records = ['linux', 'macos', 'windows'].flatMap((platform) => BASELINE_GOLD_CASES.map((caseId) => record('REAL_CLI', platform as 'linux' | 'macos' | 'windows', caseId)));
  const mixed = records.map((value) => value.platform === 'linux' && value.caseId === 'write-success' ? { ...value, adapterImplementationVersion: '0.0.0-candidate.2' } : value);
  const assessment = assessGold('openai-codex-cli', sha, mixed);
  assert.equal(assessment.eligible, false);
  assert.ok(assessment.missing.includes('linux:adapter-implementation-version-consistency'));
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

test('conformance record is exact-revision, implementation-bound, Git-fact carrying, bounded, and credential-redacted', () => {
  assert.throws(() => makeConformanceRecord({
    source: 'REAL_CLI', adapterImplementationVersion: 'candidate.1', adapterId: 'openai-codex-cli',
    delethosRevision: 'main', executablePath: null, cliVersion: null, platform: 'linux', arch: 'x64',
    caseId: 'discovery-version', requestedPosture: null, requestedModel: null, requestedProvider: null,
    outcome: 'UNAVAILABLE',
  }), /40-hex/);
  const value = makeConformanceRecord({
    ...record('REAL_CLI', 'linux', 'discovery-version'),
    detail: 'OPENAI_API_KEY=supersecret\nBearer abcdefghijklmnop',
    limitations: ['ANTHROPIC_API_KEY=othersecret'],
  });
  assert.equal(value.schema, 'delethos.adapter-conformance.candidate.3');
  assert.equal(value.adapterImplementationVersion, '0.0.0-candidate.1');
  assert.equal(value.detail?.includes('supersecret'), false);
  assert.equal(value.detail?.includes('abcdefghijklmnop'), false);
  assert.equal(value.limitations[0]?.includes('othersecret'), false);
  assert.equal(value.facts?.headUnchanged, true);
  assert.equal(value.facts?.refsUnchanged, true);
  assert.equal(value.facts?.gitBaseBefore, sha);
  assert.equal(value.facts?.gitDiffBytes, 0);
  assert.equal(value.facts?.gitDiffSha256, emptyDiffDigest);
});

test('real conformance runner requires an explicit output mode', () => {
  const result = spawnSync(process.execPath, [runner, '--adapter', 'codex', '--case', 'missing-binary'], {
    cwd: repoRoot, encoding: 'utf8', timeout: 30_000,
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /adapter, case, and output are required/);
});

test('real conformance runner requires explicit acknowledgement before write-capable cases', () => {
  const result = spawnSync(process.execPath, [runner, '--adapter', 'codex', '--case', 'write-success', '--output', 'stdout'], {
    cwd: repoRoot, encoding: 'utf8', timeout: 30_000,
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /requires explicit --ack-write acknowledgement/);
});

test('real conformance runner refuses evidence output inside canonical mutable work', () => {
  const target = resolve(repoRoot, `delethos-conformance-test-${process.pid}.json`);
  const result = spawnSync(process.execPath, [runner, '--adapter', 'codex', '--case', 'missing-binary', '--output', target], {
    cwd: repoRoot, encoding: 'utf8', timeout: 30_000,
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /must not target canonical Delethos mutable work/);
});

test('real conformance runner emits bounded candidate.3 evidence to stdout without vendor credentials for missing-binary', () => {
  const result = spawnSync(process.execPath, [runner, '--adapter', 'codex', '--case', 'missing-binary', '--output', 'stdout'], {
    cwd: repoRoot, encoding: 'utf8', timeout: 30_000,
  });
  assert.equal(result.status, 0, result.stderr);
  const recordValue = JSON.parse(result.stdout.trim()) as {
    schema: string; adapterImplementationVersion: string; caseId: string; source: string; outcome: string;
    executablePath: string | null; requestedPosture: string | null;
    facts: { headUnchanged: boolean; refsUnchanged: boolean; gitBaseBefore: string; gitDiffSha256: string };
  };
  assert.equal(recordValue.schema, 'delethos.adapter-conformance.candidate.3');
  assert.equal(recordValue.adapterImplementationVersion, '0.0.0-candidate.1');
  assert.equal(recordValue.caseId, 'missing-binary');
  assert.equal(recordValue.source, 'REAL_CLI');
  assert.equal(recordValue.outcome, 'PASS');
  assert.equal(recordValue.executablePath, null);
  assert.equal(recordValue.requestedPosture, null);
  assert.match(recordValue.facts.gitBaseBefore, /^[0-9a-f]{40}$/);
  assert.match(recordValue.facts.gitDiffSha256, /^[0-9a-f]{64}$/);
  assert.equal(recordValue.facts.headUnchanged, true);
  assert.equal(recordValue.facts.refsUnchanged, true);
});

test('real conformance runner can create a new evidence file outside canonical work and refuses overwrite', () => {
  const directory = mkdtempSync(join(tmpdir(), 'delethos-conformance-evidence-test-'));
  const target = join(directory, 'evidence.json');
  try {
    const first = spawnSync(process.execPath, [runner, '--adapter', 'codex', '--case', 'missing-binary', '--output', target], {
      cwd: repoRoot, encoding: 'utf8', timeout: 30_000,
    });
    assert.equal(first.status, 0, first.stderr);
    const value = JSON.parse(readFileSync(target, 'utf8')) as { schema: string; outcome: string };
    assert.equal(value.schema, 'delethos.adapter-conformance.candidate.3');
    assert.equal(value.outcome, 'PASS');

    const second = spawnSync(process.execPath, [runner, '--adapter', 'codex', '--case', 'missing-binary', '--output', target], {
      cwd: repoRoot, encoding: 'utf8', timeout: 30_000,
    });
    assert.equal(second.status, 2);
    assert.match(second.stderr, /must not already exist/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
