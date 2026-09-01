# Specification 003 — Tasks

## Status legend

- `[x]` shaping item completed in this candidate; authority becomes effective only after exact shaping merge/re-read.
- `[ ]` product/evidence work not yet complete.
- Live canonical repository/GitHub truth overrides checkbox text.

## Phase S — Successor shaping

- [x] **D003-T001** Re-read canonical post-002 authority and prove Specification 002 closeout effectivity.
- [x] **D003-T002** Re-read constitution, execution master plan, adapter contract, and Specification 002 closeout.
- [x] **D003-T003** Research current Codex CLI public source/release/headless/sandbox/model/session/platform/license behavior.
- [x] **D003-T004** Research current Claude Code headless/output/model/permission/settings/auth/session/platform/license behavior.
- [x] **D003-T005** Research Gemini CLI as a comparator for headless/output/auth/sandbox/policy/platform/license behavior.
- [x] **D003-T006** Research OpenCode as a comparator for headless/output/provider/model/permission/identity/license behavior.
- [x] **D003-T007** Select Codex CLI and Claude Code as the first two Gold candidates from current evidence.
- [x] **D003-T008** Define invocation-only proprietary-license handling for Claude Code and no-copy/no-redistribution boundary.
- [x] **D003-T009** Define deterministic-fixture vs real-CLI conformance evidence separation.
- [x] **D003-T010** Define authorized implementation paths, dependencies, acceptance, Gold gate, recovery, and non-authority.
- [ ] **D003-T011** Qualify exact shaping PR base/head/scope/CI/reviews/threads/comments/mergeability.
- [ ] **D003-T012** Merge exact shaping head with expected-head protection and re-read canonical authority.

## Phase A — Adapter package and contracts

- [ ] **D003-T020** Create private `@delethos/adapters` with zero external production dependencies.
- [ ] **D003-T021** Add bounded adapter/capability/platform/tier/candidate status types.
- [ ] **D003-T022** Add installation/discovery and exact CLI identity types.
- [ ] **D003-T023** Add validated normalized adapter run request and execution-posture types.
- [ ] **D003-T024** Add exact invocation-plan type with direct executable/argv/cwd/environment semantics.
- [ ] **D003-T025** Add normalized execution identity separating requested and observed provider/model facts.
- [ ] **D003-T026** Add normalized provider/result categories without collapsing runtime terminal causes.
- [ ] **D003-T027** Fail closed on unknown/contradictory/unsupported capability configuration.

## Phase B — Discovery and common invocation

- [ ] **D003-T030** Implement bounded shell-free executable discovery.
- [ ] **D003-T031** Implement exact version observation with missing/failure/ambiguity distinction.
- [ ] **D003-T032** Confirm discovery executes no repository code and does not infer auth readiness.
- [ ] **D003-T033** Implement validated common invocation runner through Specification 002 `superviseProcess`.
- [ ] **D003-T034** Preserve exact cwd and special-character argv boundaries.
- [ ] **D003-T035** Preserve cancel/timeout/stall/output-limit terminal causes without semantic relabeling.
- [ ] **D003-T036** Keep Git base/diff/changed-path truth outside provider result normalization.

## Phase C — Codex candidate

- [ ] **D003-T040** Implement Codex discovery/version handling against the real public CLI surface.
- [ ] **D003-T041** Implement `codex exec` non-interactive invocation with JSONL output.
- [ ] **D003-T042** Bind Codex `--cd` to the exact Delethos worktree.
- [ ] **D003-T043** Implement explicit safe Codex sandbox posture mapping.
- [ ] **D003-T044** Implement Codex model selection only when capability-valid.
- [ ] **D003-T045** Implement non-resume ephemeral/config/rule isolation posture where exact version supports it.
- [ ] **D003-T046** Prohibit dangerous Codex approval/sandbox/hook-trust bypass flags.
- [ ] **D003-T047** Parse Codex JSONL success/failure/final-message/session facts fail-closed.
- [ ] **D003-T048** Implement Codex resume only behind explicit unverified/supported capability gating.
- [ ] **D003-T049** Keep Codex provider-selection status narrow/partial unless exact conformance proves more.

## Phase D — Claude Code candidate

