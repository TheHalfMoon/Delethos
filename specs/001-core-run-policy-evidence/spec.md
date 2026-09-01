# Specification 001 — Core Run, Policy & Evidence State

## Status

`ACTIVE` iff this specification is present on canonical `main` and `specs/CURRENT.md` names it as the active product specification. Otherwise this file is only a shaping candidate.

## Purpose

Implement the smallest deterministic, provider-neutral Delethos core that can represent a bounded task, compile a bounded policy, transition a run through an explicit lifecycle, bind verification facts to exact deterministic digests, and decide whether a candidate may enter `VERIFIED` without relying on an agent's narrative.

Specification 001 establishes the semantic kernel that later worktree, adapter, review, guard, CLI, and routing layers must use rather than reinvent.

## Canonical prerequisite

Specification 000 is `CLOSED_CANONICAL` only after its terminal closeout at canonical `main` is machine-observed. The founding closeout merge is:

```text
6fdb0d5d007f7d87b97b4016677eea9480ba3521
```

Runtime implementation is not authorized until this Specification 001 shaping unit itself becomes canonical.

## Problem

Delethos cannot safely build adapters or agent orchestration before it has deterministic answers to basic questions:

- What exact task was delegated?
- What policy constraints govern it?
- Which run states are legal?
- Can a terminal run transition again?
- What does `VERIFIED` require?
- How is independent-review identity represented when policy requires it?
- How are task/policy/evidence objects serialized and digested reproducibly?
- What malformed or unsupported input must fail closed?

If those semantics remain scattered across prompts or provider wrappers, later adapters will become competing sources of truth.

## Outcome

A pure TypeScript core package can, without filesystem, Git, subprocess, network, model, adapter, persistence, or UI access:

1. validate and normalize a bounded task snapshot;
2. validate and compile a bounded policy;
3. deterministically canonicalize supported JSON-compatible values;
4. calculate stable SHA-256 digests for canonical objects;
5. create and evolve a run record through one explicit transition table;
6. reject impossible or unauthorized transitions without mutating the prior record;
7. represent verification facts separately from agent/reviewer prose;
8. enforce the independent-review identity condition when the compiled policy requires it;
9. permit `VERIFIED` only when all Specification 001 verification facts required by policy are present and valid;
10. produce identical canonical outputs/digests for identical logical inputs.

## Technology boundary

Specification 001 authorizes a minimal Node.js/TypeScript workspace only for this deterministic core.

Initial qualification target:

- Node.js 24 LTS;
- TypeScript source restricted to syntax Node's stable built-in type stripping can execute directly;
- Node's built-in `node:test` runner;
- TypeScript compiler as a development-only static type checker;
- pnpm workspace and lockfile;
- zero production/runtime package dependencies.

The exact versions recorded in `research.md` are shaping observations, not forever-stable compatibility promises. The implementation PR must record the exact versions it actually qualifies.

## In scope

### Repository/tooling foundation

A minimal workspace sufficient to typecheck and test the pure core:

```text
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
tsconfig.json
.github/workflows/ci.yml
packages/core/package.json
```

A `.gitignore` change is allowed only if the implementation actually generates a repository-local artifact that must be ignored.

### Core implementation

Authorized source/test surface:

```text
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
```

The implementation may split one listed source/test file only if exact-head evidence shows the split reduces conceptual coupling without expanding behavior. Any additional path requires a Specification 001 plan amendment before edit.

### Canonical value contract

The core must support deterministic canonical serialization for the JSON-compatible subset it explicitly accepts.

Requirements:

- recursively sort object keys by a documented deterministic rule;
- preserve array order;
- preserve JSON string/boolean/null semantics;
- reject `undefined`, functions, symbols, bigint, non-finite numbers, cyclic references, unsupported prototypes/classes, and values that cannot be represented without semantic ambiguity;
- return a deterministic UTF-8 serialization independent of insertion order;
- avoid timestamps, locale, platform path separators, object identity, or runtime-specific metadata in canonical output.

### Digest contract

Use SHA-256 from Node platform primitives over the exact canonical UTF-8 bytes and return lowercase hexadecimal output.

No external hashing dependency is authorized.

### Task snapshot

A bounded task snapshot must represent at minimum:

- schema/version identifier;
- stable task identifier;
- non-empty summary;
- bounded allowed path patterns or explicit path set;
- bounded forbidden path patterns or explicit path set;
- acceptance-condition strings;
- optional standing constraints that are part of this exact task snapshot.

Repository base/head identity is deliberately deferred to Specification 002 because Specification 001 has no Git/filesystem authority.

### Policy contract

A policy input/compiled policy must represent only deterministic requirements needed by the current kernel, including:

- whether independent review is required;
- bounded maximum repair attempts;
- optional timeout and stall threshold values as validated configuration facts only;
- explicit human-final-authority flag that cannot be silently disabled by an agent result;
- required verification-fact categories supported by Specification 001;
- unsupported/unknown policy keys fail closed.

Specification 001 does not enforce wall-clock timeout or stall detection. It only validates the policy values that later runtime work will consume.

### Run lifecycle

The core lifecycle vocabulary is:

```text
QUEUED
PREPARING
RUNNING
WAITING
REVIEW_REQUIRED
CHANGES_REQUIRED
VERIFIED
STALLED
TIMED_OUT
FAILED
CANCELLED
```

The transition table must be explicit, centrally testable, and fail closed. Terminal states are immutable within Specification 001.

The implementation must not infer state from free-form text.

### Run record

A deterministic run record must bind at least:

- schema/version identifier;
- run identifier;
- task digest;
- compiled-policy digest;
- current state;
- monotonic logical revision/sequence;
- optional implementer execution identity;
- optional reviewer execution identity;
- verification-fact snapshot/digest where required.

