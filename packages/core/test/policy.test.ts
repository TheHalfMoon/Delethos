import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_REPAIR_ATTEMPTS,
  POLICY_INPUT_SCHEMA_V0,
  TASK_SCHEMA_V0,
  compilePolicy,
  validateTaskSnapshot,
} from "../src/index.ts";

const task = {
  schema: TASK_SCHEMA_V0,
  id: "task-1",
  summary: "Implement the deterministic core",
  scope: { allow: ["packages/core/**"], deny: ["packages/core/secret/**"] },
  acceptance: ["all tests pass"],
  constraints: [],
};

test("validates and digests a bounded task snapshot", () => {
  const result = validateTaskSnapshot(task);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.match(result.digest, /^[0-9a-f]{64}$/);
    assert.equal(Object.isFrozen(result.task), true);
  }
});

test("rejects unknown task fields", () => {
  const result = validateTaskSnapshot({ ...task, surprise: true });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.code, "UNKNOWN_FIELD");
});

test("rejects duplicate and contradictory path rules", () => {
  const duplicate = validateTaskSnapshot({ ...task, scope: { allow: ["a", "a"], deny: [] } });
  assert.equal(duplicate.ok, false);
  if (!duplicate.ok) assert.equal(duplicate.error.code, "DUPLICATE_PATH_RULE");

  const contradiction = validateTaskSnapshot({ ...task, scope: { allow: ["a"], deny: ["a"] } });
  assert.equal(contradiction.ok, false);
  if (!contradiction.ok) assert.equal(contradiction.error.code, "CONTRADICTORY_PATH_RULE");
});

test("rejects empty required task strings and acceptance", () => {
  assert.equal(validateTaskSnapshot({ ...task, id: "   " }).ok, false);
  assert.equal(validateTaskSnapshot({ ...task, acceptance: [] }).ok, false);
});

test("compiles policy with explicit null defaults", () => {
  const result = compilePolicy({
    schema: POLICY_INPUT_SCHEMA_V0,
    requireIndependentReview: false,
    maxRepairAttempts: 1,
    humanFinalAuthority: true,
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.policy.timeoutMs, null);
    assert.equal(result.policy.stallThresholdMs, null);
    assert.equal(result.policy.verification.requirePassingIndependentReview, false);
    assert.match(result.digest, /^[0-9a-f]{64}$/);
  }
});

test("rejects unknown policy fields and false human authority", () => {
  const base = { schema: POLICY_INPUT_SCHEMA_V0, requireIndependentReview: false, maxRepairAttempts: 0, humanFinalAuthority: true };
  assert.equal(compilePolicy({ ...base, extra: 1 }).ok, false);
  assert.equal(compilePolicy({ ...base, humanFinalAuthority: false }).ok, false);
});

test("enforces repair-attempt upper bound", () => {
  const base = { schema: POLICY_INPUT_SCHEMA_V0, requireIndependentReview: false, humanFinalAuthority: true };
  assert.equal(MAX_REPAIR_ATTEMPTS, 3);
  assert.equal(compilePolicy({ ...base, maxRepairAttempts: 3 }).ok, true);
  assert.equal(compilePolicy({ ...base, maxRepairAttempts: 4 }).ok, false);
  assert.equal(compilePolicy({ ...base, maxRepairAttempts: -1 }).ok, false);
  assert.equal(compilePolicy({ ...base, maxRepairAttempts: 1.5 }).ok, false);
});

test("validates timeout and stall facts without accepting null", () => {
  const base = { schema: POLICY_INPUT_SCHEMA_V0, requireIndependentReview: false, maxRepairAttempts: 0, humanFinalAuthority: true };
  assert.equal(compilePolicy({ ...base, timeoutMs: 1000, stallThresholdMs: 500 }).ok, true);
  assert.equal(compilePolicy({ ...base, timeoutMs: null }).ok, false);
  assert.equal(compilePolicy({ ...base, stallThresholdMs: null }).ok, false);
  assert.equal(compilePolicy({ ...base, timeoutMs: 500, stallThresholdMs: 500 }).ok, false);
  assert.equal(compilePolicy({ ...base, timeoutMs: 500, stallThresholdMs: 600 }).ok, false);
});

test("equivalent policy inputs compile deterministically", () => {
  const input = { schema: POLICY_INPUT_SCHEMA_V0, requireIndependentReview: true, maxRepairAttempts: 2, timeoutMs: 5000, humanFinalAuthority: true };
  const a = compilePolicy(input);
  const b = compilePolicy({ humanFinalAuthority: true, timeoutMs: 5000, maxRepairAttempts: 2, requireIndependentReview: true, schema: POLICY_INPUT_SCHEMA_V0 });
  assert.equal(a.ok && b.ok && a.digest === b.digest, true);
});
