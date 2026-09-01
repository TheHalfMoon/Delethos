import type { AdapterCleanupStatus, AdapterId, AdapterProcessCause, AdapterResultStatus, AdapterTerminationStrategy, PlatformId } from './types.ts';

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
}

export interface ConformanceRecord {
  readonly schema: 'delethos.adapter-conformance.candidate.2';
  readonly source: ConformanceSource;
  readonly adapterId: AdapterId;
  readonly delethosRevision: string;
  readonly executablePath: string | null;
  readonly cliVersion: string | null;
  readonly platform: PlatformId;
  readonly arch: string;
  readonly caseId: ConformanceCaseId;
  readonly outcome: ConformanceOutcome;
  readonly detail: string | null;
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

export const OPTIONAL_CLAIM_CASES: Readonly<Record<'readOnly' | 'modelSelection' | 'resume' | 'stall', readonly ConformanceCaseId[]>> = {
  readOnly: ['read-only', 'forbidden-write'],
  modelSelection: ['model-selection', 'malformed-model'],
  resume: ['resume'],
  stall: ['stall'],
};

function boundedDetail(detail: string | null): string | null {
  if (detail === null) return null;
  return detail.replace(/[\r\n\t]+/g, ' ').slice(0, 2048);
}

function exactRevision(value: string): void {
  if (!/^[0-9a-f]{40}$/i.test(value)) throw new TypeError('expectedRevision must be an exact 40-hex commit');
}

export function makeConformanceRecord(input: Omit<ConformanceRecord, 'schema' | 'detail' | 'facts'> & { readonly detail?: string | null; readonly facts?: ConformanceFacts | null }): ConformanceRecord {
  if (!/^[0-9a-f]{40}$/i.test(input.delethosRevision)) throw new TypeError('delethosRevision must be an exact 40-hex commit');
  if (input.cliVersion !== null && (input.cliVersion.length === 0 || input.cliVersion.length > 512)) throw new TypeError('cliVersion must be bounded');
  return { ...input, schema: 'delethos.adapter-conformance.candidate.2', detail: boundedDetail(input.detail ?? null), facts: input.facts ?? null };
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

    const versions = new Set(exactPass
      .filter((record) => record.caseId !== 'missing-binary' && record.cliVersion !== null)
      .map((record) => record.cliVersion));
    if (versions.size === 0) missing.push(`${platform}:cli-version`);
    else if (versions.size > 1) missing.push(`${platform}:cli-version-consistency`);

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
