import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { buildCodexInvocation, parseCodexJsonl } from '../src/index.ts';

const discovery = { adapterId: 'openai-codex-cli' as const, state: 'DISCOVERED' as const, executablePath: resolve('codex-fixture'), cliVersion: 'codex-cli 0.test', detail: null };

function request(overrides = {}) {
  return { adapterId: 'openai-codex-cli' as const, cwd: resolve('.'), prompt: 'make the bounded change', posture: 'WRITE' as const, ...overrides };
}

test('Codex invocation is noninteractive JSONL, exact cwd, safe sandbox, and isolated', () => {
  const plan = buildCodexInvocation(request({ model: 'gpt-test' }), discovery);
  assert.equal(plan.executablePath, discovery.executablePath);
  assert.deepEqual(plan.args.slice(0, 2), ['exec', '--json']);
  assert.equal(plan.args[plan.args.indexOf('--cd') + 1], resolve('.'));
  assert.equal(plan.args[plan.args.indexOf('--sandbox') + 1], 'workspace-write');
  assert.ok(plan.args.includes('--ignore-user-config'));
  assert.ok(plan.args.includes('--ignore-rules'));
  assert.ok(plan.args.includes('--ephemeral'));
  assert.equal(plan.args[plan.args.indexOf('--model') + 1], 'gpt-test');
  assert.ok(!plan.args.some((arg) => arg.includes('dangerously-bypass') || arg === '--yolo'));
});

test('Codex read-only maps to explicit read-only sandbox', () => {
  const plan = buildCodexInvocation(request({ posture: 'READ_ONLY' }), discovery);
  assert.equal(plan.args[plan.args.indexOf('--sandbox') + 1], 'read-only');
});

test('Codex resume is explicit and non-ephemeral', () => {
  const plan = buildCodexInvocation(request({ sessionId: 'session-123' }), discovery);
  assert.ok(plan.args.includes('resume'));
  assert.ok(plan.args.includes('session-123'));
  assert.ok(!plan.args.includes('--ephemeral'));
});

test('Codex rejects unqualified provider selection', () => {
  assert.throws(() => buildCodexInvocation(request({ provider: 'other' }), discovery), /provider selection/);
});

test('Codex JSONL parser captures thread and final agent message', () => {
  const stdout = [
    JSON.stringify({ type: 'thread.started', thread_id: 'thread-1' }),
    JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'done' } }),
    JSON.stringify({ type: 'turn.completed' }),
  ].join('\n');
  const parsed = parseCodexJsonl(stdout);
  assert.equal(parsed.invalid, false);
  assert.equal(parsed.providerFailed, false);
  assert.equal(parsed.sessionId, 'thread-1');
  assert.equal(parsed.finalMessage, 'done');
});

test('Codex parser fails closed on malformed or missing final output', () => {
  assert.equal(parseCodexJsonl('{bad').invalid, true);
  assert.equal(parseCodexJsonl(JSON.stringify({ type: 'turn.completed' })).finalMessage, null);
  assert.equal(parseCodexJsonl(JSON.stringify({ type: 'turn.failed' })).providerFailed, true);
});
