import type { AdapterCleanupStatus, AdapterId, AdapterProcessCause, AdapterResultStatus, AdapterTerminationStrategy, ExecutionPosture, PlatformId } from './types.ts';

export type ConformanceSource = 'DETERMINISTIC_FIXTURE' | 'REAL_CLI';
export type ConformanceOutcome = 'PASS' | 'FAIL' | 'UNAVAILABLE' | 'UNVERIFIED';
export type ConformanceCaseId =
  | 'discovery-version'
  | 'missing-binary'
  | 'auth-failure'
  | 'write-success'
  | 'exact-cwd'
  | 'read-only'
  | 'forbidden-write'
  | 'model-selection'
  | 'malformed-model'
  | 'provider-failure'
  | 'timeout'
  | 'stall'
  | 'cancel'
  | 'process-tree-cleanup'
  | 'partial-diff'
  | 'missing-final-response'
  | 'large-output'
  | 'special-paths'
  | 'resume'
  | 'dirty-precondition'
  | 'platform-launch'
  | 'no-hidden-git-write'
  | 'machine-result'
  | 'config-isolation';

export interface ConformanceFacts {
  readonly adapterStatus: AdapterResultStatus | null;
  readonly processCause: AdapterProcessCause | null;
  readonly exitCode: number | null;
  readonly terminationStrategy: AdapterTerminationStrategy | null;
  readonly terminationAttempted: boolean | null;
  readonly cleanupStatus: AdapterCleanupStatus | null;
  readonly elapsedMs: number | null;
  readonly stdoutBytes: number | null;
  readonly stderrBytes: number | null;
  readonly retainedBytes: number | null;
  readonly outputTruncated: boolean | null;
  readonly headUnchanged: boolean | null;
  readonly refsUnchanged: boolean | null;
  readonly worktreeDirty: boolean | null;
  readonly markerObserved: boolean | null;
  readonly finalMessagePresent: boolean | null;
  readonly sessionId: string | null;
  readonly observedModel: string | null;
  readonly gitBaseBefore: string;
  readonly gitStatusAfter: string;
  readonly gitDiffBytes: number;
  readonly gitDiffSha256: string;
}

export interface ConformanceRecord {
  readonly schema: 'delethos.adapter-conformance.candidate.3';
  readonly source: ConformanceSource;
  readonly adapterImplementationVersion: string;
  readonly adapterId: AdapterId;
  readonly delethosRevision: string;
  readonly executablePath: string | null;
  readonly cliVersion: string | null;
  readonly platform: PlatformId;
  readonly arch: string;
  readonly caseId: ConformanceCaseId;
  readonly requestedPosture: ExecutionPosture | null;
  readonly requestedModel: string | null;
  readonly requestedProvider: string | null;
  readonly outcome: ConformanceOutcome;
  readonly detail: string | null;
  readonly limitations: readonly string[];
  readonly facts: ConformanceFacts | null;
}

export const BASELINE_GOLD_CASES: readonly ConformanceCaseId[] = [
  'discovery-version',
  'missing-binary',
  'auth-failure',
  'write-success',
  'exact-cwd',
  'provider-failure',
  'timeout',
  'stall',
  'cancel',
  'process-tree-cleanup',
  'partial-diff',
  'missing-final-response',
  'large-output',
  'special-paths',
  'dirty-precondition',
  'platform-launch',
  'no-hidden-git-write',
  'machine-result',
  'config-isolation',
];

export const OPTIONAL_CLAIM_CASES: Readonly<Record<'readOnly' | 'modelSelection' | 'resume', readonly ConformanceCaseId[]>> = {
  readOnly: ['read-only', 'forbidden-write'],
  modelSelection: ['model-selection', 'malformed-model'],
  resume: ['resume'],
};

const EXACT_SHA = /^[0-9a-f]{40}$/i;
const EXACT_DIGEST = /^[0-9a-f]{64}$/i;
const MAX_DIAGNOSTIC = 2048;
const MAX_STATUS = 4096;

function redact(value: string): string {
  return value
    .replace(/\b(?:OPENAI_API_KEY|CODEX_API_KEY|CODEX_ACCESS_TOKEN|ANTHROPIC_API_KEY|ANTHROPIC_AUTH_TOKEN|CLAUDE_CODE_OAUTH_TOKEN)\s*=\s*[^\s]+/gi, '[REDACTED_CREDENTIAL]')
    .replace(/\bBearer\s+[^\s]+/gi, 'Bearer [REDACTED]')
    .replace(/\bsk-[A-Za-z0-9_-]{8,}\b/g, '[REDACTED_TOKEN]');
}

function boundedDiagnostic(value: string | null): string | null {
  if (value === null) return null;
  return redact(value).replace(/[\r\n\t]+/g, ' ').slice(0, MAX_DIAGNOSTIC);
}

function boundedStatus(value: string): string {
  return redact(value).slice(0, MAX_STATUS);
}

