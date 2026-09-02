import { statSync } from 'node:fs';
import { isAbsolute } from 'node:path';

export type AdapterId = 'openai-codex-cli' | 'anthropic-claude-code' | 'pi-coding-agent' | 'opencode';
export type CapabilityStatus = 'SUPPORTED' | 'PARTIAL' | 'UNSUPPORTED' | 'UNAVAILABLE' | 'UNVERIFIED';
export type AdapterTier = 'GOLD' | 'SUPPORTED' | 'EXPERIMENTAL' | 'COMMUNITY';
export type AdapterCandidateStatus = 'SELECTED_GOLD_CANDIDATE' | 'QUALIFYING' | 'GOLD' | 'BLOCKED';
export type PlatformId = 'linux' | 'macos' | 'windows';
export type ExecutionPosture = 'WRITE' | 'READ_ONLY';
export type ConfigurationPosture = 'CONTROLLED_BARE' | 'CONTROLLED_STANDARD' | 'NOT_APPLICABLE';
export type InstallationState = 'DISCOVERED' | 'NOT_INSTALLED' | 'DISCOVERY_FAILED' | 'AMBIGUOUS';
export type AdapterResultStatus = 'COMPLETED' | 'PROVIDER_FAILED' | 'INVALID_PROVIDER_OUTPUT' | 'AUTH_FAILED' | 'CONFIGURATION_FAILED' | 'UNSUPPORTED_CAPABILITY' | 'PROCESS_FAILED' | 'CANCELLED' | 'TIMED_OUT' | 'STALLED' | 'OUTPUT_LIMIT';
export type AdapterProcessCause = 'EXITED' | 'FAILED_TO_START' | 'CANCELLED' | 'TIMED_OUT' | 'STALLED' | 'OUTPUT_LIMIT';
export type AdapterCleanupStatus = 'NOT_NEEDED' | 'SUCCEEDED' | 'FAILED';
export type AdapterTerminationStrategy = 'NONE' | 'POSIX_PROCESS_GROUP' | 'WINDOWS_TASKKILL_TREE';
export type AdapterEnvironmentPolicy =
  | { readonly mode: 'INHERIT' }
  | { readonly mode: 'EXACT'; readonly values: Readonly<Record<string, string>> };

export interface CapabilitySet {
  readonly headless: CapabilityStatus;
  readonly exactCwd: CapabilityStatus;
  readonly write: CapabilityStatus;
  readonly readOnly: CapabilityStatus;
  readonly machineReadableOutput: CapabilityStatus;
  readonly modelSelection: CapabilityStatus;
  readonly providerSelection: CapabilityStatus;
  readonly resume: CapabilityStatus;
  readonly cancellation: CapabilityStatus;
  readonly turnLimit: CapabilityStatus;
  readonly budgetLimit: CapabilityStatus;
  readonly toolRestriction: CapabilityStatus;
  readonly permissionControl: CapabilityStatus;
  readonly configurationIsolation: CapabilityStatus;
}

export interface AdapterDiscovery {
  readonly adapterId: AdapterId;
  readonly state: InstallationState;
  readonly executablePath: string | null;
  readonly cliVersion: string | null;
  readonly detail: string | null;
}

export interface AdapterRunRequest {
  readonly adapterId: AdapterId;
  readonly cwd: string;
  readonly prompt: string;
  readonly posture: ExecutionPosture;
  readonly environmentPolicy: AdapterEnvironmentPolicy;
  readonly model?: string;
  readonly provider?: string;
  readonly sessionId?: string;
  readonly timeoutMs?: number;
  readonly stallMs?: number;
  readonly terminationGraceMs?: number;
  readonly outputLimitBytes?: number;
  readonly configurationPosture?: ConfigurationPosture;
  readonly maxTurns?: number;
  readonly maxBudgetUsd?: number;
}

export interface InvocationPlan {
  readonly adapterId: AdapterId;
  readonly executablePath: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly environment: AdapterEnvironmentPolicy;
  readonly timeoutMs?: number;
  readonly stallMs?: number;
  readonly terminationGraceMs?: number;
  readonly outputLimitBytes?: number;
  readonly requestedModel: string | null;
  readonly requestedProvider: string | null;
  readonly configurationPosture: ConfigurationPosture;
}

export interface ExecutionIdentity {
  readonly adapterId: AdapterId;
  readonly adapterImplementationVersion: string;
  readonly executablePath: string;
  readonly cliVersion: string;
  readonly requestedModel: string | null;
  readonly observedModel: string | null;
  readonly requestedProvider: string | null;
  readonly observedProvider: string | null;
  readonly sessionId: string | null;
}

