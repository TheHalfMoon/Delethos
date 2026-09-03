import { isAbsolute } from 'node:path';
import type { AdapterDefinition, AdapterDiscovery, AdapterEnvironmentPolicy, AdapterRunRequest, AdapterRunResult, CapabilitySet, ExecutionIdentity, InvocationPlan } from './types.ts';
import { validateAdapterRunRequest } from './types.ts';
import { authFailureText, processEvidence, statusFromProcess, superviseInvocation } from './invocation.ts';

export const PI_DEFINITION: AdapterDefinition = {
  id: 'pi-coding-agent',
  implementationVersion: 'spec003-recovery.pi.3',
  tier: 'EXPERIMENTAL',
  candidateStatus: 'SELECTED_GOLD_CANDIDATE',
  commandName: 'pi',
  versionArgs: ['--version'],
  capabilities: {
    headless: 'UNVERIFIED', exactCwd: 'UNVERIFIED', write: 'UNVERIFIED', readOnly: 'UNVERIFIED',
    machineReadableOutput: 'UNVERIFIED', modelSelection: 'UNVERIFIED', providerSelection: 'UNVERIFIED',
    resume: 'UNVERIFIED', cancellation: 'UNVERIFIED', turnLimit: 'UNVERIFIED', budgetLimit: 'UNVERIFIED',
    toolRestriction: 'UNVERIFIED', permissionControl: 'UNVERIFIED', configurationIsolation: 'UNVERIFIED',
  },
};

type PiPrerequisiteToolMode = 'NO_TOOLS' | 'WRITE_ONLY';

const PI_WRITE_ONLY_SYSTEM_PROMPT = [
  'You are a deterministic file-writing agent.',
  'For the current request, your first assistant response must be exactly one call to the available write tool and no natural-language text.',
  'Do not describe, simulate, or claim the write instead of calling the tool.',
  'Do not claim or imply that a file was written unless the write tool has returned success.',
  'After a successful write tool result, do not call any tool again; reply with a short confirmation.',
].join(' ');

type ConformanceRunRequest = Omit<AdapterRunRequest, 'environmentPolicy'> & {
  readonly environmentPolicy?: AdapterEnvironmentPolicy;
  readonly environment?: Readonly<Record<string, string>>;
  readonly prerequisiteToolMode?: PiPrerequisiteToolMode;
};

function normalizeConformanceRequest(request: ConformanceRunRequest): AdapterRunRequest {
  const { environment, environmentPolicy, prerequisiteToolMode: _prerequisiteToolMode, ...rest } = request;
  return {
    ...rest,
    environmentPolicy: environmentPolicy ?? (environment === undefined ? { mode: 'INHERIT' } : { mode: 'EXACT', values: environment }),
  };
}

function requireDiscovery(discovery: AdapterDiscovery): asserts discovery is AdapterDiscovery & { executablePath: string; cliVersion: string } {
  if (discovery.adapterId !== 'pi-coding-agent' || discovery.state !== 'DISCOVERED' || !discovery.executablePath || !discovery.cliVersion) {
    throw new TypeError('Pi must be discovered with an exact executable and version before invocation');
  }
}

function requireSupported(capabilities: CapabilitySet, capability: keyof CapabilitySet): void {
  const state = capabilities[capability];
  if (state !== 'SUPPORTED') throw new TypeError(`Pi ${capability} capability is ${state}; product dispatch requires SUPPORTED evidence`);
}

function enforceProductCapabilities(request: AdapterRunRequest): void {
  for (const capability of ['headless', 'exactCwd', 'machineReadableOutput', 'cancellation', 'configurationIsolation'] as const) requireSupported(PI_DEFINITION.capabilities, capability);
  requireSupported(PI_DEFINITION.capabilities, request.posture === 'READ_ONLY' ? 'readOnly' : 'write');
  if (request.model !== undefined) requireSupported(PI_DEFINITION.capabilities, 'modelSelection');
  if (request.provider !== undefined) requireSupported(PI_DEFINITION.capabilities, 'providerSelection');
  if (request.sessionId !== undefined) requireSupported(PI_DEFINITION.capabilities, 'resume');
}

function requireAbsoluteEnvironmentPath(values: Readonly<Record<string, string>>, key: string): void {
  const value = values[key];
  if (!value || !isAbsolute(value)) throw new TypeError(`Pi ${key} must be an explicit absolute isolation path`);
}

