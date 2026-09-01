import type { AdapterId, PlatformId } from './types.ts';

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

export interface ConformanceRecord {
  readonly schema: 'delethos.adapter-conformance.candidate.1';
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
}

export const BASELINE_GOLD_CASES: readonly ConformanceCaseId[] = [
  'discovery-version',
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

export function makeConformanceRecord(input: Omit<ConformanceRecord, 'schema' | 'detail'> & { readonly detail?: string | null }): ConformanceRecord {
  if (!/^[0-9a-f]{40}$/i.test(input.delethosRevision)) throw new TypeError('delethosRevision must be an exact 40-hex commit');
  if (input.cliVersion !== null && (input.cliVersion.length === 0 || input.cliVersion.length > 512)) throw new TypeError('cliVersion must be bounded');
  return { ...input, schema: 'delethos.adapter-conformance.candidate.1', detail: boundedDetail(input.detail ?? null) };
}

export interface GoldAssessment {
  readonly eligible: boolean;
  readonly missing: readonly string[];
}

export function assessGold(
  adapterId: AdapterId,
  records: readonly ConformanceRecord[],
  claimedCases: readonly ConformanceCaseId[] = BASELINE_GOLD_CASES,
  platforms: readonly PlatformId[] = ['linux', 'macos', 'windows'],
): GoldAssessment {
  const missing: string[] = [];
  for (const platform of platforms) {
    for (const caseId of claimedCases) {
      const pass = records.some((record) => record.adapterId === adapterId && record.platform === platform && record.caseId === caseId && record.source === 'REAL_CLI' && record.outcome === 'PASS');
      if (!pass) missing.push(`${platform}:${caseId}`);
    }
  }
  return { eligible: missing.length === 0, missing };
}

export function fixtureCannotQualifyGold(records: readonly ConformanceRecord[]): boolean {
  return records.every((record) => record.source !== 'REAL_CLI' || record.outcome !== 'PASS');
}
