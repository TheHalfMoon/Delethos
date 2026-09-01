# Specification 003 Evidence — Hosted Claude Sentinel Missing-Binary Observation

**Status:** `PARTIAL_REAL_CONFORMANCE_EVIDENCE — NOT GOLD`  
**Evidence date:** 2026-09-02  
**Authority:** Specification 003, Amendment 003, Amendment 004  
**Real-Gold tracker:** Issue #16

## Scope

This document reconciles exactly one hosted conformance sub-fact for the Claude Code candidate:

```text
missing-binary
```

The canonical conformance runner's `missing-binary` branch does **not** discover or invoke the actual `claude` executable. It deliberately resolves a per-process sentinel name of the form:

```text
delethos-definitely-missing-<pid>
```

and emits the selected adapter identity plus exact revision/platform/Git observations.

Therefore this evidence establishes only Delethos's missing-executable conformance behavior under the `anthropic-claude-code` candidate identity. It does **not** establish whether Claude Code is installed on any hosted runner and must never be described that way.

No Claude Code download, installation, unpacking, discovery, execution, authentication request, provider request, model request, paid session, vendor credential, or vendor-network interaction occurred in this qualification path.

## Exact canonical identity

```text
adapter_id = anthropic-claude-code
adapter_implementation_version = spec003-candidate.2
conformance_schema = delethos.adapter-conformance.candidate.3
delethos_revision = f1513318f740d66ab10575d59a112717f60a5ae4
hosted_run = 33566060117
```

Exact hosted jobs:

```text
linux/x64   = 100049389818
macos/arm64 = 100049389767
windows/x64 = 100049389864
```

The same canonical push completed the deterministic `core` matrix successfully on Linux, macOS, and Windows. The Codex marker-gated job was skipped because the commit carried only `[claude-missing]`.

## Machine-observed result matrix

| Platform | Architecture | Guard | `missing-binary` | Vendor executable path | Vendor CLI version |
| --- | --- | --- | --- | --- | --- |
| Linux | x64 | PASS | PASS | `null` | `null` |
| macOS | arm64 | PASS | PASS | `null` | `null` |
| Windows | x64 | PASS | PASS | `null` | `null` |

Every emitted record identified:

```text
source = REAL_CLI
adapterImplementationVersion = spec003-candidate.2
adapterId = anthropic-claude-code
delethosRevision = f1513318f740d66ab10575d59a112717f60a5ae4
caseId = missing-binary
requestedPosture = null
requestedModel = null
requestedProvider = null
outcome = PASS
detail = missing-state=NOT_INSTALLED
executablePath = null
cliVersion = null
adapterStatus = null
processCause = null
exitCode = null
finalMessagePresent = null
sessionId = null
observedModel = null
headUnchanged = true
refsUnchanged = true
worktreeDirty = false
gitDiffBytes = 0
gitDiffSha256 = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

`source = REAL_CLI` is the existing real-conformance record category. For this exact case it does **not** mean a Claude CLI process existed or executed.

## Guard evidence

Before the conformance command, each platform machine-checked the canonical `missing-binary` branch and required all of the following:

1. the block can be bounded before normal `discoverAdapter(...)` execution;
2. it still contains the deliberate `delethos-definitely-missing-${process.pid}` sentinel;
3. the bounded block contains no `discoverAdapter(` call;
4. the bounded block contains no `startAgent(` call;
5. the bounded block contains no `runClaude(` call;
6. the bounded block contains no `authState(` call.

All three guards emitted:

```text
Sentinel-only missing-binary semantics verified; no vendor executable discovery or invocation is in this case block.
```

This guard is part of the evidence boundary. If the runner semantics drift, Amendment 004 does not authorize silently continuing to publish this hosted record.

## What this evidence establishes

This evidence establishes only that the canonical Delethos real-conformance runner, at exact revision `f1513318f740d66ab10575d59a112717f60a5ae4`, machine-observed the sentinel missing-executable path as PASS under the Claude candidate identity on:

```text
linux/x64
macos/arm64
windows/x64
```

The result is a partial sub-fact of **D003-T121**.

## What this evidence does not establish

This evidence does **not** establish:

- whether the actual Claude Code executable is installed or absent on any runner;
- any actual Claude executable path or version;
- actual Claude Code discovery or platform launch;
- invalid/missing authentication behavior through Claude Code;
- any compatible controlled authentication/configuration posture;
- any credentialed bounded write success;
- provider/model selection, provider success, or provider-declared failure;
- read-only or forbidden-write behavior;
- timeout, cancellation, stall, process-tree cleanup, or partial-diff behavior under Claude execution;
- max-turn, max-budget, tool, permission, large-output, special-path, or resume behavior under Claude execution;
- complete platform qualification for the claimed Gold surface;
- Claude `GOLD`;
- the two-Gold terminal gate;
- terminal Specification 003 closeout;
- Specification 004 authority.

Accordingly:

```text
D003_T121 = OPEN — PARTIAL_MISSING_BINARY_SUBFACT_ONLY
CLAUDE_VENDOR_USE_AUTHORITY = NOT_ESTABLISHED_IN_CANONICAL_EVIDENCE
CLAUDE_HOSTED_EXECUTION = PROHIBITED_WHILE_GATE_UNSATISFIED
CLAUDE_GOLD = NOT_QUALIFIED
SPEC_003_STATUS = ACTIVE_BLOCKED_REAL_GOLD
SPEC_004 = NOT_AUTHORIZED
```

## Vendor-use boundary remains unchanged

Canonical Amendment 003 remains fully controlling for any actual Claude Code download, installation, unpacking, discovery, execution, authentication, provider interaction, model interaction, or credential use.

Amendment 004 did not satisfy or weaken the vendor-use authority gate. It created only a narrowly bounded remote-log exception for the existing sentinel missing-executable conformance branch, which does not touch the Anthropic product.

Any future actual Claude execution still requires genuine exact-purpose vendor-use authority evidence, current/non-revoked status, immediate pre-execution revalidation, fresh official signing facts, detached-manifest verification, artifact/executable integrity verification, exact CLI identity, and any separately required credential/spend authority.

No Gold promotion or successor authority follows from this evidence.