import assert from "node:assert/strict";
import test from "node:test";

import {
  POLICY_INPUT_SCHEMA_V0,
  VERIFICATION_FACTS_SCHEMA_V0,
  canTransition,
  compilePolicy,
  createRun,
  transitionRun,
  type RunState,
} from "../src/index.ts";

const taskDigest = "a".repeat(64);

function policy(review = false) {
  const result = compilePolicy({ schema: POLICY_INPUT_SCHEMA_V0, requireIndependentReview: review, maxRepairAttempts: 1, humanFinalAuthority: true });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("policy compile failed");
  return result;
}

function runToRunning(review = false) {
  const compiled = policy(review);
  const created = createRun({ id: "run-1", taskDigest, policyDigest: compiled.digest });
  assert.equal(created.ok, true);
  if (!created.ok) throw new Error("run creation failed");
  const preparing = transitionRun(created.run, "PREPARING");
  assert.equal(preparing.ok, true);
  if (!preparing.ok) throw new Error("transition failed");
  const running = transitionRun(preparing.run, "RUNNING", { implementerExecutionId: "impl-1" });
  assert.equal(running.ok, true);
  if (!running.ok) throw new Error("transition failed");
  return { compiled, run: running.run };
}

test("creates an immutable queued run at revision zero", () => {
  const compiled = policy();
  const result = createRun({ id: "run-1", taskDigest, policyDigest: compiled.digest });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.run.state, "QUEUED");
    assert.equal(result.run.revision, 0);
    assert.equal(Object.isFrozen(result.run), true);
  }
});

test("rejects malformed ids and digests", () => {
  assert.equal(createRun({ id: " ", taskDigest, policyDigest: "b".repeat(64) }).ok, false);
  assert.equal(createRun({ id: "x", taskDigest: "bad", policyDigest: "b".repeat(64) }).ok, false);
});

test("transition table contains the exact core legal edges", () => {
  const legal: Array<[RunState, RunState]> = [
    ["QUEUED", "PREPARING"], ["QUEUED", "CANCELLED"], ["QUEUED", "FAILED"],
    ["PREPARING", "RUNNING"], ["PREPARING", "CANCELLED"], ["PREPARING", "FAILED"],
    ["RUNNING", "WAITING"], ["RUNNING", "REVIEW_REQUIRED"], ["RUNNING", "VERIFIED"], ["RUNNING", "STALLED"], ["RUNNING", "TIMED_OUT"], ["RUNNING", "FAILED"], ["RUNNING", "CANCELLED"],
    ["WAITING", "RUNNING"], ["WAITING", "REVIEW_REQUIRED"], ["WAITING", "STALLED"], ["WAITING", "TIMED_OUT"], ["WAITING", "FAILED"], ["WAITING", "CANCELLED"],
    ["REVIEW_REQUIRED", "CHANGES_REQUIRED"], ["REVIEW_REQUIRED", "VERIFIED"], ["REVIEW_REQUIRED", "FAILED"], ["REVIEW_REQUIRED", "CANCELLED"],
    ["CHANGES_REQUIRED", "RUNNING"], ["CHANGES_REQUIRED", "FAILED"], ["CHANGES_REQUIRED", "CANCELLED"],
  ];
  for (const [from, to] of legal) assert.equal(canTransition(from, to), true, `${from}->${to}`);
});

test("invalid transition leaves the prior run unchanged", () => {
  const { run } = runToRunning();
  const before = { ...run };
  const result = transitionRun(run, "PREPARING");
  assert.equal(result.ok, false);
  assert.deepEqual({ ...run }, before);
  assert.equal(run.revision, 2);
});

test("successful transitions increment revision once and return a new object", () => {
  const { run } = runToRunning();
  const result = transitionRun(run, "WAITING");
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.run.revision, run.revision + 1);
    assert.notEqual(result.run, run);
    assert.equal(run.state, "RUNNING");
  }
});

test("terminal states reject every outbound transition", () => {
  for (const terminal of ["STALLED", "TIMED_OUT", "FAILED", "CANCELLED"] as const) {
    const { run } = runToRunning();
    const terminalResult = transitionRun(run, terminal);
    assert.equal(terminalResult.ok, true);
    if (!terminalResult.ok) continue;
    const result = transitionRun(terminalResult.run, "RUNNING");
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error.code, "TERMINAL_STATE");
  }
});

test("a hand-constructed run record cannot bypass the trusted run factory", () => {
  const compiled = policy();
  const fake = {
    schema: "delethos.run.experimental.v0" as const,
    id: "fake",
    taskDigest,
    policyDigest: compiled.digest,
    state: "RUNNING" as const,
    revision: 1,
    implementerExecutionId: null,
    reviewerExecutionId: null,
    verificationFactsDigest: null,
  };
  const result = transitionRun(fake, "FAILED");
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.code, "INVALID_INPUT");
});

test("review-required policy cannot jump directly from RUNNING to VERIFIED", () => {
  const { compiled, run } = runToRunning(true);
  const facts = {
    schema: VERIFICATION_FACTS_SCHEMA_V0,
    taskDigest,
    policyDigest: compiled.digest,
    changeDigest: null,
    deterministicRequirementsPassed: true,
    implementerExecutionId: "impl-1",
    reviewerExecutionId: "review-1",
    reviewResult: "PASS" as const,
  };
  const result = transitionRun(run, "VERIFIED", { policy: compiled.policy, verificationFacts: facts });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.code, "INDEPENDENT_REVIEW_REQUIRED");
});
