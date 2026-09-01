import { digestCanonical, isSha256Digest } from "./digest.ts";
import type { CompiledPolicyV0 } from "./policy.ts";
import type { RunRecordV0 } from "./run.ts";

export const VERIFICATION_FACTS_SCHEMA_V0 = "delethos.verification-facts.experimental.v0" as const;

export type ReviewResult = "PASS" | "CHANGES_REQUIRED" | "ABSTAIN" | "UNAVAILABLE" | "FAILED" | "NOT_RUN";

export interface VerificationFactsV0 {
  readonly schema: typeof VERIFICATION_FACTS_SCHEMA_V0;
  readonly taskDigest: string;
  readonly policyDigest: string;
  readonly changeDigest: string | null;
  readonly deterministicRequirementsPassed: boolean;
  readonly implementerExecutionId: string | null;
  readonly reviewerExecutionId: string | null;
  readonly reviewResult: ReviewResult;
}

export type VerificationErrorCode =
  | "INVALID_INPUT"
  | "UNKNOWN_FIELD"
  | "INVALID_SCHEMA"
  | "INVALID_DIGEST"
  | "VERIFICATION_BINDING_MISMATCH"
  | "VERIFICATION_REQUIREMENT_FAILED"
  | "INDEPENDENT_REVIEW_REQUIRED"
  | "INDEPENDENT_REVIEW_IDENTITY_CONFLICT";

export interface VerificationError {
  readonly code: VerificationErrorCode;
  readonly path: string;
  readonly message: string;
}

export type VerificationFactsResult =
  | { readonly ok: true; readonly facts: VerificationFactsV0; readonly digest: string }
  | { readonly ok: false; readonly error: VerificationError };

export type VerificationEligibilityResult =
  | { readonly ok: true; readonly facts: VerificationFactsV0; readonly factsDigest: string }
  | { readonly ok: false; readonly error: VerificationError };

const REVIEW_RESULTS = new Set<ReviewResult>(["PASS", "CHANGES_REQUIRED", "ABSTAIN", "UNAVAILABLE", "FAILED", "NOT_RUN"]);

function fail(code: VerificationErrorCode, path: string, message: string): VerificationFactsResult {
  return { ok: false, error: { code, path, message } };
}

function eligibilityFail(code: VerificationErrorCode, path: string, message: string): VerificationEligibilityResult {
  return { ok: false, error: { code, path, message } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

function validExecutionId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateVerificationFacts(input: unknown): VerificationFactsResult {
  if (!isRecord(input)) return fail("INVALID_INPUT", "$", "Verification facts must be a plain object.");
  const allowed = new Set(["schema", "taskDigest", "policyDigest", "changeDigest", "deterministicRequirementsPassed", "implementerExecutionId", "reviewerExecutionId", "reviewResult"]);
  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) return fail("UNKNOWN_FIELD", `$.${key}`, `Unknown field: ${key}.`);
  }
  if (input.schema !== VERIFICATION_FACTS_SCHEMA_V0) return fail("INVALID_SCHEMA", "$.schema", `Expected ${VERIFICATION_FACTS_SCHEMA_V0}.`);
  if (!isSha256Digest(input.taskDigest)) return fail("INVALID_DIGEST", "$.taskDigest", "Expected lowercase SHA-256 digest.");
  if (!isSha256Digest(input.policyDigest)) return fail("INVALID_DIGEST", "$.policyDigest", "Expected lowercase SHA-256 digest.");
  if (input.changeDigest !== null && !isSha256Digest(input.changeDigest)) return fail("INVALID_DIGEST", "$.changeDigest", "Expected null or lowercase SHA-256 digest.");
  if (typeof input.deterministicRequirementsPassed !== "boolean") return fail("INVALID_INPUT", "$.deterministicRequirementsPassed", "Expected boolean.");
  if (input.implementerExecutionId !== null && !validExecutionId(input.implementerExecutionId)) return fail("INVALID_INPUT", "$.implementerExecutionId", "Expected null or non-empty string.");
  if (input.reviewerExecutionId !== null && !validExecutionId(input.reviewerExecutionId)) return fail("INVALID_INPUT", "$.reviewerExecutionId", "Expected null or non-empty string.");
  if (typeof input.reviewResult !== "string" || !REVIEW_RESULTS.has(input.reviewResult as ReviewResult)) return fail("INVALID_INPUT", "$.reviewResult", "Unknown review result.");

  const facts: VerificationFactsV0 = Object.freeze({
    schema: VERIFICATION_FACTS_SCHEMA_V0,
    taskDigest: input.taskDigest,
    policyDigest: input.policyDigest,
    changeDigest: input.changeDigest,
    deterministicRequirementsPassed: input.deterministicRequirementsPassed,
    implementerExecutionId: input.implementerExecutionId,
    reviewerExecutionId: input.reviewerExecutionId,
    reviewResult: input.reviewResult as ReviewResult,
  });
  const digest = digestCanonical(facts);
  if (!digest.ok) return fail("INVALID_INPUT", "$", digest.error.message);
  return { ok: true, facts, digest: digest.digest };
}

export function evaluateVerificationEligibility(
  run: RunRecordV0,
  policy: CompiledPolicyV0,
  inputFacts: unknown,
): VerificationEligibilityResult {
  const validated = validateVerificationFacts(inputFacts);
  if (!validated.ok) return validated;

  const policyDigest = digestCanonical(policy);
  if (!policyDigest.ok) return eligibilityFail("INVALID_INPUT", "$policy", policyDigest.error.message);
  if (policyDigest.digest !== run.policyDigest || validated.facts.policyDigest !== run.policyDigest) {
    return eligibilityFail("VERIFICATION_BINDING_MISMATCH", "$.policyDigest", "Verification facts and compiled policy must bind to the run policy digest.");
  }
  if (validated.facts.taskDigest !== run.taskDigest) {
    return eligibilityFail("VERIFICATION_BINDING_MISMATCH", "$.taskDigest", "Verification facts must bind to the run task digest.");
  }
  if (!validated.facts.deterministicRequirementsPassed) {
    return eligibilityFail("VERIFICATION_REQUIREMENT_FAILED", "$.deterministicRequirementsPassed", "Deterministic requirements must pass before VERIFIED.");
  }

  if (policy.requireIndependentReview) {
    if (!validExecutionId(validated.facts.implementerExecutionId) || !validExecutionId(validated.facts.reviewerExecutionId)) {
      return eligibilityFail("INDEPENDENT_REVIEW_REQUIRED", "$", "Independent review requires implementer and reviewer execution identities.");
    }
    if (validated.facts.implementerExecutionId === validated.facts.reviewerExecutionId) {
      return eligibilityFail("INDEPENDENT_REVIEW_IDENTITY_CONFLICT", "$.reviewerExecutionId", "Implementer and reviewer execution identities must differ.");
    }
    if (validated.facts.reviewResult !== "PASS") {
      return eligibilityFail("VERIFICATION_REQUIREMENT_FAILED", "$.reviewResult", "Only PASS satisfies the independent-review requirement.");
    }
  }

  return { ok: true, facts: validated.facts, factsDigest: validated.digest };
}
