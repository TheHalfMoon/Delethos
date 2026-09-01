import assert from "node:assert/strict";
import test from "node:test";

import {
  POLICY_INPUT_SCHEMA_V0,
  VERIFICATION_FACTS_SCHEMA_V0,
  compilePolicy,
  createRun,
  evaluateVerificationEligibility,
  transitionRun,
  validateVerificationFacts,
} from "../src/index.ts";

const taskDigest = "a".repeat(64);
const otherDigest = "c".repeat(64);

function setup(review: boolean) {
  const compiled = compilePolicy({ schema: POLICY_INPUT_SCHEMA_V0, requireIndependentReview: review, maxRepairAttempts: 1, humanFinalAuthority: true });
  assert.equal(compiled.ok, true);
  if (!compiled.ok) throw new Error("policy failed");
  const created = createRun({ id: "r", taskDigest, policyDigest: compiled.digest });
  assert.equal(created.ok, true);
  if (!created.ok) throw new Error("run failed");
  const preparing = transitionRun(created.run, "PREPARING");
  assert.equal(preparing.ok, true);
  if (!preparing.ok) throw new Error("transition failed");
  const running = transitionRun(preparing.run, "RUNNING", { implementerExecutionId: "impl" });
  assert.equal(running.ok, true);
  if (!running.ok) throw new Error("transition failed");
  return { compiled, run: running.run };
}

function facts(policyDigest: string, overrides: Record<string, unknown> = {}) {
  return {
    schema: VERIFICATION_FACTS_SCHEMA_V0,
    taskDigest,
    policyDigest,
    changeDigest: null,
    deterministicRequirementsPassed: true,
    implementerExecutionId: "impl",
    reviewerExecutionId: "reviewer",
    reviewResult: "PASS" as const,
    ...overrides,
  };
}

test("validates verification facts and produces a digest", () => {
  const { compiled } = setup(false);
  const result = validateVerificationFacts(facts(compiled.digest));
  assert.equal(result.ok, true);
  if (result.ok) assert.match(result.digest, /^[0-9a-f]{64}$/);
});

test("rejects unknown fields and invalid digests", () => {
  const { compiled } = setup(false);
  assert.equal(validateVerificationFacts({ ...facts(compiled.digest), extra: true }).ok, false);
  assert.equal(validateVerificationFacts({ ...facts(compiled.digest), taskDigest: "bad" }).ok, false);
});

test("requires exact task and policy binding", () => {
  const { compiled, run } = setup(false);
  const wrongTask = evaluateVerificationEligibility(run, compiled.policy, facts(compiled.digest, { taskDigest: otherDigest }));
  assert.equal(wrongTask.ok, false);
  const wrongPolicy = evaluateVerificationEligibility(run, compiled.policy, facts(otherDigest));
  assert.equal(wrongPolicy.ok, false);
});

test("requires deterministic requirements to pass", () => {
  const { compiled, run } = setup(false);
  const result = evaluateVerificationEligibility(run, compiled.policy, facts(compiled.digest, { deterministicRequirementsPassed: false }));
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.code, "VERIFICATION_REQUIREMENT_FAILED");
});

test("no-review policy can verify without reviewer identity", () => {
  const { compiled, run } = setup(false);
  const input = facts(compiled.digest, { reviewerExecutionId: null, reviewResult: "NOT_RUN" });
  const eligible = evaluateVerificationEligibility(run, compiled.policy, input);
  assert.equal(eligible.ok, true);
  const verified = transitionRun(run, "VERIFIED", { policy: compiled.policy, verificationFacts: input });
  assert.equal(verified.ok, true);
  if (verified.ok) {
    assert.equal(verified.run.state, "VERIFIED");
    assert.match(verified.run.verificationFactsDigest ?? "", /^[0-9a-f]{64}$/);
  }
});

test("review policy requires reviewer identity distinct from implementer", () => {
  const { compiled, run } = setup(true);
  const reviewRequired = transitionRun(run, "REVIEW_REQUIRED", { reviewerExecutionId: "reviewer" });
  assert.equal(reviewRequired.ok, true);
  if (!reviewRequired.ok) return;

  const missing = evaluateVerificationEligibility(reviewRequired.run, compiled.policy, facts(compiled.digest, { reviewerExecutionId: null }));
  assert.equal(missing.ok, false);
  if (!missing.ok) assert.equal(missing.error.code, "INDEPENDENT_REVIEW_REQUIRED");

  const same = evaluateVerificationEligibility(reviewRequired.run, compiled.policy, facts(compiled.digest, { reviewerExecutionId: "impl" }));
  assert.equal(same.ok, false);
  if (!same.ok) assert.equal(same.error.code, "INDEPENDENT_REVIEW_IDENTITY_CONFLICT");
});

test("review policy accepts only PASS", () => {
  const { compiled, run } = setup(true);
  const reviewRequired = transitionRun(run, "REVIEW_REQUIRED");
  assert.equal(reviewRequired.ok, true);
  if (!reviewRequired.ok) return;
  for (const reviewResult of ["CHANGES_REQUIRED", "ABSTAIN", "UNAVAILABLE", "FAILED", "NOT_RUN"] as const) {
    const result = evaluateVerificationEligibility(reviewRequired.run, compiled.policy, facts(compiled.digest, { reviewResult }));
    assert.equal(result.ok, false, reviewResult);
  }
});

test("review policy reaches VERIFIED only from REVIEW_REQUIRED with passing distinct identities", () => {
  const { compiled, run } = setup(true);
  const reviewRequired = transitionRun(run, "REVIEW_REQUIRED", { reviewerExecutionId: "reviewer" });
  assert.equal(reviewRequired.ok, true);
  if (!reviewRequired.ok) return;
  const input = facts(compiled.digest);
  const verified = transitionRun(reviewRequired.run, "VERIFIED", { policy: compiled.policy, verificationFacts: input });
  assert.equal(verified.ok, true);
  if (verified.ok) {
    assert.equal(verified.run.state, "VERIFIED");
    assert.equal(verified.run.implementerExecutionId, "impl");
    assert.equal(verified.run.reviewerExecutionId, "reviewer");
    const outbound = transitionRun(verified.run, "FAILED");
    assert.equal(outbound.ok, false);
  }
});
