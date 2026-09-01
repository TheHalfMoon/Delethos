# Specification 001 — Core Contracts

**Status:** shaping contract; concrete exported TypeScript types/functions may differ in naming if the implementation preserves these semantics and acceptance conditions.

## 1. Design rule

Specification 001 contracts describe deterministic semantic facts. They do not represent live Git state, process state, provider capability, model reasoning, or external side effects.

The core should prefer explicit plain data and pure functions.

## 2. Canonical value domain

Conceptual type:

```ts
type CanonicalValue =
  | null
  | boolean
  | number
  | string
  | readonly CanonicalValue[]
  | { readonly [key: string]: CanonicalValue };
```

Acceptance rules are stricter than TypeScript's structural type alone:

- number must be finite;
- object must satisfy the documented plain-record rule;
- cycles are rejected;
- unsupported JavaScript values are rejected, not silently dropped;
- canonicalization never calls user-defined `toJSON`, getters, iterators, coercion hooks, or custom serialization methods as part of acceptance.

The implementation must avoid executing surprising user code while validating/canonicalizing an input object.

## 3. Canonical serialization result

Preferred semantic API:

```ts
type CanonicalizeResult =
  | { ok: true; value: string }
  | { ok: false; error: CanonicalizationError };
```

A throwing API may exist only for programmer-facing convenience if the non-throwing deterministic path remains available and tests prove identical semantics.

Candidate error categories:

```text
UNSUPPORTED_TYPE
NON_FINITE_NUMBER
CYCLIC_REFERENCE
UNSUPPORTED_OBJECT
INVALID_KEY_ACCESS
```

Do not leak environment-specific stack traces into canonical identity.

## 4. Digest

Semantic operation:

```text
digestCanonical(value) -> sha256 lowercase hex
```

The digest must be calculated over the exact canonical UTF-8 representation produced by the canonical serializer.

Candidate digest value branding/type aliases may improve type safety, but the runtime representation remains an ordinary lowercase hex string in Specification 001.

## 5. Task snapshot

Candidate contract:

```ts
interface TaskSnapshotV0 {
  schema: "delethos.task.experimental.v0";
  id: string;
  summary: string;
  scope: {
    allow: readonly string[];
    deny: readonly string[];
  };
  acceptance: readonly string[];
  constraints: readonly string[];
}
```

### Validation semantics

- only the documented keys are accepted;
- strings are trimmed for emptiness validation but normalization must not silently change meaning unless documented;
- `id` and `summary` must be non-empty;
- path rules must be non-empty strings;
- duplicate exact entries should be rejected or deterministically deduplicated by one documented rule; silent inconsistent behavior is prohibited;
- acceptance conditions must contain at least one non-empty item;
- constraints may be empty;
- all data must be canonicalizable under the supported domain.

### Task digest

```text
taskDigest = SHA256(canonical(TaskSnapshotV0))
```

No repository SHA is part of the task snapshot in Specification 001.

## 6. Policy input

Candidate contract:

```ts
interface PolicyInputV0 {
  schema: "delethos.policy-input.experimental.v0";
  requireIndependentReview: boolean;
  maxRepairAttempts: number;
  timeoutMs?: number;
  stallThresholdMs?: number;
  humanFinalAuthority: true;
}
```

### Validation semantics

- unknown keys rejected;
- booleans must be actual booleans;
- repair attempts must be an integer in the documented closed interval;
- timeout/stall values, when present, must be positive safe integers;
- if both are present, `stallThresholdMs < timeoutMs`;
- `humanFinalAuthority` must be exactly `true` in Specification 001.

No string preset such as `safe` or `fast` is required in Specification 001. Preset UX belongs to later layers unless a canonical amendment shows the core requires it.

## 7. Compiled policy

Candidate contract:

```ts
interface CompiledPolicyV0 {
  schema: "delethos.policy.experimental.v0";
  requireIndependentReview: boolean;
  maxRepairAttempts: number;
  timeoutMs: number | null;
  stallThresholdMs: number | null;
  humanFinalAuthority: true;
  verification: {
    requireTaskBinding: true;
    requirePolicyBinding: true;
    requirePassingIndependentReview: boolean;
  };
}
```

Compilation must be pure and deterministic.

```text
policyDigest = SHA256(canonical(CompiledPolicyV0))
```

The compiled form contains explicit defaults. Equivalent accepted policy inputs must compile to one deterministic representation.

## 8. Run state

```ts
type RunState =
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
```

The implementation must expose one authoritative transition relation.

## 9. Execution identities

Specification 001 does not know vendors, models, sessions, operating systems, or adapter implementations.

It may represent opaque execution identities:

```ts
type ExecutionId = string;
```

Validation:

- non-empty;
- no identity equivalence inference beyond exact normalized string equality;
- the core does not claim that two different strings represent genuinely independent vendors/processes; later layers must produce trustworthy identities.

The Specification 001 guarantee is narrower: if policy requires distinct execution identity, exact equality is rejected.

## 10. Review result

Candidate vocabulary:

```ts
type ReviewResult =
  | "PASS"
  | "CHANGES_REQUIRED"
  | "ABSTAIN"
  | "UNAVAILABLE"
  | "FAILED"
  | "NOT_RUN";
```

Only `PASS` satisfies a Specification 001 independent-review fact requirement.

This vocabulary is semantic input from a later review layer; Specification 001 does not invoke or trust a reviewer itself.

