# Specification 001 — Plan

## Goal

Build one deterministic provider-neutral semantic kernel before any external coding-agent integration exists.

The implementation must prove the meaning of task identity, policy identity, run-state transitions, and the minimum verification boundary while remaining pure compute with zero production dependencies.

## Grain rationale

Specification 001 is intentionally narrower than the surrounding product vision.

It owns only:

```text
canonical value
  -> digest
  -> task snapshot
  -> compiled policy
  -> run state machine
  -> verification facts
  -> VERIFIED eligibility
```

It does not own repository execution. Git/worktrees/processes/adapters/reviewer invocation/guards/CLI/routing remain later specs.

This boundary keeps the first product unit independently understandable, testable, recoverable, and portable.

## Phase A — Workspace and reproducibility foundation

### A1. Minimal root workspace

Create:

```text
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
tsconfig.json
```

Requirements:

- private workspace;
- package-manager version pinned/declared;
- Node engine compatible with the exact Node 24 qualification target;
- no production dependency at root unless a later canonical amendment proves it necessary;
- scripts must be deterministic and non-publishing.

### A2. Core package

Create `packages/core/package.json` with:

- private/non-published status during Specification 001;
- explicit module semantics compatible with native Node TypeScript execution;
- zero production dependencies;
- narrow test/typecheck scripts or root scripts that operate deterministically.

### A3. TypeScript boundary

Use compiler settings compatible with Node's stable type-stripping subset and direct `.ts` import semantics.

Prefer:

```json
{
  "target": "ESNext",
  "module": "NodeNext",
  "moduleResolution": "NodeNext",
  "noEmit": true,
  "strict": true,
  "verbatimModuleSyntax": true,
  "rewriteRelativeImportExtensions": true,
  "erasableSyntaxOnly": true,
  "skipLibCheck": true
}
```

The final implementation config may adjust a setting only with exact rationale and successful cross-platform proof.

## Phase B — Canonical representation and digest

### B1. Supported canonical value domain

Implement a deliberately small canonical JSON-compatible domain rather than accepting arbitrary JavaScript objects.

Expected source:

```text
packages/core/src/canonical.ts
```

Design rules:

- primitive support: string, boolean, null, finite number;
- arrays preserve order;
- plain objects only;
- object keys sorted deterministically;
- no prototype/class/date/map/set/typed-array coercion;
- no implicit dropping of unsupported values;
- no lossy conversion;
- cycles fail closed.

### B2. Canonical serializer

Return one deterministic UTF-8 string/byte representation.

The serializer is a correctness boundary. It should remain small enough for direct exhaustive tests.

### B3. Digest

Use `node:crypto` SHA-256 only.

Expected source:

```text
packages/core/src/digest.ts
```

Digest API should make the canonicalization step explicit enough to prevent callers from accidentally hashing non-canonical object stringification.

## Phase C — Task and policy contracts

### C1. Task snapshot

Expected source:

```text
packages/core/src/task.ts
```

Use explicit validation functions and TypeScript structural types rather than a runtime schema dependency.

Validation should reject:

- unknown top-level keys;
- missing version/id/summary;
- empty/whitespace identifiers or summary;
- invalid path-rule values;
- duplicate/contradictory path entries when deterministically detectable;
- malformed acceptance/constraint arrays;
- non-canonicalizable values.

No filesystem check is authorized; path rules are validated structurally only.

### C2. Policy input and compilation

Expected source:

```text
packages/core/src/policy.ts
```

Compilation means deterministic normalization/validation, not AI selection.

Candidate semantic constraints:

- `requireIndependentReview: boolean`;
- `maxRepairAttempts` integer within one documented hard upper bound;
- optional positive integer `timeoutMs`;
- optional positive integer `stallThresholdMs`;
- if both are provided, `stallThresholdMs < timeoutMs`;
- `humanFinalAuthority` must remain `true` in Specification 001;
- unknown fields fail closed.

The hard repair-attempt upper bound is a product-safety constant and must be tested. The implementation should choose the smallest reasonable bound and document it; a value such as 3 is preferred unless evidence requires otherwise.

## Phase D — Run state machine

### D1. Central transition table

Expected source:

```text
packages/core/src/run.ts
```

Represent legal transitions as data/one authoritative function rather than scattered conditionals.

A candidate transition graph:

```text
QUEUED -> PREPARING | CANCELLED | FAILED
PREPARING -> RUNNING | CANCELLED | FAILED
RUNNING -> WAITING | REVIEW_REQUIRED | STALLED | TIMED_OUT | FAILED | CANCELLED
WAITING -> RUNNING | REVIEW_REQUIRED | STALLED | TIMED_OUT | FAILED | CANCELLED
REVIEW_REQUIRED -> CHANGES_REQUIRED | VERIFIED | FAILED | CANCELLED
CHANGES_REQUIRED -> RUNNING | FAILED | CANCELLED

terminal:
VERIFIED | STALLED | TIMED_OUT | FAILED | CANCELLED
```

The exact graph must be reviewed against later-runtime needs while keeping Specification 001 free from actual runtime behavior.

Important design question to resolve during implementation: whether `STALLED` should be terminal or recoverable in the pure semantic kernel. The founding architecture treats it as a distinct outcome; Specification 001 should choose one explicit meaning and test it rather than leave ambiguous dual semantics.

### D2. Immutable transition function

A transition should return a new run record or a typed/structured failure result. Invalid transition attempts must not mutate the prior record.

