import { digestCanonical } from "./digest.ts";

export const POLICY_INPUT_SCHEMA_V0 = "delethos.policy-input.experimental.v0" as const;
export const POLICY_SCHEMA_V0 = "delethos.policy.experimental.v0" as const;
export const MAX_REPAIR_ATTEMPTS = 3;

export interface PolicyInputV0 {
  readonly schema: typeof POLICY_INPUT_SCHEMA_V0;
  readonly requireIndependentReview: boolean;
  readonly maxRepairAttempts: number;
  readonly timeoutMs?: number;
  readonly stallThresholdMs?: number;
  readonly humanFinalAuthority: true;
}

export interface CompiledPolicyV0 {
  readonly schema: typeof POLICY_SCHEMA_V0;
  readonly requireIndependentReview: boolean;
  readonly maxRepairAttempts: number;
  readonly timeoutMs: number | null;
  readonly stallThresholdMs: number | null;
  readonly humanFinalAuthority: true;
  readonly verification: {
    readonly requireTaskBinding: true;
    readonly requirePolicyBinding: true;
    readonly requirePassingIndependentReview: boolean;
  };
}

export type PolicyValidationErrorCode =
  | "INVALID_INPUT"
  | "UNKNOWN_FIELD"
  | "INVALID_SCHEMA"
  | "INVALID_POLICY";

export interface PolicyValidationError {
  readonly code: PolicyValidationErrorCode;
  readonly path: string;
  readonly message: string;
}

export type CompilePolicyResult =
  | { readonly ok: true; readonly policy: CompiledPolicyV0; readonly digest: string }
  | { readonly ok: false; readonly error: PolicyValidationError };

function fail(code: PolicyValidationErrorCode, path: string, message: string): CompilePolicyResult {
  return { ok: false, error: { code, path, message } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

function positiveSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

export function compilePolicy(input: unknown): CompilePolicyResult {
  if (!isRecord(input)) return fail("INVALID_INPUT", "$", "Policy input must be a plain object.");
  const allowed = new Set(["schema", "requireIndependentReview", "maxRepairAttempts", "timeoutMs", "stallThresholdMs", "humanFinalAuthority"]);
  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) return fail("UNKNOWN_FIELD", `$.${key}`, `Unknown field: ${key}.`);
  }
  if (input.schema !== POLICY_INPUT_SCHEMA_V0) return fail("INVALID_SCHEMA", "$.schema", `Expected ${POLICY_INPUT_SCHEMA_V0}.`);
  if (typeof input.requireIndependentReview !== "boolean") return fail("INVALID_POLICY", "$.requireIndependentReview", "Expected boolean.");
  if (!Number.isSafeInteger(input.maxRepairAttempts) || typeof input.maxRepairAttempts !== "number" || input.maxRepairAttempts < 0 || input.maxRepairAttempts > MAX_REPAIR_ATTEMPTS) {
    return fail("INVALID_POLICY", "$.maxRepairAttempts", `Expected integer in [0, ${MAX_REPAIR_ATTEMPTS}].`);
  }
  if (input.timeoutMs !== undefined && !positiveSafeInteger(input.timeoutMs)) return fail("INVALID_POLICY", "$.timeoutMs", "Expected a positive safe integer when provided.");
  if (input.stallThresholdMs !== undefined && !positiveSafeInteger(input.stallThresholdMs)) return fail("INVALID_POLICY", "$.stallThresholdMs", "Expected a positive safe integer when provided.");
  if (positiveSafeInteger(input.timeoutMs) && positiveSafeInteger(input.stallThresholdMs) && input.stallThresholdMs >= input.timeoutMs) {
    return fail("INVALID_POLICY", "$.stallThresholdMs", "stallThresholdMs must be less than timeoutMs.");
  }
  if (input.humanFinalAuthority !== true) return fail("INVALID_POLICY", "$.humanFinalAuthority", "Specification 001 requires humanFinalAuthority=true.");

  const policy: CompiledPolicyV0 = Object.freeze({
    schema: POLICY_SCHEMA_V0,
    requireIndependentReview: input.requireIndependentReview,
    maxRepairAttempts: input.maxRepairAttempts,
    timeoutMs: input.timeoutMs === undefined ? null : input.timeoutMs,
    stallThresholdMs: input.stallThresholdMs === undefined ? null : input.stallThresholdMs,
    humanFinalAuthority: true,
    verification: Object.freeze({
      requireTaskBinding: true,
      requirePolicyBinding: true,
      requirePassingIndependentReview: input.requireIndependentReview,
    }),
  });
  const digest = digestCanonical(policy);
  if (!digest.ok) return fail("INVALID_POLICY", "$", digest.error.message);
  return { ok: true, policy, digest: digest.digest };
}
