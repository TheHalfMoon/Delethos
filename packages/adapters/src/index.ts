export {
  platformId,
  validateAdapterRunRequest,
  type AdapterCandidateStatus,
  type AdapterCleanupStatus,
  type AdapterDefinition,
  type AdapterDiscovery,
  type AdapterEnvironmentPolicy,
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
export { CODEX_DEFINITION, buildCodexInvocation, parseCodexJsonl, runCodexQualified as runCodex } from './codex.ts';
export { CLAUDE_DEFINITION, buildClaudeInvocation, claudeSupportsRestricted, parseClaudeJson, runClaudeQualified as runClaude } from './claude.ts';
export { PI_DEFINITION, buildPiInvocation, parsePiJsonl, runPiQualified as runPi } from './pi.ts';
export { OPENCODE_DEFINITION, buildOpenCodeInvocation, parseOpenCodeJsonl, runOpenCodeQualified as runOpenCode } from './opencode.ts';
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