Avoid throwing for expected domain-invalid transitions if a discriminated result type gives clearer deterministic control; reserve exceptions for programmer/internal invariant failure.

### D3. Logical revision

Each accepted state transition increments a monotonic integer revision exactly once.

No wall-clock timestamp is required to establish run ordering in the core.

## Phase E — Verification facts and VERIFIED gate

### E1. Verification fact contract

Expected source:

```text
packages/core/src/evidence.ts
```

The fact object is deliberately narrower than the future portable evidence bundle.

It should contain only what the pure state kernel needs to answer whether a requested transition to `VERIFIED` is semantically eligible.

### E2. Digest binding

Verification facts must bind to the run's exact task and compiled-policy digests. Any mismatch fails verification eligibility.

### E3. Independent-review condition

If policy requires independent review:

```text
implementerExecutionId != null
reviewerExecutionId != null
implementerExecutionId != reviewerExecutionId
reviewResult == PASS
```

No model/vendor identity claim is inferred beyond the explicit execution IDs supplied by later layers.

### E4. VERIFIED transition

The transition to `VERIFIED` must go through the same central deterministic transition mechanism and verification predicate.

No caller can directly construct a trusted verified run record through an exported shortcut that bypasses the predicate.

## Phase F — Public package boundary

### F1. `index.ts`

Expose only stable-enough Specification 001 primitives required by later Delethos packages.

Avoid exporting implementation helpers by default. Public surface growth is a compatibility cost.

### F2. Version labels

Use internal/pre-v1 contract identifiers that do not imply stable `delethos.*.v1` public-standard status.

For example, implementation-local values may use `.../v0` or explicitly experimental identifiers. The exact naming must be documented and tested.

## Phase G — Tests

Use Node's built-in test runner. Tests should target behavior/invariants rather than implementation trivia.

### G1. Canonical tests

Cover:

- nested key reordering;
- arrays;
- strings/escaping;
- `-0`/number semantics if supported;
- non-finite rejection;
- undefined/function/symbol/bigint rejection;
- cycle rejection;
- class/non-plain-object rejection;
- deterministic repeated serialization.

### G2. Digest tests

Cover:

- known canonical bytes -> known SHA-256;
- identical logical object -> identical digest;
- changed value -> changed digest;
- lowercase hex format.

### G3. Task/policy tests

Cover valid/minimal/maximal input and negative paths for unknown keys, malformed arrays/strings, bounds, ordering constraints, and human-final-authority preservation.

### G4. State-machine tests

Test the transition graph as a table:

- all legal edges;
- illegal edges;
- all terminal-state outbound attempts;
- revision increments;
- prior-object immutability.

### G5. Evidence tests

Cover:

- matching/mismatching digests;
- missing required fact;
- review-required/non-required policies;
- same implementer/reviewer identity rejection;
- non-PASS review categories;
- VERIFIED happy path;
- inability to bypass eligibility.

## Phase H — CI

Create `.github/workflows/ci.yml`.

Initial required matrix:

```text
ubuntu-latest / Node 24
macos-latest  / Node 24
windows-latest / Node 24
```

Each matrix cell should:

1. checkout exact revision;
2. set up the declared Node version;
3. install the declared pnpm version;
4. install with frozen lockfile;
5. run static type checking;
6. run tests;
7. run a deterministic no-runtime-dependencies check.

Do not publish artifacts/packages/releases in this workflow.

The implementation PR cannot be accepted until every required matrix cell succeeds on the exact head and canonical post-merge CI also succeeds.

## Authorized product change surface

After this shaping specification becomes canonical, implementation authority is limited to:

```text
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
tsconfig.json
.gitignore                         # only if justified
.github/workflows/ci.yml
packages/core/package.json
packages/core/src/index.ts
packages/core/src/canonical.ts
packages/core/src/digest.ts
packages/core/src/task.ts
packages/core/src/policy.ts
packages/core/src/run.ts
packages/core/src/evidence.ts
packages/core/test/canonical.test.ts
packages/core/test/policy.test.ts
packages/core/test/run.test.ts
packages/core/test/evidence.test.ts
specs/001-core-run-policy-evidence/** # evidence/closeout docs only after product qualification
specs/CURRENT.md                       # controlled frontier/closeout updates only
```

The shaping PR itself remains documentation-only and does not create these product files.

## Prohibited scope

Do not add:

- Git/worktree libraries or commands;
- child-process execution;
- adapters/provider SDKs;
- test framework dependencies;
- runtime validation/schema dependencies;
- logging/telemetry libraries;
- database/persistence;
- CLI/TUI framework;
- release tooling;
- cloud/network code.

## Qualification sequence

1. merge this shaping unit only after exact-head/base/scope/review reconciliation;
2. re-read canonical `main`;
3. create a separate bounded implementation branch from the exact shaping merge;
4. implement only the authorized surface;
5. generate/commit the real lockfile using the declared package manager;
6. run local/static tests where the execution environment permits;
7. open the implementation PR with exact evidence;
8. require all exact-head CI matrix cells;
9. reconcile reviews/threads/comments/mergeability and changed paths;
10. merge with expected-head protection;
11. require exact canonical post-merge CI;
12. close Specification 001 only after product evidence is reconciled.

## Recovery

If a proposed implementation needs scope outside this plan, stop before editing the new surface. Record the exact blocker and amend the active plan through a bounded canonical planning change rather than smuggling adjacent functionality into the implementation PR.
