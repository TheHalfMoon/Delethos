# Specification 003 Amendment 004 — Hosted Claude Missing-Binary Observation

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 003 is active.  
**Evidence date:** 2026-09-02  
**Scope:** one narrowly bounded, no-secret, no-vendor-binary, no-provider-work GitHub-hosted observation of Delethos's existing `missing-binary` conformance path under the Claude Code candidate identity. This amendment does not authorize downloading, installing, unpacking, discovering, executing, authenticating, or invoking Claude Code.

## Why this amendment exists

Specification 003 requires real machine-observed evidence for the selected Gold candidates, including missing-binary behavior. Canonical Amendment 003 correctly prohibits hosted Claude Code download, installation, unpacking, or execution while exact-purpose vendor-use authority remains unestablished.

The existing `missing-binary` conformance case is materially different from vendor execution. It does **not** search for or invoke `claude`. The runner deliberately asks `resolveExecutable(...)` to resolve a per-process sentinel name of the form `delethos-definitely-missing-<pid>`, then records whether the discovery layer returns `NOT_INSTALLED` while the isolated fixture repository remains unchanged. The selected adapter still binds the emitted conformance record to `anthropic-claude-code` and the exact adapter implementation revision.

Therefore this case machine-observes Delethos's missing-executable behavior for the Claude candidate; it does **not** establish whether Claude Code is or is not installed on the hosted runner, and it does not execute any Anthropic product.

The current project tooling does not provide a locally materialized canonical repository with outbound GitHub access suitable for preserving this observation as reproducible project evidence. GitHub-hosted Linux, macOS, and Windows runners can provide the required platform matrix without materializing or executing any Anthropic binary.

This amendment exists only to permit that bounded observation and its bounded job-log evidence.

## Normative precedence

This amendment supersedes conflicting Specification 003 remote-publication wording only for the exact hosted record defined below.

It does **not** supersede Amendment 003's vendor-use authority gate. In particular, Amendment 003 continues to prohibit every Claude Code download, installation, unpacking, execution, authentication, provider interaction, and model interaction while that gate is unsatisfied.

If any workflow implementation would require a Claude executable to be present, would attempt to locate the actual `claude` executable, or would attempt to obtain or invoke Claude Code, this amendment provides no authority and the unit must fail closed before that action.

## Authorized hosted observation

The existing `.github/workflows/ci.yml` may add one trusted-`main`-push observation job for `anthropic-claude-code` only when all of the following are true:

1. the workflow event is a push to canonical `main`;
2. the pushed head commit message contains the exact marker `[claude-missing]`;
3. repository permissions remain `contents: read` only;
4. no repository, environment, organization, vendor, or third-party secret is requested or referenced;
5. the workflow does not download, install, unpack, copy, materialize, cache, restore, locate, or otherwise obtain any Claude Code binary or package;
6. the workflow does not invoke `claude`, any Anthropic authentication endpoint, any provider endpoint, or any model;
7. the job runs only the exact existing conformance case `missing-binary`;
8. the conformance runner retains its canonical sentinel-name semantics: it resolves only the deliberately nonexistent `delethos-definitely-missing-<pid>` name and does not discover the actual vendor executable in this case;
9. bounded conformance output appears only in the GitHub Actions job log; no evidence artifact is uploaded or persisted by the workflow;
10. any drift from the canonical sentinel-only case semantics, vendor process launch, vendor-network interaction, or other unexpected behavior is FAIL/UNVERIFIED and must not be relabeled as PASS.

## Authorized case and platform matrix

For each existing GitHub-hosted qualification platform:

```text
linux
macos
windows
```

the one-shot job may run exactly:

```text
node scripts/adapter-conformance.mjs --adapter claude --case missing-binary --output stdout
```

No other Claude conformance case is authorized by this amendment.

The expected bounded observation is the existing conformance contract's missing-executable result, including:

