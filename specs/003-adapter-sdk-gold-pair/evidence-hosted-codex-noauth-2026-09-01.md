# Specification 003 Evidence — Hosted Codex No-Auth Qualification

**Status:** PARTIAL_REAL_CLI_EVIDENCE — NOT GOLD  
**Evidence date:** 2026-09-01  
**Authority:** Specification 003, Amendment 001, Amendment 002  
**Real-Gold tracker:** Issue #16

## Scope

This evidence document reconciles only the hosted OpenAI Codex CLI cases that were actually authorized and machine-observed on canonical `main` without vendor credentials, provider-backed work, or a paid coding-agent session:

```text
missing-binary
discovery-version
platform-launch
auth-failure
```

It does not widen execution authority and does not promote Codex to `GOLD`.

## Latest exact canonical qualification identity

```text
adapter_id = openai-codex-cli
adapter_implementation_version = spec003-candidate.2
conformance_schema = delethos.adapter-conformance.candidate.3
delethos_revision = 6f60edc8b388eca0476050ee9a87536166348fac
hosted_run = 33560429571
pinned_package = @openai/codex@0.152.0
observed_cli_version = codex-cli 0.152.0
deterministic_test_suite = 105/105 PASS
```

The exact hosted jobs were:

```text
linux/x64   = 100031315562
macos/arm64 = 100031314766
windows/x64 = 100031314675
```

The same canonical push also completed the deterministic `core` matrix successfully on Linux, macOS, and Windows.

## Machine-observed result matrix

| Platform | Architecture | `missing-binary` | `discovery-version` | `platform-launch` | `auth-failure` | Observed CLI version for installed cases |
| --- | --- | --- | --- | --- | --- | --- |
| Linux | x64 | PASS | PASS | PASS | PASS | `codex-cli 0.152.0` |
| macOS | arm64 | PASS | PASS | PASS | PASS | `codex-cli 0.152.0` |
| Windows | x64 | PASS | PASS | PASS | PASS | `codex-cli 0.152.0` |

Every emitted result identified `source = REAL_CLI`, exact Delethos revision `6f60edc8b388eca0476050ee9a87536166348fac`, adapter id `openai-codex-cli`, and adapter implementation version `spec003-candidate.2`.

For every case on every platform, Delethos independently recorded:

