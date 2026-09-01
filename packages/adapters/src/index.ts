export {
  platformId,
  validateAdapterRunRequest,
  type AdapterCleanupStatus,
  type AdapterDefinition,
  type AdapterDiscovery,
  type AdapterId,
  type AdapterProcessCause,
  type AdapterProcessEvidence,
  type AdapterResultStatus,
  type AdapterRunRequest,
  type AdapterRunResult,
  type AdapterTerminationStrategy,
  type AdapterTier,
  type CapabilitySet,
  type CapabilityStatus,
  type ConfigurationPosture,
  type ExecutionIdentity,
  type ExecutionPosture,
  type InstallationState,
  type InvocationPlan,
  type PlatformId,
} from './types.ts';

export { discoverAdapter, resolveExecutable } from './discovery.ts';
export { authFailureText, processEvidence, statusFromProcess, superviseInvocation } from './invocation.ts';
export { CODEX_DEFINITION, buildCodexInvocation, parseCodexJsonl, runCodex } from './codex.ts';
export { CLAUDE_DEFINITION, buildClaudeInvocation, claudeSupportsRestricted, parseClaudeJson, runClaude } from './claude.ts';
export {
  BASELINE_GOLD_CASES,
  OPTIONAL_CLAIM_CASES,
  assessGold,
  fixtureCannotQualifyGold,
  makeConformanceRecord,
  type ConformanceCaseId,
  type ConformanceFacts,
  type ConformanceOutcome,
  type ConformanceRecord,
  type ConformanceSource,
  type GoldAssessment,
} from './conformance.ts';