- [ ] **D003-T050** Implement Claude Code discovery/version handling against the real public CLI surface.
- [ ] **D003-T051** Implement non-interactive `claude -p` machine-readable invocation.
- [ ] **D003-T052** Implement explicit `CONTROLLED_BARE` configuration posture with compatible-auth precondition.
- [ ] **D003-T053** Implement explicit `CONTROLLED_STANDARD` posture with bounded settings/MCP/tool/permission controls.
- [ ] **D003-T054** Prevent silent bare-to-standard downgrade when capability semantics differ.
- [ ] **D003-T055** Implement Claude model/max-turn/max-budget controls only when explicitly requested/supported.
- [ ] **D003-T056** Implement bounded tool allow/deny and permission-mode mapping without raw flag passthrough.
- [ ] **D003-T057** Parse Claude JSON/stream-JSON success/failure/final-message/session facts fail-closed.
- [ ] **D003-T058** Implement Claude resume only behind explicit capability gating.
- [ ] **D003-T059** Keep Claude read-only status `UNVERIFIED` until real forbidden-write negative evidence exists.

## Phase E — Deterministic conformance fixtures

- [ ] **D003-T060** Add controlled agent fixture executable for process/protocol simulation only.
- [ ] **D003-T061** Test bounded enum/request/config validation and fail-closed unknowns.
- [ ] **D003-T062** Test missing binary/version discovery failure/ambiguous installation handling.
- [ ] **D003-T063** Test exact cwd and paths with spaces/special characters.
- [ ] **D003-T064** Test exact argv and prove adapter launch is shell-free.
- [ ] **D003-T065** Test unsupported capability/model/provider/session rejection before launch.
- [ ] **D003-T066** Test Codex JSONL normal/provider-failure/malformed/missing-final behavior.
- [ ] **D003-T067** Test Claude JSON/stream-JSON normal/provider-failure/malformed/missing-final behavior.
- [ ] **D003-T068** Test cancel/timeout/stdio-stall/output-limit through the common runtime path.
- [ ] **D003-T069** Test ordinary descendant cleanup and partial output/diff preservation fixtures.
- [ ] **D003-T070** Test large output remains bounded.
- [ ] **D003-T071** Test Codex dangerous bypass flags can never be emitted.
- [ ] **D003-T072** Test Claude configuration posture cannot silently downgrade.
- [ ] **D003-T073** Test normalized evidence excludes credentials/raw environment.
- [ ] **D003-T074** Prove no adapter API/path implements commit/push/merge/release.
- [ ] **D003-T075** Prove synthetic fixtures cannot mark a candidate `GOLD`.

## Phase F — Repository CI and dependency qualification

- [ ] **D003-T080** Extend root typecheck/test command to cover all adapter tests.
- [ ] **D003-T081** Extend dependency gate to permit named internal `workspace:*` dependencies while rejecting external production dependencies.
- [ ] **D003-T082** Keep Linux deterministic CI complete.
- [ ] **D003-T083** Keep macOS deterministic CI complete.
- [ ] **D003-T084** Keep Windows deterministic CI complete.
- [ ] **D003-T085** Confirm workflow remains `contents: read` only with no publish/deploy/release or vendor credentials.
- [ ] **D003-T086** Confirm all prior Specification 001/002 tests remain passing.

## Phase G — Real conformance runner

- [ ] **D003-T090** Implement explicit adapter/case-selected `scripts/adapter-conformance.mjs` entry point.
- [ ] **D003-T091** Create fresh temporary fixture Git repository/worktree per real conformance run.
- [ ] **D003-T092** Record Delethos revision, adapter identity, executable path, CLI version, OS/arch, case id, process/provider/Git facts.
- [ ] **D003-T093** Emit bounded machine-readable conformance results without secrets/hidden reasoning/unbounded transcripts.
- [ ] **D003-T094** Return non-zero on selected required-case failure.
- [ ] **D003-T095** Represent unavailable binary/credential/platform as `UNAVAILABLE`/`UNVERIFIED`, never PASS.
- [ ] **D003-T096** Prevent real conformance from targeting canonical Delethos mutable work by default.

## Phase H — Codex real qualification