```text
outcome = PASS
headUnchanged = true
refsUnchanged = true
worktreeDirty = false
gitDiffSha256 = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

The `missing-binary` case intentionally emitted `executablePath = null` and `cliVersion = null` with `detail = missing-state=NOT_INSTALLED`.

The installed discovery/platform/auth cases emitted the runner-temporary executable path and exact observed CLI version. For `auth-failure`, every platform emitted:

```text
caseId = auth-failure
requestedPosture = null
requestedModel = null
requestedProvider = null
outcome = PASS
detail = auth-status=UNAUTHENTICATED
adapterStatus = null
processCause = null
exitCode = null
finalMessagePresent = null
sessionId = null
observedModel = null
headUnchanged = true
refsUnchanged = true
worktreeDirty = false
```

The null adapter/process/provider fields are intentional evidence of the Amendment 001 boundary: the hosted `auth-failure` case stopped after isolated unauthenticated status observation and did not dispatch `startAgent`, a Codex model request, a provider session, or repository-writing work.

No credential, authentication session, provider completion, paid session, model request, provider selection, or credentialed repository-writing work occurred in this hosted run.

## Runner-integrity history

### Native package resolution

Two earlier canonical hosted Windows attempts failed before conformance because the workflow assumed package-manager physical layout details even though exact Codex `0.152.0` installation succeeded:

```text
failed_run_1 = 33535489680
repair_1_merge = 944a706c3a0fd53017e4263711e6082126832d03
failed_run_2 = 33553439476
repair_2_merge = 10f3086c68fcb629413ad2acc4351e72c2901eee
successful_three_case_run = 33553753394
```

The successful native-resolution repair resolves the unique platform-native executable only inside the ephemeral pinned install tree by exact target-native suffix, fails closed on zero or multiple matches, and verifies exact observed Codex `0.152.0` before running conformance. Amendment 002 canonically records the resulting provenance rule.

### Authentication-status boundary

Canonical Amendment 001 authorized `auth-failure` but required it to use an isolated unauthenticated environment, invoke only Codex authentication-status behavior, and perform no model request. Live runner inspection found that the pre-repair branch observed unauthenticated status and then dispatched `startAgent(...)`; the hosted workflow also omitted the fourth authorized case.

PR #27 repaired that defect before any hosted `auth-failure` result was accepted. The canonical repair is:

```text
repair_merge = 6f60edc8b388eca0476050ee9a87536166348fac
post_merge_run = 33560429571
```

The repair made `auth-failure` posture-neutral, removed agent/model dispatch from the case, added deterministic regression coverage proving the branch cannot dispatch `startAgent`, `runCodex`, or `runClaude`, and added the fourth Amendment 001 workflow step. The canonical deterministic suite observed `105/105` tests passing.

All failed or incomplete earlier attempts remain historical evidence. They are not rewritten as PASS merely because later repairs succeeded.

## Earlier three-case qualification history

Before the status-only repair, canonical run `33553753394` at revision `10f3086c68fcb629413ad2acc4351e72c2901eee` successfully established only:

```text
missing-binary
discovery-version
platform-launch
```

on Linux/x64, macOS/arm64, and Windows/x64. That earlier run remains valid historical evidence for those three cases, but the latest four-case frontier is run `33560429571` at revision `6f60edc8b388eca0476050ee9a87536166348fac`.

## What this evidence establishes

This evidence establishes the complete no-secret/no-provider-work Codex subset authorized by Amendment 001:

1. missing executable handling on Linux, macOS, and Windows;
2. real executable discovery and exact `0.152.0` version observation on Linux, macOS, and Windows;
3. real platform launch on Linux, macOS, and Windows;
4. isolated missing-authentication status behavior on Linux, macOS, and Windows without a model request;
5. clean repository observations for those exact cases;
6. bounded machine-readable result emission for those exact cases;
7. runner integrity for the pinned package/native executable resolution used by this hosted subset;
8. runner integrity for the status-only authentication boundary.

Accordingly, **D003-T101** is complete: both missing-binary and the Amendment-001-authorized invalid/missing-auth portion are now machine-observed on all three hosted qualification platforms. This completion is limited to the matching no-auth Phase H facts explicitly permitted by Amendment 001.

## What remains unqualified

This evidence does **not** establish the complete Specification 003 Gold surface. Required or conditionally applicable real cases still lacking complete machine-observed evidence include, at minimum:

- credentialed bounded write success;
- exact credentialed worktree/cwd and independent diff behavior;
- real read-only posture and forbidden-write negative behavior if read-only is claimed;
- model/provider selection and malformed selector behavior where claimed;
- provider success and provider-declared failure;
- timeout, stdio stall, cancellation, process-tree cleanup, and partial-diff preservation under real provider execution;
- malformed or missing final provider result behavior under real provider execution;
- large output and quoting/special-path behavior under real provider execution;
- resume/session behavior if claimed;
- dirty repository/worktree preconditions under the applicable real execution path;
- proof of no hidden commit/push/merge side effect across the applicable real Gold surface;
- full machine-readable-result validity across the applicable real Gold surface;
- configuration/rule isolation assumptions used by the adapter;
- exact-version/platform recording across all future credentialed qualification runs;
- all other applicable Specification 003 Gold cases outside Amendment 001's four-case scope.

Therefore **D003-T100** remains open as an ongoing exact-identity requirement for the remaining qualified runs, and **D003-T102** through **D003-T115** remain open except for the now-complete **D003-T101**. In particular, `D003-T112`, `D003-T113`, and `D003-T114` require qualification of the claimed Gold surface on each platform rather than the hosted no-auth subset alone.

## Claude boundary

This document records no Claude Code qualification. Canonical Amendment 003 requires genuine, current, non-revoked vendor-use authority evidence before Delethos-hosted Claude installation or execution may be considered. Public release/install documentation and ordinary founder approval do not substitute for that external prerequisite.

No Claude installation, execution, authentication, or Gold evidence is represented here.

## Qualification state after reconciliation

```text
CODEX_HOSTED_NOAUTH_REVISION = 6f60edc8b388eca0476050ee9a87536166348fac
CODEX_HOSTED_NOAUTH_RUN = 33560429571
CODEX_HOSTED_NOAUTH_CASES = missing-binary:PASS discovery-version:PASS platform-launch:PASS auth-failure:PASS
CODEX_HOSTED_NOAUTH_MATRIX = linux/x64:PASS macos/arm64:PASS windows/x64:PASS
D003_T101 = COMPLETE
CODEX_GOLD = NOT_QUALIFIED
CLAUDE_VENDOR_USE_AUTHORITY = NOT_ESTABLISHED_IN_CANONICAL_EVIDENCE
CLAUDE_HOSTED_NOAUTH = PROHIBITED_WHILE_GATE_UNSATISFIED
CLAUDE_GOLD = NOT_QUALIFIED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
```

No Codex Gold promotion, Claude qualification, terminal closeout, or Specification 004 authority follows from this evidence.
