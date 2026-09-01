# Specification 003 Amendment 004 — Hosted Claude Missing-Binary Observation

**Status:** `NORMATIVE` iff this amendment is present on canonical `main` while Specification 003 is active.  
**Evidence date:** 2026-09-02  
**Scope:** one narrowly bounded, no-secret, no-vendor-binary, no-provider-work GitHub-hosted observation for the Claude Code candidate. This amendment does not authorize downloading, installing, unpacking, executing, authenticating, or invoking Claude Code.

## Why this amendment exists

Specification 003 requires real machine-observed evidence for the selected Gold candidates, including missing-binary behavior. Canonical Amendment 003 correctly prohibits hosted Claude Code download, installation, unpacking, or execution while exact-purpose vendor-use authority remains unestablished.

The `missing-binary` conformance case is materially different from vendor execution: it intentionally supplies an isolated `PATH` that does not contain the vendor executable, asks Delethos to observe the absence, and performs no Claude Code process launch, authentication request, provider request, model request, paid session, or vendor-network interaction.

The current project tooling does not provide a locally materialized canonical repository with outbound GitHub access suitable for preserving this observation as reproducible project evidence. GitHub-hosted Linux, macOS, and Windows runners can provide the required platform matrix without materializing or executing any Anthropic binary.

This amendment exists only to permit that bounded observation and its bounded job-log evidence.

## Normative precedence

This amendment supersedes conflicting Specification 003 remote-publication wording only for the exact hosted record defined below.

It does **not** supersede Amendment 003's vendor-use authority gate. In particular, Amendment 003 continues to prohibit every Claude Code download, installation, unpacking, execution, authentication, provider interaction, and model interaction while that gate is unsatisfied.

If any workflow implementation would require a Claude executable to be present or would attempt to obtain one, this amendment provides no authority and the unit must fail closed before that action.

## Authorized hosted observation

The existing `.github/workflows/ci.yml` may add one trusted-`main`-push observation job for `anthropic-claude-code` only when all of the following are true:

1. the workflow event is a push to canonical `main`;
2. the pushed head commit message contains the exact marker `[claude-missing]`;
3. repository permissions remain `contents: read` only;
4. no repository, environment, organization, vendor, or third-party secret is requested or referenced;
5. the workflow does not download, install, unpack, copy, materialize, cache, restore, or otherwise obtain any Claude Code binary or package;
6. the workflow does not invoke `claude`, any Anthropic authentication endpoint, any provider endpoint, or any model;
7. the job runs only the exact conformance case `missing-binary`;
8. the runner's qualification `PATH` supplied to the conformance case is isolated so no ambient Claude executable can satisfy discovery accidentally;
9. bounded conformance output appears only in the GitHub Actions job log; no evidence artifact is uploaded or persisted by the workflow;
10. any unexpected executable discovery, vendor process launch, network/vendor interaction, or case behavior is FAIL/UNVERIFIED and must not be relabeled as PASS.

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
headUnchanged = true
refsUnchanged = true
worktreeDirty = false
```

`source = REAL_CLI` identifies the real-conformance evidence schema/path; it does not assert that a Claude binary was executed. For this case, executable absence is the condition being machine-observed.

## Evidence publication exception

Specification 003's default prohibition on automatically publishing real-conformance results to a remote service remains in force except for this exact record:

- the bounded `anthropic-claude-code` `missing-binary` result may appear in the trusted GitHub Actions job log for the marked canonical-main push;
- no artifact upload is authorized;
- no environment dump, credential, account identifier, billing fact, raw vendor response, hidden reasoning, or unbounded transcript is authorized;
- no Claude Code installation or execution record may use this exception.

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

After this amendment is canonical, a separate bounded implementation PR may modify `.github/workflows/ci.yml`. That implementation PR must pass deterministic CI and exact-head reconciliation before merge.

The hosted Claude missing-binary job must run only on the resulting marked canonical-main push, never on an untrusted PR head.

## Task effect

A successful hosted matrix may establish only the `missing-binary` sub-fact of **D003-T121**.

It must **not** mark `D003-T121` complete because invalid/missing-auth behavior remains unqualified and requires actual Claude Code execution, which remains prohibited while Amendment 003's vendor-use authority gate is unsatisfied.

It does not complete **D003-T120** because that task is an ongoing exact executable/version/platform requirement for qualified runs where an executable exists.

It does not complete any of **D003-T122** through **D003-T137**.

## Explicit non-authority

This amendment does not authorize:

- Claude Code download, installation, unpacking, copying, caching, restoration, or execution;
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

If the one-shot hosted matrix succeeds, only the exact cross-platform Claude missing-binary observation may be reconciled as partial Phase I evidence.

All executable-present Claude cases, invalid/missing authentication, controlled posture, credentialed work, provider-backed cases, platform-complete Gold qualification, Claude `GOLD`, the two-Gold terminal gate, Specification 003 closeout, and Specification 004 remain independently blocked until their canonical prerequisites are genuinely machine-observed.