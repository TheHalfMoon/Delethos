# Specification 001 — Terminal Closeout

**Status:** `CLOSED_CANONICAL` iff this closeout is present on canonical `main` after exact-head qualification/merge and canonical re-read.  
**Specification:** `001-core-run-policy-evidence`  
**Purpose:** bind Specification 001 completion to exact repository and CI evidence without rewriting historical task/spec narrative.

Live GitHub/repository truth overrides this record. For terminal disposition, this file and `specs/CURRENT.md` supersede pre-closeout status/checklist text in `spec.md` and `tasks.md` when they disagree.

## 1. Authority chain

```text
spec_000_closeout_merge = 6fdb0d5d007f7d87b97b4016677eea9480ba3521
spec_001_shaping_pr = 3
spec_001_shaping_head = 454edb618f77f6471a65bcb2e638cf48bab7a0db
spec_001_shaping_merge = 32843fb1495fd792dceddc0536a7fef6d90edf4e
implementation_pr = 4
implementation_base = 32843fb1495fd792dceddc0536a7fef6d90edf4e
implementation_qualified_head = 632bc5a77db7fa8ba34e6d1d5f1f804bd12ec298
implementation_merge = 9bdba350458fe2e7832658e3214d9a500dd7153e
implementation_tree = 6030232bd56ced634833a19e1f6bc5f9352cc95a
```

PR #4 was merged with expected-head protection against exact head `632bc5a77db7fa8ba34e6d1d5f1f804bd12ec298`. Canonical `main` was re-read afterward and resolved to `9bdba350458fe2e7832658e3214d9a500dd7153e`, whose GitHub signature is verified.

## 2. Exact implementation scope

The canonical compare from shaping merge `32843fb1495fd792dceddc0536a7fef6d90edf4e` to implementation merge `9bdba350458fe2e7832658e3214d9a500dd7153e` contains exactly 17 paths:

```text
.github/workflows/ci.yml
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
tsconfig.json
packages/core/package.json
packages/core/src/canonical.ts
packages/core/src/digest.ts
packages/core/src/task.ts
packages/core/src/policy.ts
packages/core/src/run.ts
packages/core/src/evidence.ts
packages/core/src/index.ts
packages/core/test/canonical.test.ts
packages/core/test/policy.test.ts
packages/core/test/run.test.ts
packages/core/test/evidence.test.ts
```

No filesystem/Git/worktree implementation, subprocess supervision, adapter/provider SDK, reviewer invocation, repair loop, CLI/TUI, routing, memory, benchmark, cloud, telemetry, automatic merge/release, public package publication, or stable external `delethos.*.v1` contract entered through Specification 001.

## 3. Implemented semantic kernel

Canonical product truth now contains:

- fail-closed canonicalization for the explicitly supported JSON-compatible domain;
- deterministic sorted-record serialization with array-order preservation;
- SHA-256 over exact canonical UTF-8 bytes using `node:crypto`;
- bounded task snapshot validation/digest;
- bounded policy validation/compilation/digest;
- hard `maxRepairAttempts = 3` upper bound;
- validated timeout/stall configuration facts without runtime clock enforcement;
- explicit run transition relation and immutable logical revisions;
- terminal `VERIFIED`, `STALLED`, `TIMED_OUT`, `FAILED`, and `CANCELLED` states;
- internal run-record branding preventing a hand-constructed record from bypassing exported transitions;
- verification-fact validation/digest binding;
- exact task/policy binding before `VERIFIED`;
- deterministic-requirements PASS requirement;
- independent-review semantic requirement of distinct non-empty implementer/reviewer execution IDs plus explicit `PASS` when policy requires review;
- experimental/pre-v1 schema identifiers only;
- zero production dependencies in `packages/core`.

Distinct execution IDs are semantic identifiers only. Specification 001 does not claim they prove distinct vendors, processes, models, or trust domains; later runtime/adapter provenance must establish those facts.

## 4. Local pre-qualification

A local Node `22.16.0` environment was used only for early semantic feedback because Node 24 was unavailable locally.

Observed pre-qualification:

```text
node --experimental-strip-types --test ...
36 tests
36 passed
0 failed
```

A local static check also passed after temporary Node declaration shims were used. Those shims were not committed. These local observations are not final qualification evidence.

## 5. Invalidated PR CI attempt

Initial implementation head:

```text
0eabac776906074890278e56217b7645c456049f
```

PR CI run:

```text
33500696916
```

failed during frozen-lockfile installation before typecheck because the manually assembled `undici-types@7.18.2` integrity omitted one character. pnpm reported `ERR_PNPM_TARBALL_INTEGRITY` and the registry-observed checksum contained `...JU3kjw6M+upr...` rather than the locked `...JU3kjwM+upr...`.

