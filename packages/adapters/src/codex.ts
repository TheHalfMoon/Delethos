import type { AdapterDefinition, AdapterDiscovery, AdapterEnvironmentPolicy, AdapterRunRequest, AdapterRunResult, CapabilitySet, ExecutionIdentity, InvocationPlan } from './types.ts';
import { validateAdapterRunRequest } from './types.ts';
import { authFailureText, processEvidence, statusFromProcess, superviseInvocation } from './invocation.ts';

export const CODEX_DEFINITION: AdapterDefinition = {
  id: 'openai-codex-cli',
  implementationVersion: 'spec003-candidate.2',
  tier: 'EXPERIMENTAL',
  candidateStatus: 'QUALIFYING',
  commandName: 'codex',
  versionArgs: ['--version'],
  capabilities: {
    headless: 'UNVERIFIED', exactCwd: 'UNVERIFIED', write: 'UNVERIFIED', readOnly: 'UNVERIFIED',
    machineReadableOutput: 'UNVERIFIED', modelSelection: 'UNVERIFIED', providerSelection: 'UNVERIFIED',
    resume: 'UNVERIFIED', cancellation: 'UNVERIFIED', turnLimit: 'UNSUPPORTED', budgetLimit: 'UNSUPPORTED',
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
  if (discovery.adapterId !== 'openai-codex-cli' || discovery.state !== 'DISCOVERED' || !discovery.executablePath || !discovery.cliVersion) {
    throw new TypeError('Codex must be discovered with an exact executable and version before invocation');
  }
}

function requireSupported(capabilities: CapabilitySet, capability: keyof CapabilitySet): void {
  const state = capabilities[capability];
  if (state !== 'SUPPORTED') throw new TypeError(`Codex ${capability} capability is ${state}; product dispatch requires SUPPORTED evidence`);
}

function enforceProductCapabilities(request: AdapterRunRequest): void {
  for (const capability of ['headless', 'exactCwd', 'machineReadableOutput', 'cancellation', 'configurationIsolation'] as const) requireSupported(CODEX_DEFINITION.capabilities, capability);
  requireSupported(CODEX_DEFINITION.capabilities, request.posture === 'READ_ONLY' ? 'readOnly' : 'write');
  if (request.model !== undefined) requireSupported(CODEX_DEFINITION.capabilities, 'modelSelection');
  if (request.provider !== undefined) requireSupported(CODEX_DEFINITION.capabilities, 'providerSelection');
  if (request.sessionId !== undefined) requireSupported(CODEX_DEFINITION.capabilities, 'resume');
}

function buildCodexInvocationCore(request: AdapterRunRequest, discovery: AdapterDiscovery, productDispatch: boolean): InvocationPlan {
  validateAdapterRunRequest(request);
  if (request.adapterId !== 'openai-codex-cli') throw new TypeError('request is not for Codex');
  requireDiscovery(discovery);
  if (productDispatch) enforceProductCapabilities(request);
  if (request.provider !== undefined) throw new TypeError('Codex provider selection is not authorized by the initial adapter contract');
  if (request.configurationPosture !== undefined && request.configurationPosture !== 'NOT_APPLICABLE') throw new TypeError('Codex does not use Claude configuration posture');
  if (request.maxTurns !== undefined || request.maxBudgetUsd !== undefined) throw new TypeError('Codex provider-side turn/budget controls are not authorized by this adapter');

  const args: string[] = ['exec', '--json', '--cd', request.cwd, '--ignore-user-config', '--ignore-rules', '--sandbox', request.posture === 'READ_ONLY' ? 'read-only' : 'workspace-write'];
  if (request.model !== undefined) args.push('--model', request.model);
  if (request.sessionId !== undefined) args.push('resume', request.sessionId, request.prompt);
  else args.push('--ephemeral', request.prompt);

  const forbidden = new Set(['--dangerously-bypass-approvals-and-sandbox', '--dangerously-bypass-hook-trust', '--yolo']);
  if (args.some((arg) => forbidden.has(arg))) throw new Error('dangerous Codex bypass flag generated');

  return {
    adapterId: request.adapterId, executablePath: discovery.executablePath, args, cwd: request.cwd,
    environment: request.environmentPolicy, timeoutMs: request.timeoutMs, stallMs: request.stallMs,
    terminationGraceMs: request.terminationGraceMs, outputLimitBytes: request.outputLimitBytes,
    requestedModel: request.model ?? null, requestedProvider: null, configurationPosture: 'NOT_APPLICABLE',
  };
}

export function buildCodexInvocation(request: AdapterRunRequest, discovery: AdapterDiscovery): InvocationPlan {
  return buildCodexInvocationCore(request, discovery, true);
}

export function buildCodexConformanceInvocation(request: ConformanceRunRequest, discovery: AdapterDiscovery): InvocationPlan {
  return buildCodexInvocationCore(normalizeConformanceRequest(request), discovery, false);
}

interface ParsedCodex {
  readonly invalid: boolean;
  readonly providerFailed: boolean;
  readonly turnCompleted: boolean;
  readonly finalMessage: string | null;
  readonly sessionId: string | null;
  readonly observedModel: string | null;
  readonly warnings: readonly string[];
}

export function parseCodexJsonl(stdout: string): ParsedCodex {
  let invalid = false;
  let providerFailed = false;
  let turnCompleted = false;
  let finalMessage: string | null = null;
  let sessionId: string | null = null;
  let observedModel: string | null = null;
  const warnings: string[] = [];
  const lines = stdout.split(/\r?\n/).filter((line) => line.trim() !== '');

  for (const line of lines) {
    let event: unknown;
    try { event = JSON.parse(line); } catch { invalid = true; continue; }
    if (typeof event !== 'object' || event === null || Array.isArray(event)) { invalid = true; continue; }
    const value = event as Record<string, unknown>;
    const type = typeof value.type === 'string' ? value.type : '';
    if (type === 'thread.started' && typeof value.thread_id === 'string') sessionId = value.thread_id;
    if (type === 'turn.completed') turnCompleted = true;
    if (typeof value.model === 'string') observedModel = value.model;
    if (type === 'item.completed' && typeof value.item === 'object' && value.item !== null) {
      const item = value.item as Record<string, unknown>;
      if (item.type === 'agent_message' && typeof item.text === 'string') finalMessage = item.text;
    }
    if (type === 'turn.failed' || type === 'error' || type.endsWith('.failed')) providerFailed = true;
    if (!type) warnings.push('Codex event without string type');
  }
  if (lines.length === 0) invalid = true;
  return { invalid, providerFailed, turnCompleted, finalMessage, sessionId, observedModel, warnings };
}

function runCodexWithPlan(request: AdapterRunRequest, discovery: AdapterDiscovery, plan: InvocationPlan) {
  requireDiscovery(discovery);
  const supervised = superviseInvocation(plan);
  return {
    cancel: () => supervised.cancel(),
    result: (async (): Promise<AdapterRunResult> => {
      const processResult = await supervised.result;
      const mechanism = processEvidence(processResult);
      const processStatus = statusFromProcess(processResult);
      const identityBase: ExecutionIdentity = {
        adapterId: 'openai-codex-cli', adapterImplementationVersion: CODEX_DEFINITION.implementationVersion,
        executablePath: discovery.executablePath, cliVersion: discovery.cliVersion,
        requestedModel: request.model ?? null, observedModel: null, requestedProvider: null, observedProvider: null,
        sessionId: request.sessionId ?? null,
      };
      if (processStatus !== null) return { status: processStatus, identity: identityBase, finalMessage: null, ...mechanism, stderr: processResult.stderr, warnings: [] };

      const parsed = parseCodexJsonl(processResult.stdout);
      const identity: ExecutionIdentity = { ...identityBase, observedModel: parsed.observedModel, sessionId: parsed.sessionId ?? identityBase.sessionId };
      if (processResult.exitCode !== 0) {
        const status = authFailureText(`${processResult.stderr}\n${processResult.stdout}`) ? 'AUTH_FAILED' : 'PROVIDER_FAILED';
        return { status, identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      if (parsed.invalid || parsed.providerFailed || !parsed.turnCompleted || parsed.finalMessage === null) {
        return { status: parsed.providerFailed ? 'PROVIDER_FAILED' : 'INVALID_PROVIDER_OUTPUT', identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      return { status: 'COMPLETED', identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
    })(),
  };
}

// Internal/manual conformance path. It intentionally bypasses product capability promotion gates while retaining all request-shape and safety validation.
export function runCodex(request: ConformanceRunRequest, discovery: AdapterDiscovery) {
  const normalized = normalizeConformanceRequest(request);
  return runCodexWithPlan(normalized, discovery, buildCodexInvocationCore(normalized, discovery, false));
}

export function runCodexQualified(request: AdapterRunRequest, discovery: AdapterDiscovery) {
  return runCodexWithPlan(request, discovery, buildCodexInvocation(request, discovery));
}