- [ ] **D003-T100** Record exact Codex executable/version/platform before each qualified run.
- [ ] **D003-T101** Qualify missing-binary and invalid/missing-auth behavior.
- [ ] **D003-T102** Qualify credentialed bounded write success when authorization/environment is available.
- [ ] **D003-T103** Qualify exact cwd and inspect Git diff independently of provider output.
- [ ] **D003-T104** Qualify read-only + forbidden-write negative path before marking read-only supported.
- [ ] **D003-T105** Qualify model selection and malformed-model behavior if claimed.
- [ ] **D003-T106** Qualify provider failure and malformed/missing final result behavior.
- [ ] **D003-T107** Qualify cancel/timeout/stall/process-tree cleanup and partial diff preservation.
- [ ] **D003-T108** Qualify large output/special paths.
- [ ] **D003-T109** Qualify resume if claimed.
- [ ] **D003-T110** Prove no hidden commit/push/merge side effect.
- [ ] **D003-T111** Prove machine-readable result validity and config/rule isolation assumptions.
- [ ] **D003-T112** Qualify Linux for the claimed Gold surface.
- [ ] **D003-T113** Qualify macOS for the claimed Gold surface.
- [ ] **D003-T114** Qualify Windows for the claimed Gold surface.
- [ ] **D003-T115** Promote Codex to `GOLD` only if every applicable claimed case/platform is complete.

## Phase I — Claude Code real qualification

- [ ] **D003-T120** Record exact Claude executable/version/platform before each qualified run.
- [ ] **D003-T121** Qualify missing-binary and invalid/missing-auth behavior.
- [ ] **D003-T122** Qualify the selected controlled configuration/auth posture without fabricating bare compatibility.
- [ ] **D003-T123** Qualify credentialed bounded write success when authorization/environment is available.
- [ ] **D003-T124** Qualify exact cwd and inspect Git diff independently of provider output.
- [ ] **D003-T125** Qualify read-only + forbidden-write negative path before marking read-only supported.
- [ ] **D003-T126** Qualify model selection and malformed-model behavior if claimed.
- [ ] **D003-T127** Qualify provider failure and malformed/missing final result behavior.
- [ ] **D003-T128** Qualify cancel/timeout/stall/process-tree cleanup and partial diff preservation.
- [ ] **D003-T129** Qualify max-turn/max-budget/tool/permission controls only where claimed.
- [ ] **D003-T130** Qualify large output/special paths.
- [ ] **D003-T131** Qualify resume if claimed.
- [ ] **D003-T132** Prove no hidden commit/push/merge side effect.
- [ ] **D003-T133** Prove machine-readable result validity and ambient configuration assumptions.
- [ ] **D003-T134** Qualify Linux for the claimed Gold surface.
- [ ] **D003-T135** Qualify macOS for the claimed Gold surface.
- [ ] **D003-T136** Qualify Windows for the claimed Gold surface.
- [ ] **D003-T137** Promote Claude Code to `GOLD` only if every applicable claimed case/platform is complete.

## Phase J — Exact-head product merge

- [ ] **D003-T140** Run/document strongest deterministic local/fixture checks before PR qualification.
- [ ] **D003-T141** Audit exact changed paths against Specification 003 authority.
- [ ] **D003-T142** Confirm no vendor binary/proprietary implementation code/secret-bearing workflow entered the diff.
- [ ] **D003-T143** Reconcile exact base/head, all configured CI, reviews, threads, comments, bot availability, and mergeability.
- [ ] **D003-T144** Preserve unavailable/skipped/status-only review systems as non-PASS.
- [ ] **D003-T145** Merge exact qualified implementation with expected-head protection.
- [ ] **D003-T146** Require canonical post-merge Linux/macOS/Windows deterministic CI.
- [ ] **D003-T147** Re-read canonical implementation and authority after merge.

## Phase K — Terminal qualification and closeout

- [ ] **D003-T150** Reconcile exact real Codex conformance evidence and capability/platform statuses.
- [ ] **D003-T151** Reconcile exact real Claude conformance evidence and capability/platform statuses.
- [ ] **D003-T152** Preserve all failed/unavailable conformance cases and residual vendor/security limitations.
- [ ] **D003-T153** Confirm both selected candidates are genuinely `GOLD`; otherwise keep Specification 003 open/blocked.
- [ ] **D003-T154** Confirm no Specification 004+ reviewer orchestration/repair-loop behavior entered the implementation.
- [ ] **D003-T155** Produce terminal Specification 003 closeout evidence only after the two-Gold gate is machine-observed.
- [ ] **D003-T156** Qualify closeout exact head/scope/CI/reviews/threads/comments/mergeability.
- [ ] **D003-T157** Merge closeout with expected-head protection and require canonical post-closeout checks.
- [ ] **D003-T158** Re-read canonical `main` and return to bounded successor shaping without auto-activating Specification 004 from roadmap order.
