import type { AdapterDefinition, AdapterDiscovery, AdapterEnvironmentPolicy, AdapterRunRequest, AdapterRunResult, CapabilitySet, ConfigurationPosture, ExecutionIdentity, InvocationPlan } from './types.ts';
import { validateAdapterRunRequest } from './types.ts';
import { authFailureText, processEvidence, statusFromProcess, superviseInvocation } from './invocation.ts';

export const CLAUDE_DEFINITION: AdapterDefinition = {
  id: 'anthropic-claude-code',
  implementationVersion: 'spec003-candidate.2',
  tier: 'EXPERIMENTAL',
  candidateStatus: 'QUALIFYING',
  commandName: 'claude',
  versionArgs: ['--version'],
  capabilities: {
    headless: 'UNVERIFIED', exactCwd: 'UNVERIFIED', write: 'UNVERIFIED', readOnly: 'UNVERIFIED',
    machineReadableOutput: 'UNVERIFIED', modelSelection: 'UNVERIFIED', providerSelection: 'UNVERIFIED',
    resume: 'UNVERIFIED', cancellation: 'UNVERIFIED', turnLimit: 'UNVERIFIED', budgetLimit: 'UNVERIFIED',
    toolRestriction: 'UNVERIFIED', permissionControl: 'UNVERIFIED', configurationIsolation: 'UNVERIFIED',
  },
};

type ConformanceRunRequest = Omit<AdapterRunRequest, 'environmentPolicy'> & {
  readonly environmentPolicy?: AdapterEnvironmentPolicy;
  readonly environment?: Readonly<Record<string, string>>;
};

function normalizeConformanceRequest(request: ConformanceRunRequest): AdapterRunRequest {
  const { environment, environmentPolicy, ...rest } = request;
  return {
    ...rest,
    environmentPolicy: environmentPolicy ?? (environment === undefined ? { mode: 'INHERIT' } : { mode: 'EXACT', values: environment }),
  };
}

function requireDiscovery(discovery: AdapterDiscovery): asserts discovery is AdapterDiscovery & { executablePath: string; cliVersion: string } {
  if (discovery.adapterId !== 'anthropic-claude-code' || discovery.state !== 'DISCOVERED' || !discovery.executablePath || !discovery.cliVersion) {
    throw new TypeError('Claude Code must be discovered with an exact executable and version before invocation');
  }
}

function requireConfigurationPosture(value: ConfigurationPosture | undefined): Exclude<ConfigurationPosture, 'NOT_APPLICABLE'> {
  if (value !== 'CONTROLLED_BARE' && value !== 'CONTROLLED_STANDARD') throw new TypeError('Claude Code requires explicit CONTROLLED_BARE or CONTROLLED_STANDARD posture');
  return value;
}

