# Specification 003 — Tasks

## Status legend

- `[x]` item is complete in canonical repository/GitHub truth and backed by the evidence frontier below.
- `[ ]` item is not yet complete.
- Live canonical repository/GitHub truth overrides checkbox text if they ever diverge.

## Canonical evidence frontier

```text
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
CANONICAL_IMPLEMENTATION_REVISION = 05ab40fa224f046c6139d52ce4421579d94b5593
CANONICAL_POST_MERGE_CI = 33529134266
CANONICAL_GOVERNANCE_REVISION = 5ee580bf73ac602da323a07b70f862647c282fb2
CANONICAL_GOVERNANCE_POST_MERGE_CI = 33559051578
DETERMINISTIC_MATRIX = linux:PASS macos:PASS windows:PASS
LATEST_EXACT_HEAD_TEST_SUITE = 103/103 PASS
REAL_GOLD_TRACKER = issue #16
CODEX_HOSTED_NOAUTH_REVISION = 10f3086c68fcb629413ad2acc4351e72c2901eee
CODEX_HOSTED_NOAUTH_RUN = 33553753394
CODEX_HOSTED_NOAUTH_CASES = missing-binary:PASS discovery-version:PASS platform-launch:PASS
CODEX_HOSTED_NOAUTH_MATRIX = linux/x64:PASS macos/arm64:PASS windows/x64:PASS
CODEX_GOLD = NOT_QUALIFIED
CLAUDE_VENDOR_USE_AUTHORITY = NOT_ESTABLISHED_IN_CANONICAL_EVIDENCE
CLAUDE_HOSTED_NOAUTH = PROHIBITED_WHILE_GATE_UNSATISFIED
CLAUDE_RELEASE_PROVENANCE_GATE = SIGNED_MANIFEST_PLUS_FRESH_OFFICIAL_FINGERPRINT_REQUIRED_BEFORE_ANY_FUTURE_EXECUTION
CLAUDE_GOLD = NOT_QUALIFIED
```

Phases S–G and J are canonically complete. Phases H and I require real machine-observed vendor-CLI evidence across the required platform matrix. Phase K remains blocked until both candidates genuinely satisfy the Gold gate. Missing executables, credentials, vendor access, or platform environments remain `UNAVAILABLE`/`UNVERIFIED`; ordinary founder approval does not substitute for them.

Canonical hosted Codex run `33553753394` establishes only the real no-auth subset recorded in `evidence-hosted-codex-noauth-2026-09-01.md`. It does not complete **D003-T101** because invalid/missing-auth behavior was not run, does not satisfy **D003-T112** through **D003-T114** because the complete claimed Gold surface remains unqualified, and does not promote Codex.

Canonical Specification 003 Amendment 003 at `5ee580bf73ac602da323a07b70f862647c282fb2`, with post-merge deterministic run `33559051578` successful on Linux/macOS/Windows, establishes the fail-closed Claude hosted-qualification authority boundary. It does not establish that the repository owner lacks a vendor agreement; it records only that canonical project evidence available to this qualification context does not establish authority to install or execute Claude Code in hosted Specification 003 qualification. Any future hosted Claude execution requires a canonical non-secret authority evidence reference, exact hosted-Specification-003 scope, non-revoked current status, immediate pre-execution revalidation, fresh official release/signing facts, authenticated detached-manifest verification, and artifact/executable integrity verification. No Phase I checkbox is promoted by this governance evidence, and public release/install documentation remains shaping/provenance evidence rather than runtime qualification.

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
- [x] **D003-T011** Qualify exact shaping PR base/head/scope/CI/reviews/threads/comments/mergeability.
- [x] **D003-T012** Merge exact shaping head with expected-head protection and re-read canonical authority.

## Phase A — Adapter package and contracts

- [x] **D003-T020** Create private `@delethos/adapters` with zero external production dependencies.
- [x] **D003-T021** Add bounded adapter/capability/platform/tier/candidate status types.
- [x] **D003-T022** Add installation/discovery and exact CLI identity types.
- [x] **D003-T023** Add validated normalized adapter run request and execution-posture types.
- [x] **D003-T024** Add exact invocation-plan type with direct executable/argv/cwd/environment semantics.
- [x] **D003-T025** Add normalized execution identity separating requested and observed provider/model facts.
- [x] **D003-T026** Add normalized provider/result categories without collapsing runtime terminal causes.
- [x] **D003-T027** Fail closed on unknown/contradictory/unsupported capability configuration.

## Phase B — Discovery and common invocation

- [x] **D003-T030** Implement bounded shell-free executable discovery.
- [x] **D003-T031** Implement exact version observation with missing/failure/ambiguity distinction.
- [x] **D003-T032** Confirm discovery executes no repository code and does not infer auth readiness.
- [x] **D003-T033** Implement validated common invocation runner through Specification 002 `superviseProcess`.
- [x] **D003-T034** Preserve exact cwd and special-character argv boundaries.
- [x] **D003-T035** Preserve cancel/timeout/stall/output-limit terminal causes without semantic relabeling.
- [x] **D003-T036** Keep Git base/diff/changed-path truth outside provider result normalization.

## Phase C — Codex candidate

