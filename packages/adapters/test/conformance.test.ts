import test from 'node:test';
import assert from 'node:assert/strict';
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
  });
}

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

test('conformance record is exact-revision and detail bounded', () => {
  assert.throws(() => makeConformanceRecord({ source: 'REAL_CLI', adapterId: 'openai-codex-cli', delethosRevision: 'main', executablePath: null, cliVersion: null, platform: 'linux', arch: 'x64', caseId: 'discovery-version', outcome: 'UNAVAILABLE' }), /40-hex/);
  const value = record('REAL_CLI', 'linux', 'discovery-version');
  assert.equal(value.schema, 'delethos.adapter-conformance.candidate.1');
  assert.equal(value.detail?.includes('\n'), false);
});