```text
source = REAL_CLI
adapterId = anthropic-claude-code
caseId = missing-binary
executablePath = null
cliVersion = null
outcome = PASS
detail = missing-state=NOT_INSTALLED
headUnchanged = true
refsUnchanged = true
worktreeDirty = false
```

For this case, `source = REAL_CLI` is the canonical real-conformance record category used by the existing runner. It does **not** mean a Claude CLI process was present or executed. The machine-observed fact is the sentinel executable's `NOT_INSTALLED` state together with the exact candidate/revision/platform identity and clean Git observations.

This record must never be paraphrased as "Claude Code is not installed on the runner" because the case intentionally does not test that proposition.

## Evidence publication exception

Specification 003's default prohibition on automatically publishing real-conformance results to a remote service remains in force except for this exact record:

- the bounded `anthropic-claude-code` `missing-binary` record may appear in the trusted GitHub Actions job log for the marked canonical-main push;
- no artifact upload is authorized;
- no environment dump, credential, account identifier, billing fact, raw vendor response, hidden reasoning, or unbounded transcript is authorized;
- no actual Claude executable discovery, installation, or execution record may use this exception.

The GitHub Actions log is evidence input for later canonical reconciliation. The log itself does not update candidate tier or capability status.

## Product-path effect

No new runtime product path is authorized.

Implementation is limited to the already-authorized workflow path:

```text
.github/workflows/ci.yml
```

The deterministic `core` matrix must remain unchanged in semantics and continue to run on pull requests and canonical `main` pushes.

## Required qualification before use

The amendment PR itself must pass deterministic Linux/macOS/Windows CI and normal exact-head reconciliation before expected-head merge.

After this amendment is canonical, a separate bounded implementation PR may modify `.github/workflows/ci.yml`. That implementation PR must itself pass deterministic CI and exact-head reconciliation before merge.

The hosted Claude missing-binary job must run only on the resulting marked canonical-main push, never on an untrusted PR head.

## Task effect

A successful hosted matrix may establish only the `missing-binary` sub-fact of **D003-T121** as defined by the existing conformance runner: the missing-executable path returns the required bounded record for the Claude candidate on each hosted platform.

It must **not** mark `D003-T121` complete because invalid/missing-auth behavior remains unqualified and requires actual Claude Code execution, which remains prohibited while Amendment 003's vendor-use authority gate is unsatisfied.

It does not complete **D003-T120** because that task is an ongoing exact executable/version/platform requirement for qualified runs where a real vendor executable exists.

It does not complete any of **D003-T122** through **D003-T137**.

## Explicit non-authority

This amendment does not authorize:

- determining whether the actual Claude Code executable is installed on a hosted runner;
- Claude Code download, installation, unpacking, copying, caching, restoration, discovery, or execution;
- acceptance of Anthropic terms or creation of an Anthropic account;
- OAuth, API-key, cloud-provider, subscription-token, browser-session, or any other credential use;
- authentication-status probing through a Claude executable;
- provider/model requests or paid usage;
- consumer subscription use as a Delethos third-party integration authority claim;
- bypassing Amendment 003's exact-purpose vendor-use evidence gate;
- reading, storing, forwarding, or injecting vendor credentials;
- write-success, exact-cwd provider work, read-only, forbidden-write, model selection, provider failure, timeout/cancel/stall/process-tree, malformed final result, large-output, resume, or any other Claude case;
- any Codex qualification change;
- candidate capability promotion or `GOLD` promotion;
- terminal Specification 003 closeout;
- Specification 004 activation.

## Completion effect

If the one-shot hosted matrix succeeds, only the exact cross-platform Delethos missing-executable observation for the Claude candidate may be reconciled as partial Phase I evidence.

All actual-Claude-executable cases, invalid/missing authentication, controlled posture, credentialed work, provider-backed cases, platform-complete Gold qualification, Claude `GOLD`, the two-Gold terminal gate, Specification 003 closeout, and Specification 004 remain independently blocked until their canonical prerequisites are genuinely machine-observed.