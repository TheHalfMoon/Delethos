import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { buildClaudeInvocation, claudeSupportsRestricted, parseClaudeJson } from '../src/index.ts';

const discovery = { adapterId: 'anthropic-claude-code' as const, state: 'DISCOVERED' as const, executablePath: resolve('claude-fixture'), cliVersion: 'Claude Code 2.1.252', detail: null };

function request(overrides = {}) {
  return { adapterId: 'anthropic-claude-code' as const, cwd: resolve('.'), prompt: 'make the bounded change', posture: 'WRITE' as const, configurationPosture: 'CONTROLLED_BARE' as const, ...overrides };
}

test('Claude requires an explicit controlled configuration posture', () => {
  assert.throws(() => buildClaudeInvocation({ ...request(), configurationPosture: undefined }, discovery), /requires explicit/);
});

test('Claude controlled bare invocation is headless, machine-readable, and tool-bounded', () => {
  const plan = buildClaudeInvocation(request({ model: 'claude-test', maxTurns: 3, maxBudgetUsd: 1.25 }), discovery);
  assert.deepEqual(plan.args.slice(0, 4), ['-p', 'make the bounded change', '--output-format', 'json']);
  assert.ok(plan.args.includes('--bare'));
  assert.equal(plan.args[plan.args.indexOf('--tools') + 1], 'Read,Glob,Grep,Edit,Write');
  assert.equal(plan.args[plan.args.indexOf('--model') + 1], 'claude-test');
  assert.equal(plan.args[plan.args.indexOf('--max-turns') + 1], '3');
  assert.equal(plan.args[plan.args.indexOf('--max-budget-usd') + 1], '1.25');
  assert.ok(!plan.args.includes('--dangerously-skip-permissions'));
  assert.ok(!plan.args.includes('--allow-dangerously-skip-permissions'));
  assert.ok(!plan.args.includes('bypassPermissions'));
});

test('Claude controlled standard constrains ambient setting and MCP sources for writable runs', () => {
  const plan = buildClaudeInvocation(request({ configurationPosture: 'CONTROLLED_STANDARD' }), discovery);
  assert.ok(plan.args.includes('--setting-sources'));
  assert.equal(plan.args[plan.args.indexOf('--setting-sources') + 1], '');
  assert.ok(plan.args.includes('--strict-mcp-config'));
  assert.ok(!plan.args.includes('--bare'));
});

test('Claude read-only requires version-gated restricted mode and a read-only tool set', () => {
  assert.equal(claudeSupportsRestricted('Claude Code 2.1.247'), false);
  assert.equal(claudeSupportsRestricted('Claude Code 2.1.248'), true);
  assert.equal(claudeSupportsRestricted('2.2.0'), true);
  const plan = buildClaudeInvocation(request({ posture: 'READ_ONLY', configurationPosture: 'CONTROLLED_STANDARD' }), discovery);
  assert.ok(plan.args.includes('--restricted'));
  assert.equal(plan.args[plan.args.indexOf('--permission-mode') + 1], 'plan');
  assert.equal(plan.args[plan.args.indexOf('--tools') + 1], 'Read,Glob,Grep');
  assert.equal(plan.args[plan.args.indexOf('--disallowedTools') + 1], 'mcp__*');
  assert.ok(!plan.args.includes('--setting-sources'));
});

test('Claude read-only fails closed for old or unknown versions and bare posture', () => {
  const old = { ...discovery, cliVersion: 'Claude Code 2.1.247' };
  assert.throws(() => buildClaudeInvocation(request({ posture: 'READ_ONLY', configurationPosture: 'CONTROLLED_STANDARD' }), old), /2\.1\.248/);
  assert.throws(() => buildClaudeInvocation(request({ posture: 'READ_ONLY', configurationPosture: 'CONTROLLED_BARE' }), discovery), /CONTROLLED_STANDARD/);
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