Wall-clock timestamps are not required for deterministic identity and must not participate in canonical run identity unless a future specification explicitly changes that rule.

### Verification facts

Specification 001 authorizes only deterministic facts sufficient to enforce the semantic boundary. It does not execute real guards or invoke a reviewer.

A verification-fact object may represent, at minimum:

- exact task digest;
- exact policy digest;
- optional candidate/change digest placeholder;
- required deterministic-fact results as explicit booleans/status values;
- implementer execution identity when known;
- reviewer execution identity when required;
- independent-review result category when required.

If independent review is required:

- reviewer execution identity must be present;
- implementer execution identity must be present;
- the two execution identities must differ;
- review result must be an explicit passing category;
- `ABSTAIN`, `UNAVAILABLE`, `FAILED`, `NOT_RUN`, or missing result cannot satisfy verification.

This checks identity/proof semantics only. Actual reviewer invocation belongs to Specification 004.

## Out of scope

Specification 001 explicitly does **not** authorize:

- Git repository discovery, Git commands, refs, diffs, or worktrees;
- filesystem mutation or persistence;
- subprocess execution or process supervision;
- timeout/stall measurement or enforcement;
- coding-agent discovery or adapters;
- agent invocation;
- independent-review invocation or repair loops;
- deterministic command/CI guard execution;
- final portable proof bundle layout or artifact retention;
- CLI/TUI commands;
- routing, benchmarking, quotas, cost estimation, or project memory;
- hosted/cloud services;
- telemetry;
- automatic commit, merge, publish, or release authority;
- a stable `delethos.*.v1` public-standard claim;
- a public package/release.

## Runtime dependency rule

`packages/core` must have zero production dependencies at Specification 001 closeout.

Development-only dependencies are allowed only when necessary for static type checking or package/workspace operation and must be locked exactly enough for reproducible CI. Test execution should use Node platform primitives rather than adding a test framework unless a reproducible blocker is discovered and separately authorized.

## CI authority

Specification 001 authorizes the repository's first deterministic CI workflow because implementation correctness can no longer be proven by documentation inspection alone.

The workflow must:

- run on pull requests and pushes to `main`;
- qualify the exact declared Node 24 target on Linux, macOS, and Windows;
- install from the committed pnpm lockfile using a frozen-lockfile path;
- run static type checking;
- run the full Specification 001 test suite;
- fail if production/runtime dependencies appear in `packages/core` without an authorized specification change;
- avoid hidden release/publish/deploy side effects.

The implementation PR and canonical post-merge revision must both have machine-observed successful required CI before product completion can be claimed.

## Acceptance criteria

Specification 001 product implementation is accepted only if all of the following are proven on the exact candidate revision:

1. canonical serialization is stable for logically identical objects with different insertion order;
2. canonical serialization preserves array order and supported scalar semantics;
3. unsupported values, non-finite numbers, cycles, and unsupported object prototypes fail closed;
4. SHA-256 digest output is deterministic lowercase hexadecimal and bound to canonical bytes;
5. malformed task snapshots are rejected;
6. malformed/unknown policy input is rejected;
7. repair-attempt bounds are enforced and cannot be negative/unbounded;
8. timeout/stall configuration is validated deterministically, including any documented ordering constraint;
9. every legal run transition is explicitly tested;
10. every illegal transition category has negative-path coverage;
11. invalid transitions leave the prior run record unchanged;
12. terminal states cannot transition further;
13. run logical revision advances deterministically on each valid transition;
14. `VERIFIED` cannot be reached without a matching task digest and policy digest;
15. `VERIFIED` cannot be reached when any policy-required verification fact is missing or failing;
16. when independent review is required, reviewer/implementer identities must both exist and differ;
17. non-passing review result categories cannot satisfy independent review;
18. repeated equivalent inputs produce identical canonical values and digests across test runs;
19. the package has zero production/runtime dependencies;
20. TypeScript static checking succeeds;
21. the test suite succeeds on Linux, macOS, and Windows for the declared Node 24 target;
22. CI runs successfully on the exact implementation PR head;
23. the qualified implementation merges with expected-head protection;
24. canonical post-merge CI succeeds on the exact resulting `main` revision;
25. final changed paths remain inside the authorized Specification 001 product surface or a prior canonical plan amendment;
26. no out-of-scope adapter/Git/process/CLI/release behavior enters through the implementation.

## Evidence requirements

The product closeout must retain, at minimum:

- shaping merge revision;
- exact implementation base/head;
- exact changed-path set;
- package manager/runtime/compiler versions actually used;
- lockfile revision/digest or canonical blob reference;
- exact PR CI run IDs/results for all required matrix cells;
- exact post-merge CI run IDs/results;
- typecheck/test commands and results;
- production dependency inspection result;
- PR reviews/threads/comments/mergeability truth;
- expected-head merge evidence;
- residual limitations.

Unavailable/skipped review systems remain non-PASS.

## Recovery

If implementation discovers that Node's stable type-stripping subset cannot express this core cleanly, or that the proposed package structure causes material cross-platform/process-independent defects:

1. do not silently add a loader/framework/runtime dependency;
2. record the exact reproducible blocker;
3. amend the active plan through a bounded PR before changing the technology contract;
4. preserve the zero-runtime-dependency objective unless evidence shows it is infeasible;
5. do not expand into Specification 002+ behavior as a workaround.

## Completion rule

Specification 001 becomes `CLOSED_CANONICAL` only after its shaping authority is canonical, its exact product implementation passes every required acceptance/evidence gate, the exact qualified head merges with expected-head protection, canonical post-merge CI succeeds, and the canonical authority chain is re-read.

Shaping this specification does not itself prove or complete the product implementation.
