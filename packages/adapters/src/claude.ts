import type { AdapterDefinition, AdapterDiscovery, AdapterRunRequest, AdapterRunResult, ConfigurationPosture, ExecutionIdentity, InvocationPlan } from './types.ts';
import { validateAdapterRunRequest } from './types.ts';
import { authFailureText, processEvidence, statusFromProcess, superviseInvocation } from './invocation.ts';

export const CLAUDE_DEFINITION: AdapterDefinition = {
  id: 'anthropic-claude-code',
  commandName: 'claude',
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
  if (discovery.adapterId !== 'anthropic-claude-code' || discovery.state !== 'DISCOVERED' || !discovery.executablePath || !discovery.cliVersion) {
    throw new TypeError('Claude Code must be discovered with an exact executable and version before invocation');
  }
}

function requireConfigurationPosture(value: ConfigurationPosture | undefined): Exclude<ConfigurationPosture, 'NOT_APPLICABLE'> {
  if (value !== 'CONTROLLED_BARE' && value !== 'CONTROLLED_STANDARD') {
    throw new TypeError('Claude Code requires explicit CONTROLLED_BARE or CONTROLLED_STANDARD posture');
  }
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

export function buildClaudeInvocation(request: AdapterRunRequest, discovery: AdapterDiscovery): InvocationPlan {
  validateAdapterRunRequest(request);
  if (request.adapterId !== 'anthropic-claude-code') throw new TypeError('request is not for Claude Code');
  requireDiscovery(discovery);
  if (request.provider !== undefined) throw new TypeError('Claude provider selection is not authorized by the initial adapter contract');
  const posture = requireConfigurationPosture(request.configurationPosture);

  const args: string[] = ['-p', request.prompt, '--output-format', 'json'];
  if (request.posture === 'READ_ONLY') {
    if (posture !== 'CONTROLLED_STANDARD') throw new TypeError('Claude READ_ONLY requires CONTROLLED_STANDARD so restricted mode owns configuration isolation');
    if (!claudeSupportsRestricted(discovery.cliVersion)) throw new TypeError('Claude READ_ONLY requires Claude Code >= 2.1.248 with --restricted support');
    args.push('--restricted', '--permission-mode', 'plan', '--tools', 'Read,Glob,Grep', '--disallowedTools', 'mcp__*');
  } else {
    if (posture === 'CONTROLLED_BARE') args.push('--bare');
    else args.push('--setting-sources', '', '--strict-mcp-config');
    args.push('--permission-mode', 'dontAsk', '--tools', 'Read,Glob,Grep,Edit,Write');
  }
  if (request.model !== undefined) args.push('--model', request.model);
  if (request.maxTurns !== undefined) args.push('--max-turns', String(request.maxTurns));
  if (request.maxBudgetUsd !== undefined) args.push('--max-budget-usd', String(request.maxBudgetUsd));
  if (request.sessionId !== undefined) args.push('--resume', request.sessionId);

  if (args.includes('--dangerously-skip-permissions') || args.includes('--allow-dangerously-skip-permissions') || args.includes('bypassPermissions')) throw new Error('dangerous Claude permission bypass generated');

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
    configurationPosture: posture,
  };
}

interface ParsedClaude {
  readonly invalid: boolean;
  readonly providerFailed: boolean;
  readonly finalMessage: string | null;
  readonly sessionId: string | null;
  readonly observedModel: string | null;
  readonly warnings: readonly string[];
}

export function parseClaudeJson(stdout: string): ParsedClaude {
  const trimmed = stdout.trim();
  if (!trimmed) return { invalid: true, providerFailed: false, finalMessage: null, sessionId: null, observedModel: null, warnings: [] };
  let value: unknown;
  try { value = JSON.parse(trimmed); } catch { return { invalid: true, providerFailed: false, finalMessage: null, sessionId: null, observedModel: null, warnings: [] }; }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return { invalid: true, providerFailed: false, finalMessage: null, sessionId: null, observedModel: null, warnings: [] };
  const record = value as Record<string, unknown>;
  const finalMessage = typeof record.result === 'string' ? record.result : null;
  const sessionId = typeof record.session_id === 'string' ? record.session_id : null;
  const observedModel = typeof record.model === 'string' ? record.model : null;
  const providerFailed = record.is_error === true || record.subtype === 'error' || record.type === 'error';
  const warnings: string[] = [];
  if (record.type !== undefined && typeof record.type !== 'string') warnings.push('Claude result type is not a string');
  return { invalid: false, providerFailed, finalMessage, sessionId, observedModel, warnings };
}

export function runClaude(request: AdapterRunRequest, discovery: AdapterDiscovery) {
  const plan = buildClaudeInvocation(request, discovery);
  requireDiscovery(discovery);
  const supervised = superviseInvocation(plan);
  return {
    cancel: () => supervised.cancel(),
    result: (async (): Promise<AdapterRunResult> => {
      const processResult = await supervised.result;
      const mechanism = processEvidence(processResult);
      const processStatus = statusFromProcess(processResult);
      const identityBase: ExecutionIdentity = {
        adapterId: 'anthropic-claude-code',
        executablePath: discovery.executablePath,
        cliVersion: discovery.cliVersion,
        requestedModel: request.model ?? null,
        observedModel: null,
        requestedProvider: null,
        observedProvider: null,
        sessionId: request.sessionId ?? null,
      };
      if (processStatus !== null) return { status: processStatus, identity: identityBase, finalMessage: null, ...mechanism, stderr: processResult.stderr, warnings: [] };

      const parsed = parseClaudeJson(processResult.stdout);
      const identity: ExecutionIdentity = { ...identityBase, observedModel: parsed.observedModel, sessionId: parsed.sessionId ?? identityBase.sessionId };
      if (processResult.exitCode !== 0) {
        const status = authFailureText(`${processResult.stderr}\n${processResult.stdout}`) ? 'AUTH_FAILED' : 'PROVIDER_FAILED';
        return { status, identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      if (parsed.invalid || parsed.providerFailed || parsed.finalMessage === null) {
        return { status: parsed.providerFailed ? 'PROVIDER_FAILED' : 'INVALID_PROVIDER_OUTPUT', identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
      }
      return { status: 'COMPLETED', identity, finalMessage: parsed.finalMessage, ...mechanism, stderr: processResult.stderr, warnings: parsed.warnings };
    })(),
  };
}
