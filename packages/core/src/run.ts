import { isSha256Digest } from "./digest.ts";
import { evaluateVerificationEligibility, type VerificationErrorCode, type VerificationFactsV0 } from "./evidence.ts";
import type { CompiledPolicyV0 } from "./policy.ts";

export const RUN_SCHEMA_V0 = "delethos.run.experimental.v0" as const;

export type RunState =
  | "QUEUED"
  | "PREPARING"
  | "RUNNING"
  | "WAITING"
  | "REVIEW_REQUIRED"
  | "CHANGES_REQUIRED"
  | "VERIFIED"
  | "STALLED"
  | "TIMED_OUT"
  | "FAILED"
  | "CANCELLED";

export interface RunRecordV0 {
  readonly schema: typeof RUN_SCHEMA_V0;
  readonly id: string;
  readonly taskDigest: string;
  readonly policyDigest: string;
  readonly state: RunState;
  readonly revision: number;
  readonly implementerExecutionId: string | null;
  readonly reviewerExecutionId: string | null;
  readonly verificationFactsDigest: string | null;
}

export type TransitionErrorCode = VerificationErrorCode
  | "INVALID_RUN_STATE"
  | "INVALID_TRANSITION"
  | "TERMINAL_STATE";

export interface TransitionError {
  readonly code: TransitionErrorCode;
  readonly message: string;
}

export type CreateRunResult =
  | { readonly ok: true; readonly run: RunRecordV0 }
  | { readonly ok: false; readonly error: TransitionError };

export type TransitionResult =
  | { readonly ok: true; readonly run: RunRecordV0 }
  | { readonly ok: false; readonly error: TransitionError };

export interface TransitionContextV0 {
  readonly implementerExecutionId?: string | null;
  readonly reviewerExecutionId?: string | null;
  readonly policy?: CompiledPolicyV0;
  readonly verificationFacts?: VerificationFactsV0;
}

const RUN_RECORD_BRAND = Symbol("delethos.run.experimental.v0.brand");
type BrandedRunRecord = RunRecordV0 & { readonly [RUN_RECORD_BRAND]: true };

export const TERMINAL_RUN_STATES = Object.freeze(new Set<RunState>(["VERIFIED", "STALLED", "TIMED_OUT", "FAILED", "CANCELLED"]));

const TRANSITIONS: Readonly<Record<Exclude<RunState, "VERIFIED" | "STALLED" | "TIMED_OUT" | "FAILED" | "CANCELLED">, ReadonlySet<RunState>>> = Object.freeze({
  QUEUED: new Set<RunState>(["PREPARING", "CANCELLED", "FAILED"]),
  PREPARING: new Set<RunState>(["RUNNING", "CANCELLED", "FAILED"]),
  RUNNING: new Set<RunState>(["WAITING", "REVIEW_REQUIRED", "VERIFIED", "STALLED", "TIMED_OUT", "FAILED", "CANCELLED"]),
  WAITING: new Set<RunState>(["RUNNING", "REVIEW_REQUIRED", "STALLED", "TIMED_OUT", "FAILED", "CANCELLED"]),
  REVIEW_REQUIRED: new Set<RunState>(["CHANGES_REQUIRED", "VERIFIED", "FAILED", "CANCELLED"]),
  CHANGES_REQUIRED: new Set<RunState>(["RUNNING", "FAILED", "CANCELLED"]),
});

function error(code: TransitionErrorCode, message: string): TransitionResult {
  return { ok: false, error: { code, message } };
}

function createError(code: TransitionErrorCode, message: string): CreateRunResult {
  return { ok: false, error: { code, message } };
}

function validId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function makeRunRecord(data: RunRecordV0): BrandedRunRecord {
  const run = { ...data } as BrandedRunRecord;
  Object.defineProperty(run, RUN_RECORD_BRAND, { value: true, enumerable: false, writable: false, configurable: false });
  return Object.freeze(run);
}

function isTrustedRunRecord(run: RunRecordV0): run is BrandedRunRecord {
  return (run as Partial<BrandedRunRecord>)[RUN_RECORD_BRAND] === true;
}

function validateOptionalExecutionId(value: string | null | undefined): boolean {
  return value === undefined || value === null || validId(value);
}

export function createRun(input: {
  readonly id: string;
  readonly taskDigest: string;
  readonly policyDigest: string;
}): CreateRunResult {
  if (!validId(input.id)) return createError("INVALID_INPUT", "Run id must be a non-empty string.");
  if (!isSha256Digest(input.taskDigest) || !isSha256Digest(input.policyDigest)) return createError("INVALID_DIGEST", "Run task/policy digests must be lowercase SHA-256 values.");
  return {
    ok: true,
    run: makeRunRecord({
      schema: RUN_SCHEMA_V0,
      id: input.id,
      taskDigest: input.taskDigest,
      policyDigest: input.policyDigest,
      state: "QUEUED",
      revision: 0,
      implementerExecutionId: null,
      reviewerExecutionId: null,
      verificationFactsDigest: null,
    }),
  };
}

export function canTransition(from: RunState, to: RunState): boolean {
  if (TERMINAL_RUN_STATES.has(from)) return false;
  return TRANSITIONS[from as keyof typeof TRANSITIONS].has(to);
}

export function transitionRun(
  run: RunRecordV0,
  nextState: RunState,
  context: TransitionContextV0 = {},
): TransitionResult {
  if (!isTrustedRunRecord(run)) return error("INVALID_INPUT", "Run record was not created by the Delethos core.");
  if (TERMINAL_RUN_STATES.has(run.state)) return error("TERMINAL_STATE", `${run.state} is terminal in Specification 001.`);
  if (!canTransition(run.state, nextState)) return error("INVALID_TRANSITION", `Transition ${run.state} -> ${nextState} is not allowed.`);
  if (!validateOptionalExecutionId(context.implementerExecutionId) || !validateOptionalExecutionId(context.reviewerExecutionId)) {
    return error("INVALID_INPUT", "Execution identities must be null or non-empty strings.");
  }

  let implementerExecutionId = context.implementerExecutionId === undefined ? run.implementerExecutionId : context.implementerExecutionId;
  let reviewerExecutionId = context.reviewerExecutionId === undefined ? run.reviewerExecutionId : context.reviewerExecutionId;
  let verificationFactsDigest = run.verificationFactsDigest;

  if (nextState === "VERIFIED") {
    if (!context.policy || !context.verificationFacts) return error("VERIFICATION_REQUIREMENT_FAILED", "VERIFIED requires the exact compiled policy and verification facts.");
    if (context.policy.requireIndependentReview && run.state !== "REVIEW_REQUIRED") {
      return error("INDEPENDENT_REVIEW_REQUIRED", "Review-required policies must reach VERIFIED from REVIEW_REQUIRED.");
    }
    const eligibility = evaluateVerificationEligibility(run, context.policy, context.verificationFacts);
    if (!eligibility.ok) return error(eligibility.error.code, eligibility.error.message);
    implementerExecutionId = eligibility.facts.implementerExecutionId;
    reviewerExecutionId = eligibility.facts.reviewerExecutionId;
    verificationFactsDigest = eligibility.factsDigest;
  }

  return {
    ok: true,
    run: makeRunRecord({
      ...run,
      state: nextState,
      revision: run.revision + 1,
      implementerExecutionId,
      reviewerExecutionId,
      verificationFactsDigest,
    }),
  };
}