function requirePiIsolation(request: AdapterRunRequest): void {
  if (request.environmentPolicy.mode !== 'EXACT') throw new TypeError('Pi requires an EXACT isolated environment');
  requireAbsoluteEnvironmentPath(request.environmentPolicy.values, 'PI_CODING_AGENT_DIR');
  requireAbsoluteEnvironmentPath(request.environmentPolicy.values, 'HOME');
  if (process.platform === 'win32') requireAbsoluteEnvironmentPath(request.environmentPolicy.values, 'USERPROFILE');
}

function validatePrerequisiteToolMode(request: AdapterRunRequest, productDispatch: boolean, prerequisiteToolMode: unknown): PiPrerequisiteToolMode | undefined {
  if (prerequisiteToolMode === undefined) return undefined;
  if (productDispatch) throw new TypeError('Pi prerequisite tool mode is conformance-only');
  if (prerequisiteToolMode !== 'NO_TOOLS' && prerequisiteToolMode !== 'WRITE_ONLY') {
    throw new TypeError('Pi prerequisite tool mode must be NO_TOOLS or WRITE_ONLY');
  }
  if (request.posture !== 'WRITE') throw new TypeError(`Pi ${prerequisiteToolMode} prerequisite tool mode requires WRITE posture`);
  return prerequisiteToolMode;
}

function buildPiInvocationCore(
  request: AdapterRunRequest,
  discovery: AdapterDiscovery,
  productDispatch: boolean,
  prerequisiteToolMode?: unknown,
): InvocationPlan {
  validateAdapterRunRequest(request);
  if (request.adapterId !== 'pi-coding-agent') throw new TypeError('request is not for Pi');
  requireDiscovery(discovery);
  if (productDispatch) enforceProductCapabilities(request);
  requirePiIsolation(request);
  const boundedPrerequisiteToolMode = validatePrerequisiteToolMode(request, productDispatch, prerequisiteToolMode);
  if (request.configurationPosture !== undefined && request.configurationPosture !== 'NOT_APPLICABLE') throw new TypeError('Pi does not use Claude configuration posture');
  if (request.maxTurns !== undefined || request.maxBudgetUsd !== undefined) throw new TypeError('Pi turn/budget controls are not authorized by this adapter');
  if (request.posture === 'READ_ONLY') throw new TypeError('Pi READ_ONLY is not authorized until an enforced boundary is independently qualified');
  if (request.sessionId !== undefined) throw new TypeError('Pi resume is not authorized by the initial recovery adapter');
  if ((request.provider === undefined) !== (request.model === undefined)) throw new TypeError('Pi provider and model must be selected together');

  const args: string[] = [
    '--mode', 'json',
    '--no-session',
    '--no-extensions',
    '--no-skills',
    '--no-prompt-templates',
    '--no-themes',
    '--no-context-files',
    '--no-approve',
  ];
  if (boundedPrerequisiteToolMode === 'NO_TOOLS') {
    args.push('--no-tools');
  } else if (boundedPrerequisiteToolMode === 'WRITE_ONLY') {
    args.push('--tools', 'write', '--system-prompt', PI_WRITE_ONLY_SYSTEM_PROMPT);
  }
  if (request.provider !== undefined && request.model !== undefined) args.push('--provider', request.provider, '--model', request.model);

  const forbidden = new Set(['--api-key', '--approve', '-a']);
  if (args.some((arg) => forbidden.has(arg))) throw new Error('dangerous or secret-bearing Pi flag generated');
  args.push('--', request.prompt);

  return {
    adapterId: request.adapterId, executablePath: discovery.executablePath, args, cwd: request.cwd,
    environment: request.environmentPolicy, timeoutMs: request.timeoutMs, stallMs: request.stallMs,
    terminationGraceMs: request.terminationGraceMs, outputLimitBytes: request.outputLimitBytes,
    requestedModel: request.model ?? null, requestedProvider: request.provider ?? null, configurationPosture: 'NOT_APPLICABLE',
  };
}

export function buildPiInvocation(request: AdapterRunRequest, discovery: AdapterDiscovery): InvocationPlan {
  return buildPiInvocationCore(request, discovery, true);
}

export function buildPiConformanceInvocation(request: ConformanceRunRequest, discovery: AdapterDiscovery): InvocationPlan {
  return buildPiInvocationCore(normalizeConformanceRequest(request), discovery, false, request.prerequisiteToolMode);
}

interface ParsedPi {
  readonly invalid: boolean;
  readonly providerFailed: boolean;
  readonly agentEnded: boolean;
  readonly finalMessage: string | null;
  readonly sessionId: string | null;
  readonly observedModel: string | null;
  readonly observedProvider: string | null;
  readonly warnings: readonly string[];
}