function boundedOptionalIdentity(name: string, value: string | null): string | null {
  if (value === null) return null;
  if (value.length === 0 || value.length > 512 || value.includes('\0')) throw new TypeError(`${name} must be bounded and contain no NUL`);
  return value;
}

function exactRevision(value: string): void {
  if (!EXACT_SHA.test(value)) throw new TypeError('expectedRevision must be an exact 40-hex commit');
}

function normalizeFacts(facts: ConformanceFacts | null | undefined): ConformanceFacts | null {
  if (facts === null || facts === undefined) return null;
  if (!EXACT_SHA.test(facts.gitBaseBefore)) throw new TypeError('gitBaseBefore must be an exact 40-hex commit');
  if (!EXACT_DIGEST.test(facts.gitDiffSha256)) throw new TypeError('gitDiffSha256 must be an exact SHA-256 digest');
  if (!Number.isSafeInteger(facts.gitDiffBytes) || facts.gitDiffBytes < 0) throw new TypeError('gitDiffBytes must be a non-negative safe integer');
  return {
    ...facts,
    sessionId: boundedOptionalIdentity('sessionId', facts.sessionId),
    observedModel: boundedOptionalIdentity('observedModel', facts.observedModel),
    gitStatusAfter: boundedStatus(facts.gitStatusAfter),
  };
}

export function makeConformanceRecord(
  input: Omit<ConformanceRecord, 'schema' | 'detail' | 'limitations' | 'facts'> & {
    readonly detail?: string | null;
    readonly limitations?: readonly string[];
    readonly facts?: ConformanceFacts | null;
  },
): ConformanceRecord {
  if (!EXACT_SHA.test(input.delethosRevision)) throw new TypeError('delethosRevision must be an exact 40-hex commit');
  if (input.adapterImplementationVersion.length === 0 || input.adapterImplementationVersion.length > 128 || input.adapterImplementationVersion.includes('\0')) throw new TypeError('adapterImplementationVersion must be bounded');
  if (input.cliVersion !== null && (input.cliVersion.length === 0 || input.cliVersion.length > 512 || input.cliVersion.includes('\0'))) throw new TypeError('cliVersion must be bounded');
  if (input.requestedPosture !== null && input.requestedPosture !== 'WRITE' && input.requestedPosture !== 'READ_ONLY') throw new TypeError('requestedPosture must be WRITE, READ_ONLY, or null');
  const limitations = (input.limitations ?? []).slice(0, 16).map((value) => boundedDiagnostic(value)?.slice(0, MAX_DIAGNOSTIC) ?? '');
  return {
    ...input,
    schema: 'delethos.adapter-conformance.candidate.3',
    requestedModel: boundedOptionalIdentity('requestedModel', input.requestedModel),
    requestedProvider: boundedOptionalIdentity('requestedProvider', input.requestedProvider),
    detail: boundedDiagnostic(input.detail ?? null),
    limitations,
    facts: normalizeFacts(input.facts),
  };
}

export interface GoldAssessment {
  readonly eligible: boolean;
  readonly missing: readonly string[];
}

export function assessGold(
  adapterId: AdapterId,
  expectedRevision: string,
  records: readonly ConformanceRecord[],
  claimedCases: readonly ConformanceCaseId[] = BASELINE_GOLD_CASES,
  platforms: readonly PlatformId[] = ['linux', 'macos', 'windows'],
): GoldAssessment {
  exactRevision(expectedRevision);
  const missing: string[] = [];

  for (const platform of platforms) {
    const exactPass = records.filter((record) =>
      record.adapterId === adapterId
      && record.platform === platform
      && record.source === 'REAL_CLI'
      && record.outcome === 'PASS'
      && record.delethosRevision === expectedRevision
      && record.facts !== null
      && record.facts.headUnchanged === true
      && record.facts.refsUnchanged === true,
    );

    const cliVersions = new Set(exactPass.filter((record) => record.caseId !== 'missing-binary' && record.cliVersion !== null).map((record) => record.cliVersion));
    if (cliVersions.size === 0) missing.push(`${platform}:cli-version`);
    else if (cliVersions.size > 1) missing.push(`${platform}:cli-version-consistency`);

    const implementationVersions = new Set(exactPass.map((record) => record.adapterImplementationVersion));
    if (implementationVersions.size === 0) missing.push(`${platform}:adapter-implementation-version`);
    else if (implementationVersions.size > 1) missing.push(`${platform}:adapter-implementation-version-consistency`);

    for (const caseId of claimedCases) {
      const pass = exactPass.some((record) => {
        if (record.caseId !== caseId) return false;
        if (caseId === 'missing-binary') return record.executablePath === null && record.cliVersion === null;
        return record.executablePath !== null && record.cliVersion !== null;
      });
      if (!pass) missing.push(`${platform}:${caseId}`);
    }
  }

  return { eligible: missing.length === 0, missing };
}

export function fixtureCannotQualifyGold(records: readonly ConformanceRecord[]): boolean {
  return records.every((record) => record.source !== 'REAL_CLI' || record.outcome !== 'PASS');
}
