import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { buildPiConformanceInvocation, parsePiJsonl, PI_DEFINITION } from '../src/pi.ts';
import { makeConformanceRecord } from '../src/conformance.ts';

const discovery = {
  adapterId: 'pi-coding-agent' as const,
  state: 'DISCOVERED' as const,
  executablePath: resolve('pi-fixture'),
  cliVersion: 'pi-coding-agent v0.84.4',
  detail: null,
};

function isolatedEnvironment() {
  const values: Record<string, string> = {
    HOME: resolve('.pi-home'),
    PI_CODING_AGENT_DIR: resolve('.pi-agent-dir'),
  };
  if (process.platform === 'win32') values.USERPROFILE = resolve('.pi-userprofile');
  return values;
}

function request(overrides = {}) {
  return {
    adapterId: 'pi-coding-agent' as const,
    cwd: resolve('.'),
    prompt: 'make the bounded change',
    posture: 'WRITE' as const,
    environmentPolicy: { mode: 'EXACT' as const, values: isolatedEnvironment() },
    ...overrides,
  };
}

test('Pi recovery definition is selected but exposes no promoted capabilities', () => {
  assert.equal(PI_DEFINITION.candidateStatus, 'SELECTED_GOLD_CANDIDATE');
  assert.equal(PI_DEFINITION.tier, 'EXPERIMENTAL');
  assert.equal(PI_DEFINITION.commandName, 'pi');
  assert.deepEqual(PI_DEFINITION.versionArgs, ['--version']);
  for (const status of Object.values(PI_DEFINITION.capabilities)) assert.equal(status, 'UNVERIFIED');
});

test('Pi conformance invocation is machine-readable, sessionless, shell-free shaped, identity-explicit, and isolated', () => {
  const plan = buildPiConformanceInvocation(request({ provider: 'local-provider', model: 'model-id' }), discovery);
  assert.equal(plan.executablePath, discovery.executablePath);
  assert.deepEqual(plan.args.slice(0, 2), ['--mode', 'json']);
  assert.ok(plan.args.includes('--no-session'));
  assert.ok(plan.args.includes('--no-extensions'));
  assert.ok(plan.args.includes('--no-context-files'));
  assert.ok(plan.args.includes('--no-approve'));
  assert.equal(plan.args[plan.args.indexOf('--provider') + 1], 'local-provider');
  assert.equal(plan.args[plan.args.indexOf('--model') + 1], 'model-id');
  assert.equal(plan.args.at(-1), 'make the bounded change');
  assert.equal(plan.requestedProvider, 'local-provider');
  assert.equal(plan.requestedModel, 'model-id');
  assert.equal(plan.environment.mode, 'EXACT');
  if (plan.environment.mode !== 'EXACT') throw new Error('expected EXACT environment');
  assert.equal(plan.environment.values.PI_CODING_AGENT_DIR, resolve('.pi-agent-dir'));
  assert.ok(!plan.args.includes('--api-key'));
  assert.ok(!plan.args.includes('--approve'));
  assert.ok(!plan.args.includes('-a'));
});

test('Pi refuses ambient configuration, partial identity, read-only, and resume shaping', () => {
  assert.throws(() => buildPiConformanceInvocation(request({ environmentPolicy: { mode: 'INHERIT' as const } }), discovery), /EXACT isolated environment/);
  assert.throws(() => buildPiConformanceInvocation(request({ provider: 'provider-only' }), discovery), /provider and model must be selected together/);
  assert.throws(() => buildPiConformanceInvocation(request({ model: 'model-only' }), discovery), /provider and model must be selected together/);
  assert.throws(() => buildPiConformanceInvocation(request({ posture: 'READ_ONLY' }), discovery), /READ_ONLY is not authorized/);
  assert.throws(() => buildPiConformanceInvocation(request({ sessionId: 'session-id' }), discovery), /resume is not authorized/);
});

test('Pi JSONL parser uses authoritative message_end identity and final text', () => {
  const stdout = [
    JSON.stringify({ type: 'session', version: 3, id: 'pi-session', cwd: resolve('.') }),
    JSON.stringify({ type: 'agent_start' }),
    JSON.stringify({
      type: 'message_end',
      message: {
        role: 'assistant',
        content: [{ type: 'text', text: 'fixture ok' }],
        provider: 'local-provider',
        model: 'model-id',
        stopReason: 'stop',
      },
    }),
    JSON.stringify({ type: 'agent_end', messages: [] }),
  ].join('\n');
  const parsed = parsePiJsonl(stdout);
  assert.equal(parsed.invalid, false);
  assert.equal(parsed.providerFailed, false);
  assert.equal(parsed.agentEnded, true);
  assert.equal(parsed.sessionId, 'pi-session');
  assert.equal(parsed.observedProvider, 'local-provider');
  assert.equal(parsed.observedModel, 'model-id');
  assert.equal(parsed.finalMessage, 'fixture ok');
});

test('Pi JSONL parser fails closed on malformed, provider-error, aborted, errorMessage, and incomplete streams', () => {
  assert.equal(parsePiJsonl('{bad').invalid, true);
  const failed = parsePiJsonl([
    JSON.stringify({ type: 'session', id: 's' }),
    JSON.stringify({ type: 'message_end', message: { role: 'assistant', content: [{ type: 'text', text: 'no' }], provider: 'p', model: 'm', stopReason: 'error', errorMessage: 'failure' } }),
    JSON.stringify({ type: 'agent_end', messages: [] }),
  ].join('\n'));
  assert.equal(failed.providerFailed, true);
  assert.ok(failed.warnings.length > 0);

  const aborted = parsePiJsonl([
    JSON.stringify({ type: 'session', id: 's-abort' }),
    JSON.stringify({ type: 'message_end', message: { role: 'assistant', content: [{ type: 'text', text: 'partial' }], provider: 'p', model: 'm', stopReason: 'aborted', errorMessage: 'cancelled upstream' } }),
    JSON.stringify({ type: 'agent_end', messages: [] }),
  ].join('\n'));
  assert.equal(aborted.providerFailed, true);
  assert.ok(aborted.warnings.some((warning) => warning.includes('aborted')));

  const inconsistentError = parsePiJsonl([
    JSON.stringify({ type: 'session', id: 's-error-message' }),
    JSON.stringify({ type: 'message_end', message: { role: 'assistant', content: [{ type: 'text', text: 'must not pass' }], provider: 'p', model: 'm', stopReason: 'stop', errorMessage: 'provider reported failure' } }),
    JSON.stringify({ type: 'agent_end', messages: [] }),
  ].join('\n'));
  assert.equal(inconsistentError.providerFailed, true);

  const incomplete = parsePiJsonl(JSON.stringify({ type: 'message_end', message: { role: 'assistant', content: [{ type: 'text', text: 'not enough' }], provider: 'p', model: 'm', stopReason: 'stop' } }));
  assert.equal(incomplete.agentEnded, false);
});

test('Pi identity is accepted by the shared conformance record without implying Gold', () => {
  const value = makeConformanceRecord({
    source: 'DETERMINISTIC_FIXTURE',
    adapterImplementationVersion: PI_DEFINITION.implementationVersion,
    adapterId: PI_DEFINITION.id,
    delethosRevision: 'a'.repeat(40),
    executablePath: null,
    cliVersion: null,
    platform: 'linux',
    arch: 'x64',
    caseId: 'discovery-version',
    requestedPosture: null,
    requestedModel: null,
    requestedProvider: null,
    outcome: 'UNVERIFIED',
  });
  assert.equal(value.adapterId, 'pi-coding-agent');
  assert.equal(value.outcome, 'UNVERIFIED');
});