function parseVersion(value: string): readonly [number, number, number] | null {
  const match = value.match(/\bv?(\d+)\.(\d+)\.(\d+)\b/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function claudeSupportsRestricted(cliVersion: string): boolean {
  const version = parseVersion(cliVersion);
  if (!version) return false;
  const minimum: readonly [number, number, number] = [2, 1, 248];
  for (let index = 0; index < minimum.length; index += 1) {
    if (version[index]! > minimum[index]!) return true;
    if (version[index]! < minimum[index]!) return false;
  }
  return true;
}

function requireSupported(capabilities: CapabilitySet, capability: keyof CapabilitySet): void {
  const state = capabilities[capability];
  if (state !== 'SUPPORTED') throw new TypeError(`Claude ${capability} capability is ${state}; product dispatch requires SUPPORTED evidence`);
}

function enforceProductCapabilities(request: AdapterRunRequest): void {
  for (const capability of ['headless', 'exactCwd', 'machineReadableOutput', 'cancellation', 'toolRestriction', 'permissionControl', 'configurationIsolation'] as const) requireSupported(CLAUDE_DEFINITION.capabilities, capability);
  requireSupported(CLAUDE_DEFINITION.capabilities, request.posture === 'READ_ONLY' ? 'readOnly' : 'write');
  if (request.model !== undefined) requireSupported(CLAUDE_DEFINITION.capabilities, 'modelSelection');
  if (request.provider !== undefined) requireSupported(CLAUDE_DEFINITION.capabilities, 'providerSelection');
  if (request.sessionId !== undefined) requireSupported(CLAUDE_DEFINITION.capabilities, 'resume');
  if (request.maxTurns !== undefined) requireSupported(CLAUDE_DEFINITION.capabilities, 'turnLimit');
  if (request.maxBudgetUsd !== undefined) requireSupported(CLAUDE_DEFINITION.capabilities, 'budgetLimit');
}

function environmentValue(policy: AdapterEnvironmentPolicy, key: string): string | undefined {
  if (policy.mode === 'EXACT') return policy.values[key];
  return process.env[key];
}

function requireBareAuthentication(request: AdapterRunRequest): void {
  const apiKey = environmentValue(request.environmentPolicy, 'ANTHROPIC_API_KEY');
  if (typeof apiKey !== 'string' || apiKey.length === 0) {
    throw new TypeError('Claude CONTROLLED_BARE requires a compatible explicit ANTHROPIC_API_KEY environment; subscription/OAuth login is not used in bare mode');
  }
}

function buildClaudeInvocationCore(request: AdapterRunRequest, discovery: AdapterDiscovery, productDispatch: boolean): InvocationPlan {
  validateAdapterRunRequest(request);
  if (request.adapterId !== 'anthropic-claude-code') throw new TypeError('request is not for Claude Code');
  requireDiscovery(discovery);
  if (productDispatch) enforceProductCapabilities(request);
  if (request.provider !== undefined) throw new TypeError('Claude provider selection is not authorized by the initial adapter contract');
  const posture = requireConfigurationPosture(request.configurationPosture);
  if (posture === 'CONTROLLED_BARE') requireBareAuthentication(request);

  const args: string[] = ['-p', request.prompt, '--output-format', 'stream-json', '--verbose'];
  if (request.posture === 'READ_ONLY') {
    if (posture !== 'CONTROLLED_STANDARD') throw new TypeError('Claude READ_ONLY requires CONTROLLED_STANDARD so restricted mode owns configuration isolation');
    if (!claudeSupportsRestricted(discovery.cliVersion)) throw new TypeError('Claude READ_ONLY requires Claude Code >= 2.1.248 with --restricted support');
    args.push('--restricted', '--permission-mode', 'plan', '--tools', 'Read,Glob,Grep', '--disallowedTools', 'mcp__*');
  } else {
    if (posture === 'CONTROLLED_BARE') args.push('--bare');
    else args.push('--safe-mode');
    args.push('--permission-mode', 'dontAsk', '--tools', 'Read,Glob,Grep,Edit,Write', '--disallowedTools', 'mcp__*');
  }
  if (request.model !== undefined) args.push('--model', request.model);
  if (request.maxTurns !== undefined) args.push('--max-turns', String(request.maxTurns));
  if (request.maxBudgetUsd !== undefined) args.push('--max-budget-usd', String(request.maxBudgetUsd));
  if (request.sessionId !== undefined) args.push('--resume', request.sessionId);

  if (args.includes('--dangerously-skip-permissions') || args.includes('--allow-dangerously-skip-permissions') || args.includes('bypassPermissions')) throw new Error('dangerous Claude permission bypass generated');

  return {
    adapterId: request.adapterId, executablePath: discovery.executablePath, args, cwd: request.cwd,
    environment: request.environmentPolicy, timeoutMs: request.timeoutMs, stallMs: request.stallMs,
    terminationGraceMs: request.terminationGraceMs, outputLimitBytes: request.outputLimitBytes,
    requestedModel: request.model ?? null, requestedProvider: null, configurationPosture: posture,
  };
}

export function buildClaudeInvocation(request: AdapterRunRequest, discovery: AdapterDiscovery): InvocationPlan {
  return buildClaudeInvocationCore(request, discovery, true);
}

export function buildClaudeConformanceInvocation(request: ConformanceRunRequest, discovery: AdapterDiscovery): InvocationPlan {
  return buildClaudeInvocationCore(normalizeConformanceRequest(request), discovery, false);
}

interface ParsedClaude {
  readonly invalid: boolean;
  readonly providerFailed: boolean;
  readonly finalResultSeen: boolean;
  readonly finalMessage: string | null;
  readonly sessionId: string | null;
  readonly observedModel: string | null;
  readonly warnings: readonly string[];
}

export function parseClaudeJson(stdout: string): ParsedClaude {
  const lines = stdout.split(/\r?\n/).filter((line) => line.trim() !== '');
  if (lines.length === 0) return { invalid: true, providerFailed: false, finalResultSeen: false, finalMessage: null, sessionId: null, observedModel: null, warnings: [] };

  let invalid = false;
  let providerFailed = false;
  let finalResultSeen = false;
  let finalMessage: string | null = null;
  let sessionId: string | null = null;
  let observedModel: string | null = null;
  const warnings: string[] = [];

  for (const line of lines) {
    let value: unknown;
    try { value = JSON.parse(line); } catch { invalid = true; continue; }
    if (typeof value !== 'object' || value === null || Array.isArray(value)) { invalid = true; continue; }
    const record = value as Record<string, unknown>;
    const type = typeof record.type === 'string' ? record.type : '';
    const subtype = typeof record.subtype === 'string' ? record.subtype : null;

    if (type === 'system' && subtype === 'init') {
      if (typeof record.session_id === 'string') sessionId = record.session_id;
      if (typeof record.model === 'string') observedModel = record.model;
    }
    if (type === 'result') {
      finalResultSeen = true;
      if (typeof record.session_id === 'string') sessionId = record.session_id;
      if (typeof record.model === 'string') observedModel = record.model;
      if (typeof record.result === 'string') finalMessage = record.result;
      if (record.is_error === true || subtype !== 'success') providerFailed = true;
    } else if (type === 'error') {
      providerFailed = true;
    }
    if (!type) warnings.push('Claude event without string type');
  }

  if (!finalResultSeen) invalid = true;
  return { invalid, providerFailed, finalResultSeen, finalMessage, sessionId, observedModel, warnings };
}

function runClaudeWithPlan(request: AdapterRunRequest, discovery: AdapterDiscovery, plan: InvocationPlan) {
  requireDiscovery(discovery);
  const supervised = superviseInvocation(plan);
  return {
    cancel: () => supervised.cancel(),
    result: (async (): Promise<AdapterRunResult> => {
      const processResult = await supervised.result;
      const mechanism = processEvidence(processResult);
      const processStatus = statusFromProcess(processResult);
      const identityBase: ExecutionIdentity = {
        adapterId: 'anthropic-claude-code', adapterImplementationVersion: CLAUDE_DEFINITION.implementationVersion,
        executablePath: discovery.executablePath, cliVersion: discovery.cliVersion,
        requestedModel: request.model ?? null, observedModel: null, requestedProvider: null, observedProvider: null,
        sessionId: request.sessionId ?? null,
      };
      if (processStatus !== null) return { status: processStatus, identity: identityBase, finalMessage: null, ...mechanism, stderr: processResult.stderr, warnings: [] };

      const parsed = parseClaudeJson(processResult.stdout);
      const identity: ExecutionIdentity = { ...identityBase, observedModel: parsed.observedModel, sessionId: parsed.sessionId ?? identityBase.sessionId };
      if (processResult.exitCode !== 0) {
        const status = authFailureText(`${processResult.stderr}\n${processResult.stdout}`) ? 'AUTH_FAILED' : 'PROVIDER_FAILED';
        return { status, identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      if (parsed.invalid || parsed.providerFailed || !parsed.finalResultSeen || parsed.finalMessage === null) {
        return { status: parsed.providerFailed ? 'PROVIDER_FAILED' : 'INVALID_PROVIDER_OUTPUT', identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      return { status: 'COMPLETED', identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
    })(),
  };
}

// Internal/manual conformance path. It intentionally bypasses product capability promotion gates while retaining all request-shape and safety validation.
export function runClaude(request: ConformanceRunRequest, discovery: AdapterDiscovery) {
  const normalized = normalizeConformanceRequest(request);
  return runClaudeWithPlan(normalized, discovery, buildClaudeInvocationCore(normalized, discovery, false));
}

export function runClaudeQualified(request: AdapterRunRequest, discovery: AdapterDiscovery) {
  return runClaudeWithPlan(request, discovery, buildClaudeInvocation(request, discovery));
}
