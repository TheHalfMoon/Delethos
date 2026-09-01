# Specification 001 — Tasks

## Status legend

- `[x]` shaping work completed in this candidate; canonical authority requires exact shaping merge/re-read.
- `[ ]` product/evidence work not yet complete.
- Live canonical repository truth overrides checkbox text.

## Phase S — Shaping and activation

- [x] **D001-T001** Re-read canonical post-000 authority and confirm only bounded Specification 001 shaping is authorized.
- [x] **D001-T002** Research current Node 24 native TypeScript, `node:test`, TypeScript compiler, pnpm, Node typings, and GitHub Actions constraints.
- [x] **D001-T003** Define the bounded pure-core outcome and explicit Specification 002+ non-goals.
- [x] **D001-T004** Define candidate task, policy, run, verification, canonicalization, digest, error, and transition contracts.
- [x] **D001-T005** Define the authorized product path surface and zero-production-dependency rule.
- [x] **D001-T006** Define exact product acceptance/evidence and cross-platform CI requirements.
- [ ] **D001-T007** Qualify the exact shaping PR head/base/scope/reviews/threads/comments/mergeability.
- [ ] **D001-T008** Merge the exact shaping candidate with expected-head protection.
- [ ] **D001-T009** Re-read canonical `main` after shaping merge and confirm product implementation authority is active exactly as documented.

## Phase A — Minimal workspace

These tasks become product-authorized only after Phase S shaping is canonical.

- [ ] **D001-T010** Create the private pnpm root workspace and declare exact package-manager/runtime expectations.
- [ ] **D001-T011** Create `packages/core/package.json` with zero production dependencies and no publish/release behavior.
- [ ] **D001-T012** Create strict TypeScript configuration compatible with Node 24 stable type stripping and static checking.
- [ ] **D001-T013** Generate and commit the real pnpm lockfile using the declared package-manager version.

## Phase B — Canonical value and digest

- [ ] **D001-T020** Implement supported canonical value validation without invoking user-defined serialization/coercion hooks.
- [ ] **D001-T021** Implement deterministic canonical serialization with sorted object keys and preserved array order.
- [ ] **D001-T022** Implement SHA-256 digest over exact canonical UTF-8 bytes using `node:crypto`.
- [ ] **D001-T023** Add canonicalization/digest negative-path and known-vector tests.

## Phase C — Task and policy contracts

- [ ] **D001-T030** Implement `TaskSnapshotV0` validation and deterministic digest binding.
- [ ] **D001-T031** Resolve/document duplicate path-rule semantics and canonical task behavior.
- [ ] **D001-T032** Implement `PolicyInputV0` validation with unknown-key rejection.
- [ ] **D001-T033** Fix and test the hard `maxRepairAttempts` upper bound.
- [ ] **D001-T034** Implement deterministic compiled-policy defaults and digest binding.
- [ ] **D001-T035** Validate timeout/stall configuration facts without enforcing runtime clocks.

## Phase D — Run state machine

- [ ] **D001-T040** Implement one authoritative transition relation for all Specification 001 states.
- [ ] **D001-T041** Treat `VERIFIED`, `STALLED`, `TIMED_OUT`, `FAILED`, and `CANCELLED` as terminal for Specification 001.
- [ ] **D001-T042** Implement immutable/logically new successful transition records and unchanged failure inputs.
- [ ] **D001-T043** Implement monotonic logical revision increments exactly once per accepted transition.
- [ ] **D001-T044** Add table-driven tests covering every legal edge, illegal categories, and terminal outbound attempts.

## Phase E — Verification facts and VERIFIED gate

- [ ] **D001-T050** Implement `VerificationFactsV0` validation and digest binding semantics.
- [ ] **D001-T051** Require exact task/policy digest matches before `VERIFIED`.
- [ ] **D001-T052** Enforce deterministic-requirements-passed fact before `VERIFIED`.
- [ ] **D001-T053** Enforce independent-review implementer/reviewer identities when policy requires review.
- [ ] **D001-T054** Reject identical implementer/reviewer execution IDs under independent-review policy.
- [ ] **D001-T055** Accept only explicit `PASS` as the independent-review passing result.
- [ ] **D001-T056** Prove callers cannot reach trusted `VERIFIED` through an exported bypass path.

## Phase F — Public core boundary

- [ ] **D001-T060** Export only the minimal Specification 001 public surface through `packages/core/src/index.ts`.
- [ ] **D001-T061** Use explicitly experimental/pre-v1 schema identifiers and avoid stable-standard claims.
- [ ] **D001-T062** Confirm every exported product operation is pure with respect to filesystem, Git, process, network, environment mutation, persistence, current time, and random ID generation.

## Phase G — Deterministic CI

- [ ] **D001-T070** Add the first repository CI workflow with Linux/macOS/Windows Node 24 matrix.
- [ ] **D001-T071** Install dependencies from the committed lockfile using a frozen-lockfile path.
- [ ] **D001-T072** Run TypeScript static checking in every required matrix cell.
- [ ] **D001-T073** Run the full Node native test suite in every required matrix cell.
- [ ] **D001-T074** Add a deterministic check that `packages/core` has zero production dependencies.
- [ ] **D001-T075** Ensure CI performs no publish/release/deploy or hidden mutable external side effect.

## Phase H — Exact-head product qualification

- [ ] **D001-T080** Run/document strongest available local checks on the exact implementation candidate before PR qualification.
- [ ] **D001-T081** Audit exact product changed paths against Specification 001 authority.
- [ ] **D001-T082** Require all required PR CI matrix cells to succeed on the exact implementation head.
- [ ] **D001-T083** Reconcile exact head/base, reviews, inline threads, substantive comments, mergeability, and review-system availability.
- [ ] **D001-T084** Preserve skipped/unavailable/status-only systems as non-PASS.
- [ ] **D001-T085** Merge only the exact qualified implementation head with expected-head protection.
- [ ] **D001-T086** Require canonical post-merge CI success for every required matrix cell.
- [ ] **D001-T087** Re-read canonical authority and implementation after merge.

## Phase I — Terminal closeout

- [ ] **D001-T090** Produce exact Specification 001 implementation/evidence reconciliation.
- [ ] **D001-T091** Record exact runtime/compiler/package-manager/action versions actually qualified.
- [ ] **D001-T092** Record residual semantic/portability risks and unresolved later-spec questions.
- [ ] **D001-T093** Confirm zero product behavior from Specification 002+ entered the core.
- [ ] **D001-T094** Close Specification 001 only after every acceptance/evidence condition is machine-observed on canonical truth.
- [ ] **D001-T095** Re-read canonical `main` and return to bounded successor shaping; do not auto-activate Specification 002 from roadmap order alone.

## No implicit authority

Specification 001 does not authorize:

- worktrees/Git/process supervision;
- coding-agent adapters;
- actual reviewer invocation/repair loops;
- command/CI guard engine beyond the repository's own development CI;
- CLI/TUI product commands;
- routing/memory/bench;
- cloud services;
- public package/release publication.
