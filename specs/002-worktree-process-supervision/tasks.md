# Specification 002 — Tasks

## Status legend

- `[x]` shaping item completed in this candidate; authority becomes effective only after exact shaping merge/re-read.
- `[ ]` product/evidence work not yet complete.
- Live canonical repository/GitHub truth overrides checkbox text.

## Phase S — Shaping

- [x] **D002-T001** Re-read canonical post-001 authority and prove Specification 001 closeout effectivity.
- [x] **D002-T002** Research current Git worktree porcelain/lock/remove behavior from primary Git documentation.
- [x] **D002-T003** Research Node 24 process spawning/detached/signal semantics and Windows limitations from primary Node documentation.
- [x] **D002-T004** Research Windows ordinary process-tree termination through Microsoft `taskkill` documentation.
- [x] **D002-T005** Define the bounded exact-base worktree and process-supervision outcome.
- [x] **D002-T006** Define explicit sandbox/process-containment non-claims and Rust/native recovery threshold.
- [x] **D002-T007** Define authorized implementation path surface, acceptance criteria, platform evidence, and recovery behavior.
- [ ] **D002-T008** Qualify exact shaping PR base/head/scope/CI/reviews/threads/comments/mergeability.
- [ ] **D002-T009** Merge exact shaping head with expected-head protection and re-read canonical authority.

## Phase A — Repository runtime facts

- [ ] **D002-T010** Create private `@delethos/runtime` package with zero external production dependencies.
- [ ] **D002-T011** Implement shell-free Git execution helper with bounded output/error handling.
- [ ] **D002-T012** Validate repository/non-bare preconditions and resolve top-level/common-dir/HEAD/branch/dirty facts.
- [ ] **D002-T013** Validate exact 40-hex base SHA and resolve it as a commit object.
- [ ] **D002-T014** Record observed Git version without turning it into an unsupported compatibility claim.

## Phase B — Worktree lifecycle

- [ ] **D002-T020** Allocate fresh Delethos-owned temporary worktree parent.
- [ ] **D002-T021** Create detached worktree at exact base with atomic `--lock --reason delethos:<run-id>`.
- [ ] **D002-T022** Implement robust `worktree list --porcelain -z` parser.
- [ ] **D002-T023** Verify exact path/HEAD/detached/lock ownership before returning prepared worktree.
- [ ] **D002-T024** Inspect owned worktree cleanliness using NUL-delimited status.
- [ ] **D002-T025** Discover Delethos-owned worktrees by exact lock-reason provenance.
- [ ] **D002-T026** Implement clean-only unlock/remove and owned temp-parent cleanup.
- [ ] **D002-T027** Refuse dirty cleanup and preserve partial work.
- [ ] **D002-T028** Attempt bounded re-lock if clean removal fails after unlock.

## Phase C — Process request and output

- [ ] **D002-T030** Validate shell-free process request/cwd/args/environment/limits.
- [ ] **D002-T031** Implement explicit `INHERIT` and `EXACT` environment modes.
- [ ] **D002-T032** Implement bounded stdout/stderr capture and byte accounting.
- [ ] **D002-T033** Implement natural `EXITED` and `FAILED_TO_START` results faithfully.
- [ ] **D002-T034** Implement single first-terminal-cause latch.

## Phase D — Runtime termination semantics

- [ ] **D002-T040** Implement explicit cancellation.
- [ ] **D002-T041** Implement total wall-clock timeout.
- [ ] **D002-T042** Implement resettable supervised-stdio inactivity stall detection.
- [ ] **D002-T043** Implement output-limit terminal cause.
- [ ] **D002-T044** Implement POSIX owned process-group TERM/KILL path.
- [ ] **D002-T045** Implement Windows `taskkill /T /F` owned-tree path.
- [ ] **D002-T046** Preserve original terminal cause when cleanup itself reports failure.

## Phase E — Worktree evidence

- [ ] **D002-T050** Test non-repository, bare repository, and malformed/non-commit base fail-closed paths.
- [ ] **D002-T051** Test exact detached base and no branch creation.
- [ ] **D002-T052** Test atomic lock reason and porcelain ownership parser including path spaces.
- [ ] **D002-T053** Test dirty primary worktree does not contaminate exact-base linked worktree.
- [ ] **D002-T054** Test owned worktree discovery.
- [ ] **D002-T055** Test clean cleanup success.
- [ ] **D002-T056** Test dirty cleanup refusal and content preservation.

## Phase F — Process evidence

- [ ] **D002-T060** Test zero/nonzero natural exits and spawn failure.
- [ ] **D002-T061** Test exact cwd and explicit environment modes.
- [ ] **D002-T062** Test bounded stdout/stderr and output-limit termination.
- [ ] **D002-T063** Test explicit cancel distinct from timeout/stall.
- [ ] **D002-T064** Test total timeout.
- [ ] **D002-T065** Test stdio activity resets stall deadline and later inactivity produces `STALLED`.
- [ ] **D002-T066** Test first terminal cause is immutable under races.
- [ ] **D002-T067** Test ordinary root + descendant cleanup using PID liveness verification on every required OS.
- [ ] **D002-T068** Confirm tests remain bounded and cannot hang CI indefinitely.

## Phase G — CI qualification

- [ ] **D002-T070** Extend root test command to include all Specification 001 + 002 tests.
- [ ] **D002-T071** Extend dependency check for zero external runtime dependencies in `packages/runtime`.
- [ ] **D002-T072** Record actual Git version in each CI cell.
- [ ] **D002-T073** Require full Linux qualification.
- [ ] **D002-T074** Require full macOS qualification.
- [ ] **D002-T075** Require full Windows qualification including `taskkill` descendant fixture.
- [ ] **D002-T076** Confirm workflow retains read-only repository permission and no publish/deploy behavior.

## Phase H — Exact-head merge

- [ ] **D002-T080** Run/document strongest local or fixture checks available before PR qualification.
- [ ] **D002-T081** Audit exact changed paths against Specification 002 authority.
- [ ] **D002-T082** Reconcile exact base/head, all required CI, reviews, threads, comments, bot availability, and mergeability.
- [ ] **D002-T083** Preserve unavailable/skipped/status-only review systems as non-PASS.
- [ ] **D002-T084** Merge exact qualified implementation with expected-head protection.
- [ ] **D002-T085** Require canonical post-merge Linux/macOS/Windows CI.
- [ ] **D002-T086** Re-read canonical implementation and authority after merge.

## Phase I — Closeout

- [ ] **D002-T090** Produce exact implementation/evidence reconciliation.
- [ ] **D002-T091** Record actual Node/pnpm/TypeScript/Git/action versions and exact workflow/job IDs.
- [ ] **D002-T092** Record worktree/process cleanup limitations and any observed platform asymmetry.
- [ ] **D002-T093** Confirm zero Specification 003+ behavior entered the runtime.
- [ ] **D002-T094** Close Specification 002 only when every acceptance/evidence gate is machine-observed.
- [ ] **D002-T095** Re-read canonical `main` and return to bounded successor shaping without auto-activating Specification 003 from roadmap order.
