import { isAbsolute } from 'node:path';
import type { AdapterDefinition, AdapterDiscovery, AdapterEnvironmentPolicy, AdapterRunRequest, AdapterRunResult, CapabilitySet, ExecutionIdentity, InvocationPlan } from './types.ts';
import { validateAdapterRunRequest } from './types.ts';
import { authFailureText, processEvidence, statusFromProcess, superviseInvocation } from './invocation.ts';

export const OPENCODE_DEFINITION: AdapterDefinition = {
  id: 'opencode',
  implementationVersion: 'spec003-recovery.opencode.1',
  tier: 'EXPERIMENTAL',
  candidateStatus: 'SELECTED_GOLD_CANDIDATE',
  commandName: 'opencode',
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
  if (discovery.adapterId !== 'opencode' || discovery.state !== 'DISCOVERED' || !discovery.executablePath || !discovery.cliVersion) {
    throw new TypeError('OpenCode must be discovered with an exact executable and version before invocation');
  }
}

function requireSupported(capabilities: CapabilitySet, capability: keyof CapabilitySet): void {
  const state = capabilities[capability];
  if (state !== 'SUPPORTED') throw new TypeError(`OpenCode ${capability} capability is ${state}; product dispatch requires SUPPORTED evidence`);
}

function enforceProductCapabilities(request: AdapterRunRequest): void {
  for (const capability of ['headless', 'exactCwd', 'machineReadableOutput', 'cancellation', 'configurationIsolation'] as const) requireSupported(OPENCODE_DEFINITION.capabilities, capability);
  requireSupported(OPENCODE_DEFINITION.capabilities, request.posture === 'READ_ONLY' ? 'readOnly' : 'write');
  if (request.model !== undefined) requireSupported(OPENCODE_DEFINITION.capabilities, 'modelSelection');
  if (request.provider !== undefined) requireSupported(OPENCODE_DEFINITION.capabilities, 'providerSelection');
  if (request.sessionId !== undefined) requireSupported(OPENCODE_DEFINITION.capabilities, 'resume');
}

function requireAbsoluteEnvironmentPath(values: Readonly<Record<string, string>>, key: string): void {
  const value = values[key];
  if (!value || !isAbsolute(value)) throw new TypeError(`OpenCode ${key} must be an explicit absolute isolation path`);
}

function requireOpenCodeIsolation(request: AdapterRunRequest): void {
  if (request.environmentPolicy.mode !== 'EXACT') throw new TypeError('OpenCode requires an EXACT isolated environment');
  const values = request.environmentPolicy.values;
  for (const key of ['HOME', 'XDG_CONFIG_HOME', 'XDG_DATA_HOME', 'XDG_CACHE_HOME', 'XDG_STATE_HOME', 'OPENCODE_CONFIG_DIR']) {
    requireAbsoluteEnvironmentPath(values, key);
  }
  if (process.platform === 'win32') requireAbsoluteEnvironmentPath(values, 'USERPROFILE');
  for (const key of [
    'OPENCODE_DISABLE_PROJECT_CONFIG',
    'OPENCODE_PURE',
    'OPENCODE_DISABLE_AUTOUPDATE',
    'OPENCODE_DISABLE_MODELS_FETCH',
    'OPENCODE_DISABLE_PRUNE',
    'OPENCODE_DISABLE_CLAUDE_CODE',
    'OPENCODE_DISABLE_CLAUDE_CODE_PROMPT',
    'OPENCODE_DISABLE_CLAUDE_CODE_SKILLS',
  ]) {
    if (values[key] !== '1') throw new TypeError(`OpenCode ${key}=1 is required for isolated invocation`);
  }
}

function buildOpenCodeInvocationCore(request: AdapterRunRequest, discovery: AdapterDiscovery, productDispatch: boolean): InvocationPlan {
  validateAdapterRunRequest(request);
  if (request.adapterId !== 'opencode') throw new TypeError('request is not for OpenCode');
  requireDiscovery(discovery);
  if (productDispatch) enforceProductCapabilities(request);
  requireOpenCodeIsolation(request);
  if (request.configurationPosture !== undefined && request.configurationPosture !== 'NOT_APPLICABLE') throw new TypeError('OpenCode does not use Claude configuration posture');
  if (request.maxTurns !== undefined || request.maxBudgetUsd !== undefined) throw new TypeError('OpenCode turn/budget controls are not authorized by this adapter');
  if (request.posture === 'READ_ONLY') throw new TypeError('OpenCode READ_ONLY is not authorized until the permission boundary is independently qualified');
  if (request.sessionId !== undefined) throw new TypeError('OpenCode resume is not authorized by the initial recovery adapter');
  if ((request.provider === undefined) !== (request.model === undefined)) throw new TypeError('OpenCode provider and model must be selected together');

  const args: string[] = ['run', '--format', 'json', '--dir', request.cwd];
  if (request.provider !== undefined && request.model !== undefined) args.push('--model', `${request.provider}/${request.model}`);
  args.push('--', request.prompt);

  const forbidden = new Set(['--auto', '--yolo', '--dangerously-skip-permissions']);
  if (args.some((arg) => forbidden.has(arg))) throw new Error('dangerous OpenCode bypass flag generated');

  return {
    adapterId: request.adapterId, executablePath: discovery.executablePath, args, cwd: request.cwd,
    environment: request.environmentPolicy, timeoutMs: request.timeoutMs, stallMs: request.stallMs,
    terminationGraceMs: request.terminationGraceMs, outputLimitBytes: request.outputLimitBytes,
    requestedModel: request.model ?? null, requestedProvider: request.provider ?? null, configurationPosture: 'NOT_APPLICABLE',
  };
}