export interface AdapterProcessEvidence {
  readonly processCause: AdapterProcessCause;
  readonly exitCode: number | null;
  readonly terminationStrategy: AdapterTerminationStrategy;
  readonly terminationAttempted: boolean;
  readonly cleanupStatus: AdapterCleanupStatus;
  readonly cleanupDetail: string | null;
  readonly elapsedMs: number;
  readonly stdoutBytes: number;
  readonly stderrBytes: number;
  readonly retainedBytes: number;
  readonly outputTruncated: boolean;
}

export interface AdapterRunResult extends AdapterProcessEvidence {
  readonly status: AdapterResultStatus;
  readonly identity: ExecutionIdentity;
  readonly finalMessage: string | null;
  readonly stderr: string;
  readonly warnings: readonly string[];
}

export interface AdapterDefinition {
  readonly id: AdapterId;
  readonly implementationVersion: string;
  readonly tier: AdapterTier;
  readonly candidateStatus: AdapterCandidateStatus;
  readonly commandName: string;
  readonly versionArgs: readonly string[];
  readonly capabilities: CapabilitySet;
}

const MAX_PROMPT = 256 * 1024;
const MAX_ID = 512;
const MAX_LIMIT = 64 * 1024 * 1024;
const MAX_DELAY = 24 * 60 * 60 * 1000;
const AUTHORIZED_ADAPTERS: ReadonlySet<AdapterId> = new Set<AdapterId>(['openai-codex-cli', 'anthropic-claude-code', 'pi-coding-agent', 'opencode']);

function optionalBoundedString(name: string, value: string | undefined): void {
  if (value === undefined) return;
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_ID || value.includes('\0')) throw new TypeError(`${name} must be a non-empty bounded string without NUL`);
}

function optionalPositive(name: string, value: number | undefined, maximum = MAX_DELAY): void {
  if (value === undefined) return;
  if (!Number.isSafeInteger(value) || value <= 0 || value > maximum) throw new TypeError(`${name} must be a positive bounded safe integer`);
}

function requireExistingDirectory(path: string): void {
  try {
    if (!statSync(path).isDirectory()) throw new TypeError('cwd must be an existing directory');
  } catch (error) {
    if (error instanceof TypeError) throw error;
    throw new TypeError('cwd must be an existing directory');
  }
}

function validateEnvironmentPolicy(policy: AdapterEnvironmentPolicy): void {
  if (policy === undefined || policy === null || (policy.mode !== 'INHERIT' && policy.mode !== 'EXACT')) throw new TypeError('environmentPolicy must explicitly be INHERIT or EXACT');
  if (policy.mode === 'INHERIT') return;
  for (const [key, value] of Object.entries(policy.values)) {
    if (key.length === 0 || key.includes('\0') || key.includes('=')) throw new TypeError('environment keys must be non-empty and contain no NUL or equals sign');
    if (typeof value !== 'string' || value.includes('\0')) throw new TypeError('environment values must be strings without NUL');
  }
}

export function validateAdapterRunRequest(request: AdapterRunRequest): void {
  if (!AUTHORIZED_ADAPTERS.has(request.adapterId)) throw new TypeError('adapterId is not authorized by Specification 003');
  if (!isAbsolute(request.cwd)) throw new TypeError('cwd must be absolute');
  requireExistingDirectory(request.cwd);
  if (typeof request.prompt !== 'string' || request.prompt.length === 0 || request.prompt.length > MAX_PROMPT || request.prompt.includes('\0')) throw new TypeError('prompt must be non-empty, bounded, and contain no NUL');
  if (request.posture !== 'WRITE' && request.posture !== 'READ_ONLY') throw new TypeError('posture must be WRITE or READ_ONLY');
  validateEnvironmentPolicy(request.environmentPolicy);
  optionalBoundedString('model', request.model);
  optionalBoundedString('provider', request.provider);
  optionalBoundedString('sessionId', request.sessionId);
  optionalPositive('timeoutMs', request.timeoutMs);
  optionalPositive('stallMs', request.stallMs);
  optionalPositive('terminationGraceMs', request.terminationGraceMs);
  optionalPositive('outputLimitBytes', request.outputLimitBytes, MAX_LIMIT);
  optionalPositive('maxTurns', request.maxTurns, 10_000);
  if (request.maxBudgetUsd !== undefined && (!Number.isFinite(request.maxBudgetUsd) || request.maxBudgetUsd <= 0 || request.maxBudgetUsd > 10_000)) throw new TypeError('maxBudgetUsd must be a positive bounded number');
}

export function platformId(): PlatformId {
  if (process.platform === 'win32') return 'windows';
  if (process.platform === 'darwin') return 'macos';
  return 'linux';
}