- [x] **D003-T040** Implement Codex discovery/version handling against the real public CLI surface.
- [x] **D003-T041** Implement `codex exec` non-interactive invocation with JSONL output.
- [x] **D003-T042** Bind Codex `--cd` to the exact Delethos worktree.
- [x] **D003-T043** Implement explicit safe Codex sandbox posture mapping.
- [x] **D003-T044** Implement Codex model selection only when capability-valid.
- [x] **D003-T045** Implement non-resume ephemeral/config/rule isolation posture where exact version supports it.
- [x] **D003-T046** Prohibit dangerous Codex approval/sandbox/hook-trust bypass flags.
- [x] **D003-T047** Parse Codex JSONL success/failure/final-message/session facts fail-closed.
- [x] **D003-T048** Implement Codex resume only behind explicit unverified/supported capability gating.
- [x] **D003-T049** Keep Codex provider-selection status narrow/partial unless exact conformance proves more.

## Phase D — Claude Code candidate

- [x] **D003-T050** Implement Claude Code discovery/version handling against the real public CLI surface.
- [x] **D003-T051** Implement non-interactive `claude -p` machine-readable invocation.
- [x] **D003-T052** Implement explicit `CONTROLLED_BARE` configuration posture with compatible-auth precondition.
- [x] **D003-T053** Implement explicit `CONTROLLED_STANDARD` posture with bounded settings/MCP/tool/permission controls.
- [x] **D003-T054** Prevent silent bare-to-standard downgrade when capability semantics differ.
- [x] **D003-T055** Implement Claude model/max-turn/max-budget controls only when explicitly requested/supported.
- [x] **D003-T056** Implement bounded tool allow/deny and permission-mode mapping without raw flag passthrough.
- [x] **D003-T057** Parse Claude JSON/stream-JSON success/failure/final-message/session facts fail-closed.
- [x] **D003-T058** Implement Claude resume only behind explicit capability gating.
- [x] **D003-T059** Keep Claude read-only status `UNVERIFIED` until real forbidden-write negative evidence exists.

## Phase E — Deterministic conformance fixtures

- [x] **D003-T060** Add controlled agent fixture executable for process/protocol simulation only.
- [x] **D003-T061** Test bounded enum/request/config validation and fail-closed unknowns.
- [x] **D003-T062** Test missing binary/version discovery failure/ambiguous installation handling.
- [x] **D003-T063** Test exact cwd and paths with spaces/special characters.
- [x] **D003-T064** Test exact argv and prove adapter launch is shell-free.
- [x] **D003-T065** Test unsupported capability/model/provider/session rejection before launch.
- [x] **D003-T066** Test Codex JSONL normal/provider-failure/malformed/missing-final behavior.
- [x] **D003-T067** Test Claude JSON/stream-JSON normal/provider-failure/malformed/missing-final behavior.
- [x] **D003-T068** Test cancel/timeout/stdio-stall/output-limit through the common runtime path.
- [x] **D003-T069** Test ordinary descendant cleanup and partial output/diff preservation fixtures.
- [x] **D003-T070** Test large output remains bounded.
- [x] **D003-T071** Test Codex dangerous bypass flags can never be emitted.
- [x] **D003-T072** Test Claude configuration posture cannot silently downgrade.
- [x] **D003-T073** Test normalized evidence excludes credentials/raw environment.
- [x] **D003-T074** Prove no adapter API/path implements commit/push/merge/release.
- [x] **D003-T075** Prove synthetic fixtures cannot mark a candidate `GOLD`.

## Phase F — Repository CI and dependency qualification

- [x] **D003-T080** Extend root typecheck/test command to cover all adapter tests.
- [x] **D003-T081** Extend dependency gate to permit named internal `workspace:*` dependencies while rejecting external production dependencies.
- [x] **D003-T082** Keep Linux deterministic CI complete.
- [x] **D003-T083** Keep macOS deterministic CI complete.
- [x] **D003-T084** Keep Windows deterministic CI complete.
- [x] **D003-T085** Confirm workflow remains `contents: read` only with no publish/deploy/release or vendor credentials.
- [x] **D003-T086** Confirm all prior Specification 001/002 tests remain passing.

## Phase G — Real conformance runner

- [x] **D003-T090** Implement explicit adapter/case-selected `scripts/adapter-conformance.mjs` entry point.
- [x] **D003-T091** Create fresh temporary fixture Git repository/worktree per real conformance run.
- [x] **D003-T092** Record Delethos revision, adapter identity, executable path, CLI version, OS/arch, case id, process/provider/Git facts.
- [x] **D003-T093** Emit bounded machine-readable conformance results without secrets/hidden reasoning/unbounded transcripts.
- [x] **D003-T094** Return non-zero on selected required-case failure.
- [x] **D003-T095** Represent unavailable binary/credential/platform as `UNAVAILABLE`/`UNVERIFIED`, never PASS.
- [x] **D003-T096** Prevent real conformance from targeting canonical Delethos mutable work by default.

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

- [x] **D003-T140** Run/document strongest deterministic local/fixture checks before PR qualification.
- [x] **D003-T141** Audit exact changed paths against Specification 003 authority.
- [x] **D003-T142** Confirm no vendor binary/proprietary implementation code/secret-bearing workflow entered the diff.
- [x] **D003-T143** Reconcile exact base/head, all configured CI, reviews, threads, comments, bot availability, and mergeability.
- [x] **D003-T144** Preserve unavailable/skipped/status-only review systems as non-PASS.
- [x] **D003-T145** Merge exact qualified implementation with expected-head protection.
- [x] **D003-T146** Require canonical post-merge Linux/macOS/Windows deterministic CI.
- [x] **D003-T147** Re-read canonical implementation and authority after merge.

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
