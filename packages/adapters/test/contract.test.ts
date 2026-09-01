import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import * as adapters from '../src/index.ts';
import { buildCodexInvocation, CODEX_DEFINITION, CLAUDE_DEFINITION, validateAdapterRunRequest } from '../src/index.ts';

function baseRequest(overrides = {}) {
  return {
    adapterId: 'openai-codex-cli' as const,
    cwd: resolve('.'),
    prompt: 'work',
    posture: 'WRITE' as const,
    environmentPolicy: { mode: 'INHERIT' as const },
    ...overrides,
  };
}

test('candidate capabilities begin unverified and public tier remains non-Gold', () => {
  for (const definition of [CODEX_DEFINITION, CLAUDE_DEFINITION]) {
    assert.equal(definition.tier, 'EXPERIMENTAL');
    assert.equal(definition.candidateStatus, 'QUALIFYING');
    assert.match(definition.implementationVersion, /^spec003-candidate\./);
    for (const [capability, status] of Object.entries(definition.capabilities)) {
      if (capability === 'turnLimit' || capability === 'budgetLimit') continue;
      assert.notEqual(status, 'SUPPORTED');
    }
  }
});

test('adapter requests fail closed on unauthorized, malformed, or nonexistent values', () => {
  const base = baseRequest();
  assert.doesNotThrow(() => validateAdapterRunRequest(base));
  assert.throws(() => validateAdapterRunRequest({ ...base, adapterId: 'other' as never }), /not authorized/);
  assert.throws(() => validateAdapterRunRequest({ ...base, cwd: 'relative' }), /absolute/);
  assert.throws(() => validateAdapterRunRequest({ ...base, cwd: resolve('definitely-missing-directory') }), /existing directory/);
  assert.throws(() => validateAdapterRunRequest({ ...base, prompt: '' }), /prompt/);
  assert.throws(() => validateAdapterRunRequest({ ...base, timeoutMs: 0 }), /timeoutMs/);
  assert.throws(() => validateAdapterRunRequest({ ...base, model: 'x\0y' }), /model/);
  assert.throws(() => validateAdapterRunRequest({ ...base, environmentPolicy: undefined as never }), /environmentPolicy/);
});

test('explicit environment policy rejects unsafe names and NUL values', () => {
  const base = baseRequest();
  assert.throws(() => validateAdapterRunRequest({ ...base, environmentPolicy: { mode: 'EXACT', values: { 'A=B': 'x' } } }), /environment keys/);
  assert.throws(() => validateAdapterRunRequest({ ...base, environmentPolicy: { mode: 'EXACT', values: { A: 'x\0y' } } }), /environment values/);
});

test('public Codex dispatch rejects unverified capabilities before launch, including model and session requests', () => {
  const discovery = { adapterId: 'openai-codex-cli' as const, state: 'DISCOVERED' as const, executablePath: process.execPath, cliVersion: process.version, detail: null };
  assert.throws(() => buildCodexInvocation(baseRequest(), discovery), /capability is UNVERIFIED/);
  assert.throws(() => buildCodexInvocation(baseRequest({ model: 'gpt-test' }), discovery), /capability is UNVERIFIED/);
  assert.throws(() => buildCodexInvocation(baseRequest({ sessionId: 'session-test' }), discovery), /capability is UNVERIFIED/);
});

test('public adapter SDK exports no commit, push, merge, or release authority', () => {
  const forbidden = Object.keys(adapters).filter((name) => /(?:commit|push|merge|release)/i.test(name));
  assert.deepEqual(forbidden, []);
});
