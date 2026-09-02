import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { buildOpenCodeConformanceInvocation, OPENCODE_DEFINITION, parseOpenCodeJsonl } from '../src/opencode.ts';
import { makeConformanceRecord } from '../src/conformance.ts';

const discovery = {
  adapterId: 'opencode' as const,
  state: 'DISCOVERED' as const,
  executablePath: resolve('opencode-fixture'),
  cliVersion: '1.18.26',
  detail: null,
};

function isolatedEnvironment() {
  const root = resolve('.opencode-isolated');
  const values: Record<string, string> = {
    HOME: resolve(root, 'home'),
    XDG_CONFIG_HOME: resolve(root, 'config'),
    XDG_DATA_HOME: resolve(root, 'data'),
    XDG_CACHE_HOME: resolve(root, 'cache'),
    XDG_STATE_HOME: resolve(root, 'state'),
    OPENCODE_CONFIG_DIR: resolve(root, 'config'),
    OPENCODE_DISABLE_PROJECT_CONFIG: '1',
    OPENCODE_PURE: '1',
    OPENCODE_DISABLE_AUTOUPDATE: '1',
    OPENCODE_DISABLE_MODELS_FETCH: '1',
    OPENCODE_DISABLE_PRUNE: '1',
    OPENCODE_DISABLE_CLAUDE_CODE: '1',
    OPENCODE_DISABLE_CLAUDE_CODE_PROMPT: '1',
    OPENCODE_DISABLE_CLAUDE_CODE_SKILLS: '1',
  };
  if (process.platform === 'win32') values.USERPROFILE = resolve(root, 'userprofile');
  return values;
}

function request(overrides = {}) {
  return {
    adapterId: 'opencode' as const,
    cwd: resolve('.'),
    prompt: 'make the bounded change',
    posture: 'WRITE' as const,
    environmentPolicy: { mode: 'EXACT' as const, values: isolatedEnvironment() },
    ...overrides,
  };
}

test('OpenCode recovery definition is selected but exposes no promoted capabilities', () => {
  assert.equal(OPENCODE_DEFINITION.candidateStatus, 'SELECTED_GOLD_CANDIDATE');
  assert.equal(OPENCODE_DEFINITION.tier, 'EXPERIMENTAL');
  assert.equal(OPENCODE_DEFINITION.commandName, 'opencode');
  assert.deepEqual(OPENCODE_DEFINITION.versionArgs, ['--version']);
  for (const status of Object.values(OPENCODE_DEFINITION.capabilities)) assert.equal(status, 'UNVERIFIED');
});

test('OpenCode conformance invocation uses exact run JSON cwd and composite provider/model without dangerous bypasses', () => {
  const plan = buildOpenCodeConformanceInvocation(request({ provider: 'local-provider', model: 'model-id' }), discovery);
  assert.equal(plan.executablePath, discovery.executablePath);
  assert.deepEqual(plan.args.slice(0, 3), ['run', '--format', 'json']);
  assert.equal(plan.args[plan.args.indexOf('--dir') + 1], resolve('.'));
  assert.equal(plan.args[plan.args.indexOf('--model') + 1], 'local-provider/model-id');
  assert.equal(plan.args.at(-1), 'make the bounded change');
  assert.equal(plan.requestedProvider, 'local-provider');
  assert.equal(plan.requestedModel, 'model-id');
  assert.equal(plan.environment.mode, 'EXACT');
  if (plan.environment.mode !== 'EXACT') throw new Error('expected EXACT environment');
  assert.equal(plan.environment.values.OPENCODE_DISABLE_PROJECT_CONFIG, '1');
  assert.equal(plan.environment.values.OPENCODE_PURE, '1');
  assert.ok(!plan.args.includes('--auto'));
  assert.ok(!plan.args.includes('--yolo'));
  assert.ok(!plan.args.includes('--dangerously-skip-permissions'));
});

test('OpenCode refuses ambient configuration, incomplete isolation, partial identity, read-only, and resume shaping', () => {
  assert.throws(() => buildOpenCodeConformanceInvocation(request({ environmentPolicy: { mode: 'INHERIT' as const } }), discovery), /EXACT isolated environment/);
  const incomplete = isolatedEnvironment();
  delete incomplete.OPENCODE_PURE;
  assert.throws(() => buildOpenCodeConformanceInvocation(request({ environmentPolicy: { mode: 'EXACT' as const, values: incomplete } }), discovery), /OPENCODE_PURE=1/);
  assert.throws(() => buildOpenCodeConformanceInvocation(request({ provider: 'provider-only' }), discovery), /provider and model must be selected together/);
  assert.throws(() => buildOpenCodeConformanceInvocation(request({ model: 'model-only' }), discovery), /provider and model must be selected together/);
  assert.throws(() => buildOpenCodeConformanceInvocation(request({ posture: 'READ_ONLY' }), discovery), /READ_ONLY is not authorized/);
  assert.throws(() => buildOpenCodeConformanceInvocation(request({ sessionId: 'session-id' }), discovery), /resume is not authorized/);
});

test('OpenCode JSONL parser captures session and final text while leaving observed provider/model unknown', () => {
  const stdout = [
    JSON.stringify({ type: 'step_start', timestamp: 1, sessionID: 'oc-session', part: { type: 'step-start' } }),
    JSON.stringify({ type: 'text', timestamp: 2, sessionID: 'oc-session', part: { type: 'text', text: 'fixture ok' } }),
    JSON.stringify({ type: 'step_finish', timestamp: 3, sessionID: 'oc-session', part: { type: 'step-finish' } }),
  ].join('\n');
  const parsed = parseOpenCodeJsonl(stdout);
  assert.equal(parsed.invalid, false);
  assert.equal(parsed.providerFailed, false);
  assert.equal(parsed.sessionId, 'oc-session');
  assert.equal(parsed.finalMessage, 'fixture ok');
  assert.equal(parsed.observedProvider, null);
  assert.equal(parsed.observedModel, null);
});

test('OpenCode JSONL parser fails closed on malformed, error, and session-identity drift', () => {
  assert.equal(parseOpenCodeJsonl('{bad').invalid, true);
  const failed = parseOpenCodeJsonl(JSON.stringify({ type: 'error', sessionID: 's', error: { name: 'ProviderError' } }));
  assert.equal(failed.providerFailed, true);
  const drift = parseOpenCodeJsonl([
    JSON.stringify({ type: 'text', sessionID: 's1', part: { type: 'text', text: 'one' } }),
    JSON.stringify({ type: 'text', sessionID: 's2', part: { type: 'text', text: 'two' } }),
  ].join('\n'));
  assert.ok(drift.warnings.some((value) => value.includes('changed sessionID')));
});

test('OpenCode identity is accepted by the shared conformance record without implying Gold', () => {
  const value = makeConformanceRecord({
    source: 'DETERMINISTIC_FIXTURE',
    adapterImplementationVersion: OPENCODE_DEFINITION.implementationVersion,
    adapterId: OPENCODE_DEFINITION.id,
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
  assert.equal(value.adapterId, 'opencode');
  assert.equal(value.outcome, 'UNVERIFIED');
});