function assistantText(message: Record<string, unknown>): string | null {
  if (!Array.isArray(message.content)) return null;
  const text = message.content
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null && !Array.isArray(item))
    .filter((item) => item.type === 'text' && typeof item.text === 'string')
    .map((item) => item.text as string)
    .join('');
  return text.length > 0 ? text : null;
}

export function parsePiJsonl(stdout: string): ParsedPi {
  let invalid = false;
  let providerFailed = false;
  let agentEnded = false;
  let finalMessage: string | null = null;
  let sessionId: string | null = null;
  let observedModel: string | null = null;
  let observedProvider: string | null = null;
  const warnings: string[] = [];
  const lines = stdout.split(/\r?\n/).filter((line) => line.trim() !== '');

  for (const line of lines) {
    let event: unknown;
    try { event = JSON.parse(line); } catch { invalid = true; continue; }
    if (typeof event !== 'object' || event === null || Array.isArray(event)) { invalid = true; continue; }
    const value = event as Record<string, unknown>;
    const type = typeof value.type === 'string' ? value.type : '';
    if (type === 'session' && typeof value.id === 'string') sessionId = value.id;
    if (type === 'agent_end') agentEnded = true;
    if (type === 'message_end' && typeof value.message === 'object' && value.message !== null && !Array.isArray(value.message)) {
      const message = value.message as Record<string, unknown>;
      if (message.role === 'assistant') {
        finalMessage = assistantText(message);
        if (typeof message.model === 'string') observedModel = message.model;
        if (typeof message.provider === 'string') observedProvider = message.provider;
        if (message.stopReason === 'error' || message.stopReason === 'aborted') providerFailed = true;
        if (message.stopReason === 'aborted') warnings.push('Pi assistant message ended with aborted stopReason');
        if (typeof message.errorMessage === 'string' && message.errorMessage.length > 0) {
          providerFailed = true;
          warnings.push('Pi assistant message reported an errorMessage');
        }
      }
    }
    if (!type) warnings.push('Pi event without string type');
  }
  if (lines.length === 0) invalid = true;
  return { invalid, providerFailed, agentEnded, finalMessage, sessionId, observedModel, observedProvider, warnings };
}

function runPiWithPlan(request: AdapterRunRequest, discovery: AdapterDiscovery, plan: InvocationPlan) {
  requireDiscovery(discovery);
  const supervised = superviseInvocation(plan);
  return {
    cancel: () => supervised.cancel(),
    result: (async (): Promise<AdapterRunResult> => {
      const processResult = await supervised.result;
      const mechanism = processEvidence(processResult);
      const processStatus = statusFromProcess(processResult);
      const identityBase: ExecutionIdentity = {
        adapterId: 'pi-coding-agent', adapterImplementationVersion: PI_DEFINITION.implementationVersion,
        executablePath: discovery.executablePath, cliVersion: discovery.cliVersion,
        requestedModel: request.model ?? null, observedModel: null,
        requestedProvider: request.provider ?? null, observedProvider: null,
        sessionId: null,
      };
      if (processStatus !== null) return { status: processStatus, identity: identityBase, finalMessage: null, ...mechanism, stderr: processResult.stderr, warnings: [] };

      const parsed = parsePiJsonl(processResult.stdout);
      const identity: ExecutionIdentity = {
        ...identityBase,
        observedModel: parsed.observedModel,
        observedProvider: parsed.observedProvider,
        sessionId: parsed.sessionId,
      };
      if (processResult.exitCode !== 0) {
        const status = authFailureText(`${processResult.stderr}\n${processResult.stdout}`) ? 'AUTH_FAILED' : 'PROVIDER_FAILED';
        return { status, identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      if (parsed.invalid || parsed.providerFailed || !parsed.agentEnded || parsed.finalMessage === null) {
        return { status: parsed.providerFailed ? 'PROVIDER_FAILED' : 'INVALID_PROVIDER_OUTPUT', identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      return { status: 'COMPLETED', identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
    })(),
  };
}

// Internal/manual conformance path. It bypasses public capability promotion gates but retains exact request, isolation, and safety validation.
export function runPi(request: ConformanceRunRequest, discovery: AdapterDiscovery) {
  const normalized = normalizeConformanceRequest(request);
  return runPiWithPlan(normalized, discovery, buildPiInvocationCore(normalized, discovery, false, request.prerequisiteToolMode));
}

export function runPiQualified(request: AdapterRunRequest, discovery: AdapterDiscovery) {
  return runPiWithPlan(request, discovery, buildPiInvocation(request, discovery));
}
