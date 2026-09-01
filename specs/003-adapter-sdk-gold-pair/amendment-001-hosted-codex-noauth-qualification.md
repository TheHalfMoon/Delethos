# Specification 003 Amendment 001 — Hosted Codex No-Auth Qualification

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 003 is active.  
**Evidence date:** 2026-09-01  
**Scope:** one narrowly bounded, no-secret, no-provider-work GitHub-hosted qualification path for the OpenAI Codex CLI candidate only. No Claude Code installation or execution authority. No credentialed qualification authority.

## Why this amendment exists

Specification 003 intentionally made real Gold qualification local/manual by default. Canonical implementation and deterministic qualification are now complete, but the execution environment available to the project tooling cannot materialize a real vendor CLI or provide macOS/Windows vendor-CLI environments. Issue #16 records that operational blocker.

Fresh primary-source verification also establishes that OpenAI publishes Codex CLI `0.152.0` as an Apache-2.0 release and as the official `@openai/codex@0.152.0` package with platform-specific native binaries for Linux, macOS, and Windows. Running discovery/version and unauthenticated status checks does not require a model request, provider credential, or paid coding-agent session.

Primary references:

- https://github.com/openai/codex/releases/tag/rust-v0.152.0
- https://github.com/openai/codex/blob/main/codex-cli/bin/codex.js
- https://github.com/openai/codex/blob/main/LICENSE

No donor implementation code is copied into Delethos.

## Normative precedence

This amendment is the prior canonical Specification 003 plan amendment contemplated by the CI contract for a future hosted qualification workflow.

It supersedes conflicting Specification 003 wording only to the extent necessary to permit the bounded hosted execution defined below. All other Specification 003 restrictions remain in force.

In particular, this amendment does **not** weaken the rule that Gold requires real machine-observed evidence, does not convert hosted availability into credentialed success, and does not permit founder approval to substitute for missing credentials or platforms.

## Authorized hosted qualification

The existing `.github/workflows/ci.yml` path may add one trusted-`main`-push qualification job for `openai-codex-cli` only.

The job is authorized only when all of the following are true:

1. the workflow event is a push to canonical `main`;
2. the pushed head commit message contains the exact marker `[codex-noauth]`;
3. repository permissions remain `contents: read` only;
4. no repository, environment, organization, or third-party secret is requested or referenced;
5. the installed Codex package version is exactly `0.152.0`;
6. the native executable used by Delethos is extracted/resolved from that pinned official package and placed only in the ephemeral hosted-runner filesystem;
7. no model request, coding task, network provider inference, write-capable adapter case, or paid session is executed;
8. conformance output is emitted only as bounded stdout job-log records; no evidence artifact is uploaded or persisted by the workflow;
9. the job runs only the exact cases authorized below;
10. failure, unavailability, or unexpected CLI behavior remains FAIL/UNAVAILABLE/UNVERIFIED and must not be relabeled as PASS.

## Authorized cases

For each of the existing GitHub-hosted qualification platforms:

```text
linux
macos
windows
```

the one-shot job may run exactly:

```text
missing-binary
discovery-version
platform-launch
auth-failure
```

`auth-failure` must use the conformance runner's isolated unauthenticated environment. It may invoke only Codex authentication-status behavior and must not perform a model request.

These records may satisfy only the matching no-auth portions of Phase H when their exact canonical revision, adapter implementation identity, CLI version, platform/arch, and outcome are reconciled after the run.

## Installation boundary

The hosted job may install `@openai/codex@0.152.0` into an ephemeral runner-local directory with lifecycle scripts disabled, resolve the package's platform-native Codex executable, copy that executable into a runner-local temporary `PATH` directory, and delete nothing outside the ephemeral runner lifecycle.

This is qualification infrastructure only. It does not add a repository runtime dependency, does not vendor a binary, does not alter package manifests/lockfiles, and does not authorize normal Delethos product execution to install vendor CLIs automatically.

The job must confirm the observed CLI version before relying on discovery evidence. Any version mismatch fails the hosted qualification unit.

## Evidence publication exception

Specification 003's default prohibition on automatically publishing real-conformance results to a remote service remains in force except for this narrow case:

- the four bounded no-auth Codex records may appear in the trusted GitHub Actions job log for the marked canonical-main push;
- no artifact upload is authorized;
- no raw environment, credential value, unbounded transcript, hidden reasoning, or provider response is authorized;
- no credentialed real-conformance record may use this exception.

The GitHub Actions log is evidence input for later canonical reconciliation; the log itself does not update candidate tier/capability status.

## Product-path effect

No new product path is authorized.

Implementation is limited to the already-authorized path:

```text
.github/workflows/ci.yml
```

The deterministic `core` matrix must remain unchanged in semantics and continue to run on pull requests and canonical main pushes.

## Required qualification before use

The amendment PR itself must pass the existing deterministic Linux/macOS/Windows CI and normal exact-head reconciliation before expected-head merge.

After this amendment is canonical, a separate bounded implementation PR may modify `.github/workflows/ci.yml`. That implementation PR must itself pass deterministic CI and exact-head reconciliation before merge. The hosted Codex no-auth job must run only on the resulting marked canonical-main push, never on the untrusted PR head.

## Non-authority

This amendment does not authorize:

- OpenAI account or API-key creation;
- reading, storing, forwarding, or injecting OpenAI credentials;
- credentialed Codex model execution;
- write-success, exact-cwd provider work, provider-failure inference, timeout/cancel/process-tree provider cases, model-selection, resume, read-only, forbidden-write, or any other case not listed above;
- any Claude Code download, installation, execution, licensing assumption, or qualification;
- secret-bearing GitHub Actions;
- artifact uploads or persistent hosted evidence storage;
- broad vendor installation in normal deterministic CI;
- changing either candidate tier or capability status from these four records alone;
- Specification 003 closeout;
- Specification 004 activation.

## Completion effect

If the one-shot hosted matrix succeeds, only the corresponding Codex no-auth Phase H facts may be reconciled as complete. All credentialed Codex cases, all Claude Code real qualification, both Gold promotions, and terminal closeout remain independently evidence-gated.