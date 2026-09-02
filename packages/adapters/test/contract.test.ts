import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import * as adapters from '../src/index.ts';
import {
  buildCodexInvocation,
  buildOpenCodeInvocation,
  buildPiInvocation,
  CODEX_DEFINITION,
  CLAUDE_DEFINITION,
  OPENCODE_DEFINITION,
  PI_DEFINITION,
  validateAdapterRunRequest,
} from '../src/index.ts';

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

test('legacy candidates remain non-Gold and unpromoted', () => {
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

test('replacement Gold candidates begin selected but entirely unverified', () => {
  for (const definition of [PI_DEFINITION, OPENCODE_DEFINITION]) {
    assert.equal(definition.tier, 'EXPERIMENTAL');
    assert.equal(definition.candidateStatus, 'SELECTED_GOLD_CANDIDATE');
    assert.match(definition.implementationVersion, /^spec003-recovery\./);
    for (const status of Object.values(definition.capabilities)) assert.equal(status, 'UNVERIFIED');
  }
});

test('adapter requests accept only the four canonically authorized adapter identities and fail closed on malformed values', () => {
  for (const adapterId of ['openai-codex-cli', 'anthropic-claude-code', 'pi-coding-agent', 'opencode'] as const) {
    assert.doesNotThrow(() => validateAdapterRunRequest(baseRequest({ adapterId })));
  }
  const base = baseRequest();
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

test('public candidate dispatch rejects unverified capabilities before launch', () => {
  const codexDiscovery = { adapterId: 'openai-codex-cli' as const, state: 'DISCOVERED' as const, executablePath: process.execPath, cliVersion: process.version, detail: null };
  assert.throws(() => buildCodexInvocation(baseRequest(), codexDiscovery), /capability is UNVERIFIED/);
  assert.throws(() => buildCodexInvocation(baseRequest({ model: 'gpt-test' }), codexDiscovery), /capability is UNVERIFIED/);
  assert.throws(() => buildCodexInvocation(baseRequest({ sessionId: 'session-test' }), codexDiscovery), /capability is UNVERIFIED/);

  const piDiscovery = { adapterId: 'pi-coding-agent' as const, state: 'DISCOVERED' as const, executablePath: process.execPath, cliVersion: 'pi-coding-agent v0.84.4', detail: null };
  assert.throws(() => buildPiInvocation(baseRequest({ adapterId: 'pi-coding-agent' }), piDiscovery), /capability is UNVERIFIED/);

  const openCodeDiscovery = { adapterId: 'opencode' as const, state: 'DISCOVERED' as const, executablePath: process.execPath, cliVersion: '1.18.26', detail: null };
  assert.throws(() => buildOpenCodeInvocation(baseRequest({ adapterId: 'opencode' }), openCodeDiscovery), /capability is UNVERIFIED/);
});

test('public adapter SDK exports no commit, push, merge, or release authority', () => {
  const forbidden = Object.keys(adapters).filter((name) => /(?:commit|push|merge|release)/i.test(name));
  assert.deepEqual(forbidden, []);
});