export function buildOpenCodeInvocation(request: AdapterRunRequest, discovery: AdapterDiscovery): InvocationPlan {
  return buildOpenCodeInvocationCore(request, discovery, true);
}

export function buildOpenCodeConformanceInvocation(request: ConformanceRunRequest, discovery: AdapterDiscovery): InvocationPlan {
  return buildOpenCodeInvocationCore(normalizeConformanceRequest(request), discovery, false);
}

interface ParsedOpenCode {
  readonly invalid: boolean;
  readonly providerFailed: boolean;
  readonly finalMessage: string | null;
  readonly sessionId: string | null;
  readonly observedModel: null;
  readonly observedProvider: null;
  readonly warnings: readonly string[];
}

export function parseOpenCodeJsonl(stdout: string): ParsedOpenCode {
  let invalid = false;
  let providerFailed = false;
  let finalMessage: string | null = null;
  let sessionId: string | null = null;
  const warnings: string[] = [];
  const lines = stdout.split(/\r?\n/).filter((line) => line.trim() !== '');

  for (const line of lines) {
    let event: unknown;
    try { event = JSON.parse(line); } catch { invalid = true; continue; }
    if (typeof event !== 'object' || event === null || Array.isArray(event)) { invalid = true; continue; }
    const value = event as Record<string, unknown>;
    const type = typeof value.type === 'string' ? value.type : '';
    if (typeof value.sessionID === 'string') {
      if (sessionId !== null && sessionId !== value.sessionID) {
        invalid = true;
        warnings.push('OpenCode stream changed sessionID');
      }
      sessionId = value.sessionID;
    }
    if (type === 'error') providerFailed = true;
    if (type === 'text' && typeof value.part === 'object' && value.part !== null && !Array.isArray(value.part)) {
      const part = value.part as Record<string, unknown>;
      if (part.type === 'text' && typeof part.text === 'string' && part.text.length > 0) finalMessage = part.text;
    }
    if (!type) warnings.push('OpenCode event without string type');
  }
  if (lines.length === 0) invalid = true;
  return { invalid, providerFailed, finalMessage, sessionId, observedModel: null, observedProvider: null, warnings };
}

function runOpenCodeWithPlan(request: AdapterRunRequest, discovery: AdapterDiscovery, plan: InvocationPlan) {
  requireDiscovery(discovery);
  const supervised = superviseInvocation(plan);
  return {
    cancel: () => supervised.cancel(),
    result: (async (): Promise<AdapterRunResult> => {
      const processResult = await supervised.result;
      const mechanism = processEvidence(processResult);
      const processStatus = statusFromProcess(processResult);
      const identityBase: ExecutionIdentity = {
        adapterId: 'opencode', adapterImplementationVersion: OPENCODE_DEFINITION.implementationVersion,
        executablePath: discovery.executablePath, cliVersion: discovery.cliVersion,
        requestedModel: request.model ?? null, observedModel: null,
        requestedProvider: request.provider ?? null, observedProvider: null,
        sessionId: null,
      };
      if (processStatus !== null) return { status: processStatus, identity: identityBase, finalMessage: null, ...mechanism, stderr: processResult.stderr, warnings: [] };

      const parsed = parseOpenCodeJsonl(processResult.stdout);
      const identity: ExecutionIdentity = { ...identityBase, sessionId: parsed.sessionId };
      if (processResult.exitCode !== 0) {
        const status = authFailureText(`${processResult.stderr}\n${processResult.stdout}`) ? 'AUTH_FAILED' : 'PROVIDER_FAILED';
        return { status, identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      if (parsed.invalid || parsed.providerFailed || parsed.finalMessage === null || parsed.sessionId === null) {
        return { status: parsed.providerFailed ? 'PROVIDER_FAILED' : 'INVALID_PROVIDER_OUTPUT', identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      return { status: 'COMPLETED', identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
    })(),
  };
}

// Internal/manual conformance path. It bypasses public capability promotion gates but retains exact request, isolation, and safety validation.
export function runOpenCode(request: ConformanceRunRequest, discovery: AdapterDiscovery) {
  const normalized = normalizeConformanceRequest(request);
  return runOpenCodeWithPlan(normalized, discovery, buildOpenCodeInvocationCore(normalized, discovery, false));
}

export function runOpenCodeQualified(request: AdapterRunRequest, discovery: AdapterDiscovery) {
  return runOpenCodeWithPlan(request, discovery, buildOpenCodeInvocation(request, discovery));
}
