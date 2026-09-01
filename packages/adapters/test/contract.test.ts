import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { CODEX_DEFINITION, CLAUDE_DEFINITION, validateAdapterRunRequest } from '../src/index.ts';

test('candidate capabilities begin unverified', () => {
  for (const definition of [CODEX_DEFINITION, CLAUDE_DEFINITION]) {
    for (const status of Object.values(definition.capabilities)) assert.equal(status, 'UNVERIFIED');
  }
});

test('adapter requests fail closed on unauthorized or malformed values', () => {
  const base = { adapterId: 'openai-codex-cli' as const, cwd: resolve('.'), prompt: 'work', posture: 'WRITE' as const };
  assert.doesNotThrow(() => validateAdapterRunRequest(base));
  assert.throws(() => validateAdapterRunRequest({ ...base, adapterId: 'other' as never }), /not authorized/);
  assert.throws(() => validateAdapterRunRequest({ ...base, cwd: 'relative' }), /absolute/);
  assert.throws(() => validateAdapterRunRequest({ ...base, prompt: '' }), /prompt/);
  assert.throws(() => validateAdapterRunRequest({ ...base, timeoutMs: 0 }), /timeoutMs/);
  assert.throws(() => validateAdapterRunRequest({ ...base, model: 'x\0y' }), /model/);
});

test('environment validation rejects unsafe names and NUL values', () => {
  const base = { adapterId: 'openai-codex-cli' as const, cwd: resolve('.'), prompt: 'work', posture: 'WRITE' as const };
  assert.throws(() => validateAdapterRunRequest({ ...base, environment: { 'A=B': 'x' } }), /environment keys/);
  assert.throws(() => validateAdapterRunRequest({ ...base, environment: { A: 'x\0y' } }), /environment values/);
});