## 11. Verification facts

Candidate contract:

```ts
interface VerificationFactsV0 {
  schema: "delethos.verification-facts.experimental.v0";
  taskDigest: string;
  policyDigest: string;
  changeDigest: string | null;
  deterministicRequirementsPassed: boolean;
  implementerExecutionId: string | null;
  reviewerExecutionId: string | null;
  reviewResult: ReviewResult;
}
```

`changeDigest` may remain `null` in Specification 001 because Git/diff capture is deferred. A future specification may make it required for final public proof semantics.

### VERIFIED eligibility predicate

A run is eligible to transition to `VERIFIED` only when all currently applicable conditions hold:

```text
facts.taskDigest == run.taskDigest
facts.policyDigest == run.policyDigest
facts.deterministicRequirementsPassed == true
```

And when `policy.requireIndependentReview == true`:

```text
facts.implementerExecutionId is non-null/non-empty
facts.reviewerExecutionId is non-null/non-empty
facts.implementerExecutionId != facts.reviewerExecutionId
facts.reviewResult == PASS
```

When independent review is not required, a missing reviewer identity/result must not accidentally fail a verification path unless another policy requirement says it should.

## 12. Run record

Candidate contract:

```ts
interface RunRecordV0 {
  schema: "delethos.run.experimental.v0";
  id: string;
  taskDigest: string;
  policyDigest: string;
  state: RunState;
  revision: number;
  implementerExecutionId: string | null;
  reviewerExecutionId: string | null;
  verificationFactsDigest: string | null;
}
```

### Creation

A new run begins:

```text
state = QUEUED
revision = 0
verificationFactsDigest = null
```

Run creation validates identifiers/digests but does not access repository/process state.

### Transition

Candidate semantic API:

```ts
type TransitionResult =
  | { ok: true; run: RunRecordV0 }
  | { ok: false; error: TransitionError };
```

On failure:

- returned failure is deterministic;
- input run object remains unchanged;
- revision does not advance.

On success:

- new immutable/logically new record returned;
- revision increments exactly once;
- state becomes the requested legal state;
- transition-specific data is validated before new state is returned.

## 13. Candidate transition relation

The shaping relation is:

```text
QUEUED
  -> PREPARING
  -> CANCELLED
  -> FAILED

PREPARING
  -> RUNNING
  -> CANCELLED
  -> FAILED

RUNNING
  -> WAITING
  -> REVIEW_REQUIRED
  -> VERIFIED              # only when policy/facts allow direct verification
  -> STALLED
  -> TIMED_OUT
  -> FAILED
  -> CANCELLED

WAITING
  -> RUNNING
  -> REVIEW_REQUIRED
  -> STALLED
  -> TIMED_OUT
  -> FAILED
  -> CANCELLED

REVIEW_REQUIRED
  -> CHANGES_REQUIRED
  -> VERIFIED              # verification predicate required
  -> FAILED
  -> CANCELLED

CHANGES_REQUIRED
  -> RUNNING
  -> FAILED
  -> CANCELLED
```

Terminal in Specification 001:

```text
VERIFIED
STALLED
TIMED_OUT
FAILED
CANCELLED
```

### Rationale for terminal `STALLED`

Specification 001 treats `STALLED` as a terminal outcome for one run attempt. A later retry/resume operation should create or explicitly model a new runtime action rather than silently turn a terminal observed stall back into productive execution.

If Specification 002 discovers provider/process evidence requiring recoverable `STALLED`, it must amend the semantic contract explicitly rather than overloading the same state.

## 14. Transition-specific VERIFIED data

A request to transition to `VERIFIED` must carry or reference the exact compiled policy and exact verification facts needed to evaluate the predicate.

The core must not accept:

```text
transition(run, "VERIFIED")
```

without enough deterministic context to prove eligibility.

A caller must not be able to construct a trusted verified record through an exported factory that bypasses this gate.

## 15. Error contract

Error codes should be stable enough for deterministic callers/tests without exposing unnecessary implementation detail.

Candidate families:

```text
INVALID_INPUT
UNKNOWN_FIELD
INVALID_SCHEMA
INVALID_CANONICAL_VALUE
INVALID_DIGEST
INVALID_POLICY
INVALID_RUN_STATE
INVALID_TRANSITION
TERMINAL_STATE
VERIFICATION_BINDING_MISMATCH
VERIFICATION_REQUIREMENT_FAILED
INDEPENDENT_REVIEW_REQUIRED
INDEPENDENT_REVIEW_IDENTITY_CONFLICT
```

Human-readable messages are diagnostic and must not become the only machine contract.

## 16. Immutability and side effects

All Specification 001 exported product operations must be pure with respect to external state:

- no filesystem;
- no environment mutation;
- no network;
- no subprocess;
- no Git;
- no global mutable run registry;
- no persistence;
- no implicit current time;
- no random ID generation inside deterministic state transitions.

Identifiers are supplied by callers or generated by a later authorized layer.

## 17. Public export restraint

`packages/core/src/index.ts` should export only the minimal contract/operations required to use the Specification 001 kernel.

Internal helpers should remain unexported unless a real later-package boundary requires them. Public API surface is treated as a compatibility commitment even before v1.

## 18. Compatibility boundary

All schema/version strings in Specification 001 are explicitly experimental/pre-v1.

Nothing in this spec authorizes a claim that external third parties should implement these shapes as a stable standard yet.
