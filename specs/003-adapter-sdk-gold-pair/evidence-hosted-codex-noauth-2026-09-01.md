# Specification 003 Evidence — Hosted Codex No-Auth Qualification

**Status:** PARTIAL_REAL_CLI_EVIDENCE — NOT GOLD  
**Evidence date:** 2026-09-01  
**Authority:** Specification 003, Amendment 001, Amendment 002  
**Real-Gold tracker:** Issue #16

## Scope

This evidence document reconciles only the hosted OpenAI Codex CLI cases that were actually authorized and machine-observed on canonical `main` without vendor credentials or provider-backed work:

```text
missing-binary
discovery-version
platform-launch
```

It does not widen execution authority and does not promote Codex to `GOLD`.

## Exact canonical qualification identity

```text
adapter_id = openai-codex-cli
adapter_implementation_version = spec003-candidate.2
conformance_schema = delethos.adapter-conformance.candidate.3
delethos_revision = 10f3086c68fcb629413ad2acc4351e72c2901eee
hosted_run = 33553753394
pinned_package = @openai/codex@0.152.0
observed_cli_version = codex-cli 0.152.0
```

The exact hosted jobs were:

```text
linux/x64   = 100009412867
macos/arm64 = 100009412996
windows/x64 = 100009413251
```

## Machine-observed result matrix

| Platform | Architecture | `missing-binary` | `discovery-version` | `platform-launch` | Observed CLI version for installed cases |
| --- | --- | --- | --- | --- | --- |
| Linux | x64 | PASS | PASS | PASS | `codex-cli 0.152.0` |
| macOS | arm64 | PASS | PASS | PASS | `codex-cli 0.152.0` |
| Windows | x64 | PASS | PASS | PASS | `codex-cli 0.152.0` |

Every emitted result identified `source = REAL_CLI`, exact Delethos revision `10f3086c68fcb629413ad2acc4351e72c2901eee`, adapter id `openai-codex-cli`, and adapter implementation version `spec003-candidate.2`.

For every case on every platform, Delethos independently recorded:

```text
outcome = PASS
headUnchanged = true
refsUnchanged = true
worktreeDirty = false
gitDiffSha256 = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

The `missing-binary` case intentionally emitted `executablePath = null` and `cliVersion = null` with `detail = missing-state=NOT_INSTALLED`. The installed discovery/platform cases emitted the runner-temporary executable path and exact observed CLI version.

No credential, authentication session, provider completion, paid session, model request, provider selection, or credentialed repository-writing work occurred in this hosted run.

## Windows runner-integrity history

Two canonical hosted Windows attempts failed before conformance because the workflow assumed package-manager physical layout details even though exact Codex `0.152.0` installation succeeded:

```text
failed_run_1 = 33535489680
repair_1_merge = 944a706c3a0fd53017e4263711e6082126832d03
failed_run_2 = 33553439476
repair_2_merge = 10f3086c68fcb629413ad2acc4351e72c2901eee
successful_run = 33553753394
```

The successful repair resolves the unique platform-native executable only inside the ephemeral pinned install tree by exact target-native suffix, fails closed on zero or multiple matches, and verifies exact observed Codex `0.152.0` before running conformance. Amendment 002 canonically records the resulting provenance rule.

The two failed runs remain failed evidence. They are not rewritten as PASS merely because a later repair succeeded.

## What this evidence establishes

This evidence establishes a real, exact-version, cross-platform hosted subset for Codex:

1. missing executable handling on Linux, macOS, and Windows;
2. real executable discovery and exact `0.152.0` version observation on Linux, macOS, and Windows;
3. real platform launch on Linux, macOS, and Windows;
4. clean repository observations for those exact cases;
5. machine-readable result emission for those exact cases;
6. runner integrity for the pinned package/native executable resolution used by this hosted subset.

## What remains unqualified

This evidence does **not** establish the complete Specification 003 Gold surface. Required or conditionally applicable real cases still lacking complete machine-observed evidence include, at minimum:

- invalid/missing authentication behavior;
- credentialed bounded write success;
- exact credentialed worktree/cwd and independent diff behavior;
- real read-only posture and forbidden-write negative behavior if read-only is claimed;
- model/provider selection and malformed selector behavior where claimed;
- provider success and provider-declared failure;
- timeout, stdio stall, cancellation, process-tree cleanup, and partial-diff preservation under real vendor execution;
- malformed or missing final provider result behavior under real vendor execution;
- large output and quoting/special-path behavior under real vendor execution;
- resume/session behavior if claimed;
- dirty repository/worktree preconditions;
- proof of no hidden commit/push/merge side effect across the applicable real Gold surface;
- full machine-readable-result validity across the applicable real Gold surface;
- configuration/rule isolation assumptions used by the adapter;
- all other applicable Specification 003 Gold cases not present in run `33553753394`.

Accordingly, this run does not complete the composite `D003-T101` task because invalid/missing-auth behavior did not run. It also does not complete `D003-T112`, `D003-T113`, or `D003-T114`, because those tasks require qualification of the claimed Gold surface on each platform rather than discovery/platform launch alone.

## Claude boundary

This document records no Claude Code qualification. Specification 003's proprietary-code boundary permits invocation of the user's installation under the user's vendor agreement. Canonical project evidence currently does not establish vendor-use authority for installing/executing Claude Code in Delethos-hosted CI, and public installation documentation does not substitute for that external prerequisite.

No Claude installation, execution, authentication, or Gold evidence is represented here.

## Qualification state after reconciliation

```text
CODEX_HOSTED_NOAUTH_REVISION = 10f3086c68fcb629413ad2acc4351e72c2901eee
CODEX_HOSTED_NOAUTH_RUN = 33553753394
CODEX_HOSTED_NOAUTH_CASES = missing-binary:PASS discovery-version:PASS platform-launch:PASS
CODEX_HOSTED_NOAUTH_MATRIX = linux/x64:PASS macos/arm64:PASS windows/x64:PASS
CODEX_GOLD = NOT_QUALIFIED
CLAUDE_GOLD = NOT_QUALIFIED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
```

No Gold promotion, terminal closeout, or Specification 004 authority follows from this evidence.