The failure was treated as a lockfile defect, not bypassed. Frozen-lockfile and supply-chain checks remained enabled. Only the proven checksum typo was repaired. The failed run is retained as invalidated historical evidence and is not counted toward qualification.

## 6. Exact-head PR qualification

Qualified implementation head:

```text
632bc5a77db7fa8ba34e6d1d5f1f804bd12ec298
```

GitHub Actions PR CI:

```text
run_id = 33501024793
conclusion = SUCCESS
ubuntu_job = 99834152007
windows_job = 99834152179
macos_job = 99834152506
```

All three required cells passed:

- frozen-lockfile installation;
- TypeScript static checking;
- full 36-test suite;
- zero-production-dependency verification.

## 7. Canonical post-merge qualification

Canonical implementation revision:

```text
9bdba350458fe2e7832658e3214d9a500dd7153e
```

Canonical push CI:

```text
run_id = 33501188407
conclusion = SUCCESS
ubuntu_job = 99834662311
windows_job = 99834662286
macos_job = 99834662428
```

Every required cell completed successfully on the exact canonical revision. The Ubuntu canonical job additionally records:

```text
Node = v24.20.0
pnpm = 11.22.0
TypeScript = 7.0.2
@types/node = 24.13.3
actions/checkout@v7 resolved SHA = 3d3c42e5aac5ba805825da76410c181273ba90b1
pnpm/setup@v2 resolved SHA = 84cb39b217b10273981911c288cd62326dc7c6d2
```

The lockfile passed pnpm's supply-chain verification, TypeScript checking passed, the native Node test runner reported exactly 36 tests / 36 pass / 0 fail, and the production-dependency inspection passed.

## 8. PR reconciliation

For exact qualified PR head `632bc5a77db7fa8ba34e6d1d5f1f804bd12ec298`:

- base remained canonical shaping merge `32843fb1495fd792dceddc0536a7fef6d90edf4e`;
- changed files remained exactly 17;
- PR mergeability was observed `true` before merge;
- submitted GitHub reviews: 0;
- inline review threads: 0;
- Qodo was billing-blocked and is not PASS;
- CodeRabbit automatic review was skipped due repository-star policy; its status context is not an approving review;
- Cubic generated a descriptive summary only and is not independent approval.

Specification 001 did not require external independent repository approval. No unavailable/skipped/summary-only system was promoted to PASS.

## 9. Task reconciliation

The Specification 001 task ledger is terminally reconciled as follows:

```text
D001-T001..T009   COMPLETE — shaping/activation
D001-T010..T013   COMPLETE — minimal workspace
D001-T020..T023   COMPLETE — canonicalization/digest
D001-T030..T035   COMPLETE — task/policy
D001-T040..T044   COMPLETE — run state machine
D001-T050..T056   COMPLETE — verification/VERIFIED gate
D001-T060..T062   COMPLETE — public pure-core boundary
D001-T070..T075   COMPLETE — cross-platform CI
D001-T080..T087   COMPLETE — exact-head/canonical qualification
D001-T090..T095   COMPLETE iff this closeout is canonical and re-read
```

This terminal reconciliation supersedes unchecked pre-closeout boxes in `tasks.md`; those boxes remain historical planning text rather than a second source of completion truth.

## 10. Residual limitations

Specification 001 intentionally leaves these unproven/unimplemented:

- repository/worktree isolation;
- process ownership, cancellation, timeout, productive-stall detection, and orphan cleanup;
- trustworthy external-agent execution identities;
- coding-agent adapters and capability conformance;
- actual independent reviewer invocation and repair loops;
- deterministic repository guard execution;
- portable final proof-bundle persistence/verifier;
- CLI/TUI and first-run UX;
- adaptive routing/memory/bench;
- hosted/cloud capabilities;
- automatic commit/merge/release authority;
- stable public protocol guarantees.

Administrative repository gaps also remain live truth:

- `main` is not branch-protected;
- no repository ruleset is configured;
- repository description/homepage/topics remain unset/empty.

The available authenticated write surface in this environment does not expose supported mutation actions for those repository settings, so they are not represented as completed.

## 11. Completion disposition

Specification 001 is `CLOSED_CANONICAL` only after this exact closeout unit itself is qualified, merged with expected-head protection, and canonical `main` is re-read successfully.

No recursive documentation-only PR is required merely to record the closeout merge SHA after those effectivity conditions are observed.

After closure, the only next product authority is **bounded Specification 002 shaping** based on canonical live truth and fresh worktree/process-supervision research. Roadmap order alone does not authorize implementation.
