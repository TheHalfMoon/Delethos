import type { AdapterDiscovery, AdapterRunRequest, AdapterRunResult, AdapterDefinition, ExecutionIdentity, InvocationPlan } from './types.ts';
import { validateAdapterRunRequest } from './types.ts';
import { authFailureText, statusFromProcess, superviseInvocation } from './invocation.ts';

export const CODEX_DEFINITION: AdapterDefinition = {
  id: 'openai-codex-cli',
  commandName: 'codex',
  versionArgs: ['--version'],
  capabilities: {
    headless: 'UNVERIFIED',
    exactCwd: 'UNVERIFIED',
    write: 'UNVERIFIED',
    readOnly: 'UNVERIFIED',
    machineReadableOutput: 'UNVERIFIED',
    modelSelection: 'UNVERIFIED',
    providerSelection: 'UNVERIFIED',
    resume: 'UNVERIFIED',
    cancellation: 'UNVERIFIED',
  },
};

function requireDiscovery(discovery: AdapterDiscovery): asserts discovery is AdapterDiscovery & { executablePath: string; cliVersion: string } {
  if (discovery.adapterId !== 'openai-codex-cli' || discovery.state !== 'DISCOVERED' || !discovery.executablePath || !discovery.cliVersion) {
    throw new TypeError('Codex must be discovered with an exact executable and version before invocation');
  }
}

export function buildCodexInvocation(request: AdapterRunRequest, discovery: AdapterDiscovery): InvocationPlan {
  validateAdapterRunRequest(request);
  if (request.adapterId !== 'openai-codex-cli') throw new TypeError('request is not for Codex');
  requireDiscovery(discovery);
  if (request.provider !== undefined) throw new TypeError('Codex provider selection is not authorized by the initial adapter contract');
  if (request.configurationPosture !== undefined && request.configurationPosture !== 'NOT_APPLICABLE') throw new TypeError('Codex does not use Claude configuration posture');
  if (request.maxTurns !== undefined || request.maxBudgetUsd !== undefined) throw new TypeError('Codex provider-side turn/budget controls are not authorized by this adapter');

  const args: string[] = [
    'exec',
    '--json',
    '--cd', request.cwd,
    '--ignore-user-config',
    '--ignore-rules',
    '--sandbox', request.posture === 'READ_ONLY' ? 'read-only' : 'workspace-write',
  ];
  if (request.model !== undefined) args.push('--model', request.model);
  if (request.sessionId !== undefined) args.push('resume', request.sessionId, request.prompt);
  else args.push('--ephemeral', request.prompt);

  const forbidden = new Set(['--dangerously-bypass-approvals-and-sandbox', '--dangerously-bypass-hook-trust', '--yolo']);
  if (args.some((arg) => forbidden.has(arg))) throw new Error('dangerous Codex bypass flag generated');

  return {
    adapterId: request.adapterId,
    executablePath: discovery.executablePath,
    args,
    cwd: request.cwd,
    environment: request.environment === undefined ? { mode: 'INHERIT' } : { mode: 'EXACT', values: request.environment },
    timeoutMs: request.timeoutMs,
    stallMs: request.stallMs,
    terminationGraceMs: request.terminationGraceMs,
    outputLimitBytes: request.outputLimitBytes,
    requestedModel: request.model ?? null,
    requestedProvider: null,
    configurationPosture: 'NOT_APPLICABLE',
  };
}

interface ParsedCodex {
  readonly invalid: boolean;
  readonly providerFailed: boolean;
  readonly finalMessage: string | null;
  readonly sessionId: string | null;
  readonly observedModel: string | null;
  readonly warnings: readonly string[];
}

export function parseCodexJsonl(stdout: string): ParsedCodex {
  let invalid = false;
  let providerFailed = false;
  let finalMessage: string | null = null;
  let sessionId: string | null = null;
  let observedModel: string | null = null;
  const warnings: string[] = [];

  const lines = stdout.split(/\r?\n/).filter((line) => line.trim() !== '');
  for (const line of lines) {
    let event: unknown;
    try { event = JSON.parse(line); } catch { invalid = true; continue; }
    if (typeof event !== 'object' || event === null) { invalid = true; continue; }
    const value = event as Record<string, unknown>;
    const type = typeof value.type === 'string' ? value.type : '';
    if (type === 'thread.started' && typeof value.thread_id === 'string') sessionId = value.thread_id;
    if (typeof value.model === 'string') observedModel = value.model;
    if (type === 'item.completed' && typeof value.item === 'object' && value.item !== null) {
      const item = value.item as Record<string, unknown>;
      if (item.type === 'agent_message' && typeof item.text === 'string') finalMessage = item.text;
    }
    if (type.includes('error') || type.includes('failed')) providerFailed = true;
    if (!type) warnings.push('Codex event without string type');
  }
  if (lines.length === 0) invalid = true;
  return { invalid, providerFailed, finalMessage, sessionId, observedModel, warnings };
}

export function runCodex(request: AdapterRunRequest, discovery: AdapterDiscovery) {
  const plan = buildCodexInvocation(request, discovery);
  requireDiscovery(discovery);
  const supervised = superviseInvocation(plan);
  return {
    cancel: () => supervised.cancel(),
    result: (async (): Promise<AdapterRunResult> => {
      const processResult = await supervised.result;
      const processStatus = statusFromProcess(processResult);
      const identityBase: ExecutionIdentity = {
        adapterId: 'openai-codex-cli',
        executablePath: discovery.executablePath,
        cliVersion: discovery.cliVersion,
        requestedModel: request.model ?? null,
        observedModel: null,
        requestedProvider: null,
        observedProvider: null,
        sessionId: request.sessionId ?? null,
      };
      if (processStatus !== null) return { status: processStatus, identity: identityBase, finalMessage: null, processCause: processResult.cause, exitCode: processResult.exitCode, stderr: processResult.stderr, warnings: [] };

      const parsed = parseCodexJsonl(processResult.stdout);
      const identity: ExecutionIdentity = { ...identityBase, observedModel: parsed.observedModel, sessionId: parsed.sessionId ?? identityBase.sessionId };
      if (processResult.exitCode !== 0) {
        const status = authFailureText(`${processResult.stderr}\n${processResult.stdout}`) ? 'AUTH_FAILED' : 'PROVIDER_FAILED';
        return { status, identity, finalMessage: parsed.finalMessage, processCause: processResult.cause, exitCode: processResult.exitCode, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      if (parsed.invalid || parsed.providerFailed || parsed.finalMessage === null) {
        return { status: parsed.providerFailed ? 'PROVIDER_FAILED' : 'INVALID_PROVIDER_OUTPUT', identity, finalMessage: parsed.finalMessage, processCause: processResult.cause, exitCode: processResult.exitCode, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      return { status: 'COMPLETED', identity, finalMessage: parsed.finalMessage, processCause: processResult.cause, exitCode: processResult.exitCode, stderr: processResult.stderr, warnings: parsed.warnings };
    })(),
  };
}
