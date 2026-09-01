import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { buildClaudeInvocation, parseClaudeJson } from '../src/index.ts';

const discovery = { adapterId: 'anthropic-claude-code' as const, state: 'DISCOVERED' as const, executablePath: resolve('claude-fixture'), cliVersion: '2.test', detail: null };

function request(overrides = {}) {
  return { adapterId: 'anthropic-claude-code' as const, cwd: resolve('.'), prompt: 'make the bounded change', posture: 'WRITE' as const, configurationPosture: 'CONTROLLED_BARE' as const, ...overrides };
}

test('Claude requires an explicit controlled configuration posture', () => {
  assert.throws(() => buildClaudeInvocation({ ...request(), configurationPosture: undefined }, discovery), /requires explicit/);
});

test('Claude controlled bare invocation is headless and machine-readable', () => {
  const plan = buildClaudeInvocation(request({ model: 'claude-test', maxTurns: 3, maxBudgetUsd: 1.25 }), discovery);
  assert.deepEqual(plan.args.slice(0, 4), ['-p', 'make the bounded change', '--output-format', 'json']);
  assert.ok(plan.args.includes('--bare'));
  assert.equal(plan.args[plan.args.indexOf('--model') + 1], 'claude-test');
  assert.equal(plan.args[plan.args.indexOf('--max-turns') + 1], '3');
  assert.equal(plan.args[plan.args.indexOf('--max-budget-usd') + 1], '1.25');
  assert.ok(!plan.args.includes('--dangerously-skip-permissions'));
  assert.ok(!plan.args.includes('bypassPermissions'));
});

test('Claude controlled standard constrains ambient setting and MCP sources', () => {
  const plan = buildClaudeInvocation(request({ configurationPosture: 'CONTROLLED_STANDARD' }), discovery);
  assert.ok(plan.args.includes('--setting-sources'));
  assert.equal(plan.args[plan.args.indexOf('--setting-sources') + 1], '');
  assert.ok(plan.args.includes('--strict-mcp-config'));
  assert.ok(!plan.args.includes('--bare'));
});

test('Claude read-only uses plan mode and read-only tool set without write tools', () => {
  const plan = buildClaudeInvocation(request({ posture: 'READ_ONLY' }), discovery);
  assert.equal(plan.args[plan.args.indexOf('--permission-mode') + 1], 'plan');
  const tools = plan.args[plan.args.indexOf('--tools') + 1];
  assert.equal(tools, 'Read,Glob,Grep');
  assert.equal(tools?.includes('Write'), false);
  assert.equal(tools?.includes('Edit'), false);
});

test('Claude provider selection fails closed', () => {
  assert.throws(() => buildClaudeInvocation(request({ provider: 'bedrock' }), discovery), /provider selection/);
});

test('Claude parser captures structured success and session id', () => {
  const parsed = parseClaudeJson(JSON.stringify({ type: 'result', subtype: 'success', is_error: false, result: 'done', session_id: 'session-1' }));
  assert.equal(parsed.invalid, false);
  assert.equal(parsed.providerFailed, false);
  assert.equal(parsed.finalMessage, 'done');
  assert.equal(parsed.sessionId, 'session-1');
});

test('Claude parser fails closed on malformed, error, or missing final result', () => {
  assert.equal(parseClaudeJson('{bad').invalid, true);
  assert.equal(parseClaudeJson(JSON.stringify({ type: 'result', is_error: true, result: 'failed' })).providerFailed, true);
  assert.equal(parseClaudeJson(JSON.stringify({ type: 'result', is_error: false })).finalMessage, null);
});
